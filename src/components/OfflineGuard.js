import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import NoNetworkFound from './NoNetworkFound';
import { useNetworkStatus, checkRealConnectivity } from '../services/networkService';
import { queryClient } from '../queryClient';

const OfflineGuard = ({ children }) => {
  const { isOnline } = useNetworkStatus();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // When connection comes back online, reset dismissal state
  useEffect(() => {
    if (isOnline) {
      setIsDismissed(false);
    }
  }, [isOnline]);

  const handleRetry = useCallback(async () => {
    setIsChecking(true);
    try {
      const online = await checkRealConnectivity();
      if (online) {
        setIsDismissed(false);
        queryClient.invalidateQueries();
      }
    } finally {
      setIsChecking(false);
    }
  }, []);

  const handleDismiss = useCallback(() => {
    setIsDismissed(true);
  }, []);

  const showOfflineScreen = !isOnline && !isDismissed;

  return (
    <View style={styles.container}>
      {children}
      {showOfflineScreen && (
        <Modal
          visible={showOfflineScreen}
          animationType="fade"
          transparent={false}
          onRequestClose={handleDismiss}
        >
          <NoNetworkFound
            onRetry={handleRetry}
            isRetrying={isChecking}
            onBack={handleDismiss}
            showBack={true}
            isFullScreen={true}
          />
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default OfflineGuard;
