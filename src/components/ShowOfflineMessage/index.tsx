import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetworkStatus } from '../../hooks/userNetworkStatus';
import { getStyles } from './styles';
import { colors } from '../../assets/theme/colours';

const NetworkBanner = () => {
    const colour = colors;
    const styles = getStyles(colour);
    const isConnected = useNetworkStatus();

    if (isConnected) return null;

    return (
        <View style={styles.banner}>
            <Text style={styles.text}>⚠️ No Internet Connection</Text>
        </View>
    );
};


export default NetworkBanner;
