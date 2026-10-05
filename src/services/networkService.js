import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import logger from '../utils/logger';

let isConnected = true;
let isInternetReachable = true;
const listeners = new Set();

const notifyListeners = () => {
  const isOnline = Boolean(isConnected && isInternetReachable !== false);
  listeners.forEach(cb => {
    try {
      cb({ isConnected, isInternetReachable, isOnline });
    } catch (e) {
      logger.error('Error in network listener', e);
    }
  });
};

/**
 * Fast ping check to verify true internet reachability
 */
export const checkRealConnectivity = async (timeoutMs = 4000) => {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    // Google generate_204 is the standard lightweight connectivity check on Android/Chrome
    const response = await fetch('https://clients3.google.com/generate_204', {
      method: 'HEAD',
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timer);

    const online = response.status === 204 || response.ok;
    isConnected = online;
    isInternetReachable = online;
    notifyListeners();
    return online;
  } catch (err) {
    // If NetInfo also says disconnected, confirm offline
    const netState = await NetInfo.fetch().catch(() => null);
    const online = Boolean(netState?.isConnected && netState?.isInternetReachable !== false);
    isConnected = online;
    isInternetReachable = online;
    notifyListeners();
    return online;
  }
};

/**
 * Initialize NetInfo subscription and connect with TanStack Query onlineManager
 */
export const initNetworkMonitoring = () => {
  // Sync React Query with NetInfo
  onlineManager.setEventListener(setOnline => {
    return NetInfo.addEventListener(state => {
      const online = Boolean(state.isConnected && state.isInternetReachable !== false);
      isConnected = Boolean(state.isConnected);
      isInternetReachable = state.isInternetReachable;
      setOnline(online);
      notifyListeners();
    });
  });

  // Initial fetch
  NetInfo.fetch().then(state => {
    isConnected = Boolean(state.isConnected);
    isInternetReachable = state.isInternetReachable;
    notifyListeners();
  }).catch(() => {});
};

/**
 * Subscribe to network state changes
 */
export const subscribeNetworkStatus = callback => {
  listeners.add(callback);
  callback({
    isConnected,
    isInternetReachable,
    isOnline: Boolean(isConnected && isInternetReachable !== false),
  });
  return () => {
    listeners.delete(callback);
  };
};

/**
 * Hook to read current network status in components
 */
export const useNetworkStatus = () => {
  const [status, setStatus] = useState({
    isConnected,
    isInternetReachable,
    isOnline: Boolean(isConnected && isInternetReachable !== false),
  });

  useEffect(() => {
    return subscribeNetworkStatus(setStatus);
  }, []);

  return status;
};

export default {
  initNetworkMonitoring,
  checkRealConnectivity,
  subscribeNetworkStatus,
  useNetworkStatus,
};
