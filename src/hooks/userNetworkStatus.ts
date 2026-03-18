import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useNetworkStatus() {
    const [isConnected, setIsConnected] = useState(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            const isOnline =
                state.isConnected === true && state.isInternetReachable !== false;

            setIsConnected(isOnline);
        });

        return () => unsubscribe();
    }, []);

    return isConnected;
}
