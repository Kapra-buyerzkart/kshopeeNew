import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RootStack from './src/navigation/rootnavigation';
import SplashScreen from './src/screens/Splash';
import NetworkBanner from './src/components/ShowOfflineMessage/index';
import { useNetworkStatus } from './src/hooks/userNetworkStatus';
import { UserProvider } from './src/context/UserContext';
import { AlertProvider } from './src/context/AlertContext';


const queryClient = new QueryClient();

import { navigationRef } from './src/api/NavigationService';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const isConnected = useNetworkStatus()

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <AlertProvider>
          <NavigationContainer ref={navigationRef}>
            {isConnected && <NetworkBanner />}
            <RootStack />
          </NavigationContainer>
        </AlertProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
