import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getStyles } from './styles';
import { colors } from '../../assets/theme/colours';

interface SplashScreenProps {
    onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
    const colour = colors;
    const styles = getStyles(colour);
    useEffect(() => {
        const timer = setTimeout(onFinish, 3000);
        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colour.white }]}>Welcome to POS App</Text>
            <ActivityIndicator size="large" color={colour.primary} />
        </View>
    );
};


export default SplashScreen;