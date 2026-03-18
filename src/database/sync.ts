import { synchronize } from '@nozbe/watermelondb/sync';
import database from './index';
import { supabase } from './supabase';

/**
 * Returns true for transient network/SSL errors that should be retried later.
 */
function isTransientError(err: any): boolean {
  const msg: string = err?.message ?? '';
  // Cloudflare HTML error pages, SSL failures, network timeouts
  return (
    msg.includes('<!DOCTYPE') ||
    msg.includes('SSL') ||
    msg.includes('ECONNREFUSED') ||
    msg.includes('Network request failed') ||
    msg.includes('timeout')
  );
}

export async function sync() {
  try {
  await synchronize({
    database,
    sendCreatedAsUpdated: true,
    pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
      //console.log(`Pulling changes since: ${lastPulledAt}`);
      const lastPulledAtTimestamp = lastPulledAt || 0;

      const tables = [
        'products',
        'special_items',
        'users',
        'clients',
        'employees',
        'orders',
        'order_items',
      ];

      const changes: any = {};

      for (const table of tables) {
        // Fetch created/updated records
        const { data: updatedData, error: updateError } = await supabase
          .from(table)
          .select('*')
          .gt('updated_at', lastPulledAtTimestamp)
          .is('deleted_at', null);

        if (updateError) throw updateError;

        // Push deleted records
        const { data: deletedData, error: deleteError } = await supabase
          .from(table)
          .select('id')
          .gt('deleted_at', lastPulledAtTimestamp);

        if (deleteError) throw deleteError;

        // Since sendCreatedAsUpdated is true, we always put records in 'updated' (never 'created')
        changes[table] = {
          created: [],
          updated: updatedData,
          deleted: deletedData.map((r) => r.id),
        };
      }

      // Supabase timestamp format is slightly different usually, so we'll grab
      // the current server time to avoid client desync if possible. For simplicity, Date.now()
      return { changes, timestamp: Date.now() };
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      console.log('Pushing changes:', changes);
      for (const [table, change] of Object.entries(changes)) {
        const { created, updated, deleted } = change as any;

        // Clean WatermelonDB internal fields
        const sanitizeRecord = (r: any) => {
          // WatermelonDB objects store the raw data in `_raw`
          const data = r._raw || r;
          const { _status, _changed, ...rest } = data;
          return rest;
        };

        // Push created
        if (created.length > 0) {
          const cleaned = created.map(sanitizeRecord);
          const { error } = await supabase.from(table).upsert(cleaned, { onConflict: 'id' });
          if (error) {
             console.error(`Error inserting/upserting into ${table}:`, error);
             throw error;
          }
        }

        // Push updated
        if (updated.length > 0) {
          const cleaned = updated.map(sanitizeRecord);
          const { error } = await supabase.from(table).upsert(cleaned, { onConflict: 'id' });
          if (error) {
             console.error(`Error updating ${table}:`, error);
             throw error;
          }
        }

        // Push deleted (Soft delete)
        if (deleted.length > 0) {
          // In WatermelonDB pushChanges, `deleted` is an array of record string IDs
          const { error } = await supabase
            .from(table)
            .update({ deleted_at: Date.now() }) // Supabase column type is bigint, needs epoch timestamp
            .in('id', deleted);
          if (error) {
              console.error(`Error deleting from ${table}:`, error);
              throw error;
          }
        }
      }
    },
  });
  } catch (err: any) {
    if (isTransientError(err)) {
      // Suppress raw HTML/SSL errors — these are temporary server-side issues.
      console.warn(
        'Sync skipped: Supabase is temporarily unreachable (SSL/network error). Will retry on next connection.',
      );
      return; // Do not rethrow — app continues working offline
    }
    throw err; // Rethrow real errors (schema mismatch, auth failure, etc.)
  }
}
