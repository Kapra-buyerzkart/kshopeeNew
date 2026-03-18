import NetInfo from '@react-native-community/netinfo';

/**
 * Checks the current network status directly (one-time, non-reactive).
 * Use this inside async functions where you can't use a hook.
 */
export async function isOnline(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return state.isConnected === true && state.isInternetReachable !== false;
}

/**
 * Fetches data from Supabase when online, falls back to WatermelonDB when offline.
 *
 * @param onlineFetch  Async function that returns data from Supabase.
 * @param offlineFetch Async function that returns data from WatermelonDB.
 * @returns The result from whichever source was used.
 */
export async function networkFirstFetch<T>(
  onlineFetch: () => Promise<T>,
  offlineFetch: () => Promise<T>,
): Promise<T> {
  const online = await isOnline();
  if (online) {
    return onlineFetch();
  }
  return offlineFetch();
}
