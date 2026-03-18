import { sync } from './sync';
import { supabase } from './supabase';

let syncInterval: ReturnType<typeof setInterval> | null = null;
let isSyncing = false;
let syncTimeout: ReturnType<typeof setTimeout> | null = null;

// Debounce sync calls to avoid spamming the database when many events arrive at once
export const triggerSync = () => {
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }
  syncTimeout = setTimeout(async () => {
    if (isSyncing) return;
    try {
      isSyncing = true;
      console.log('Triggering actual sync from manager...');
      await sync();
    } catch (e) {
      console.error('Error during triggered sync:', e);
    } finally {
      isSyncing = false;
    }
  }, 1000); // 1 second debounce
};

export const startSyncManager = () => {
  console.log('Starting sync manager...');
  
  // 1. Initial sync
  triggerSync();

  // 2. Periodic polling as a fallback (every 30 seconds)
  if (!syncInterval) {
    syncInterval = setInterval(() => {
      console.log('Running periodic sync...');
      triggerSync();
    }, 30000);
  }

  // 3. Set up Supabase Realtime subscriptions
  const tables = [
    'products',
    'special_items',
    'users',
    'clients',
    'employees',
    'orders',
    'order_items',
  ];

  const channel = supabase.channel('public:pos_tables');

  tables.forEach((table) => {
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table },
      (payload) => {
        console.log(`Realtime event on ${table}:`, payload.eventType);
        // Trigger a sync when we hear about changes from Supabase
        triggerSync();
      }
    );
  });

  channel.subscribe((status) => {
    console.log('Supabase realtime subscription status:', status);
  });
};

export const stopSyncManager = () => {
  console.log('Stopping sync manager...');
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
  if (syncTimeout) {
    clearTimeout(syncTimeout);
    syncTimeout = null;
  }
  supabase.removeAllChannels();
};
