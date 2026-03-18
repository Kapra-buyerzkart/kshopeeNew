import { AppState } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';
import Config from 'react-native-config';

// Initialize the Supabase client
const supabaseUrl = Config.SUPABASE_URL ?? '';
const supabaseAnonKey = Config.SUPABASE_ANON_KEY ?? '';

// Debugging logs to help identify configuration issues
console.log('Supabase URL:', supabaseUrl ? 'Loaded' : 'MISSING');
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Loaded' : 'MISSING');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration is missing! Check your .env file and ensure react-native-config is set up correctly.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key', 
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
