import NetInfo from '@react-native-community/netinfo';
import {
  initNetworkMonitoring,
  subscribeNetworkStatus,
  checkRealConnectivity,
} from '../src/services/networkService';

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(cb => {
    return jest.fn();
  }),
  fetch: jest.fn(() => Promise.resolve({ isConnected: true, isInternetReachable: true })),
}));

describe('networkService', () => {
  it('subscribes and receives network status callbacks', () => {
    const cb = jest.fn();
    const unsubscribe = subscribeNetworkStatus(cb);
    expect(cb).toHaveBeenCalledWith(
      expect.objectContaining({
        isConnected: expect.any(Boolean),
        isOnline: expect.any(Boolean),
      }),
    );
    unsubscribe();
  });

  it('initializes network monitoring with NetInfo', () => {
    initNetworkMonitoring();
    expect(NetInfo.fetch).toHaveBeenCalled();
  });

  it('performs connectivity check', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 204, ok: true }),
    );

    const isOnline = await checkRealConnectivity();
    expect(isOnline).toBe(true);
  });
});
