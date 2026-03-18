/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */


import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RootStack from './src/navigation/rootnavigation';
import SplashScreen from './src/components/SplashScreen/SplashScreen';
import NetworkBanner from './src/components/ShowOfflineMessage/index';
import { useNetworkStatus } from './src/hooks/userNetworkStatus';
import { DatabaseProvider } from '@nozbe/watermelondb/DatabaseProvider';
import database from './src/database';
import { sync } from './src/database/sync';
import { startSyncManager, stopSyncManager } from './src/database/syncManager';
//import { seedDummyClients, seedProducts } from './src/database/seedData';
import { UserProvider } from './src/context/UserContext';
import { AlertProvider } from './src/context/AlertContext';
// import { LightTheme, DarkTheme } from './src/assets/theme/theme';
// import { useColorScheme } from 'react-native';

const queryClient = new QueryClient();

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const isConnected = useNetworkStatus()


  // const scheme = useColorScheme(); // ⬅️ Get system theme
  // const currentTheme = scheme === 'dark' ? DarkTheme : LightTheme;

  // useEffect(() => {
  //   // Seed dummy data when app initializes
  //   seedDummyClients();
  //   seedProducts();
  // }, []);

  useEffect(() => {
    if (isConnected) {
      console.log('App goes online - starting sync manager');
      startSyncManager();
    } else {
      stopSyncManager();
    }

    return () => {
      stopSyncManager();
    };
  }, [isConnected]);


  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <DatabaseProvider database={database}>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <AlertProvider>
            <NavigationContainer>
              {isConnected && <NetworkBanner />}
              <RootStack />
            </NavigationContainer>
          </AlertProvider>
        </UserProvider>
      </QueryClientProvider>
    </DatabaseProvider>
  );
}

export default App;
