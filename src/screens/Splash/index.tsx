import React, { useEffect } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { colors } from '../../assets/theme/colours';
import SplashSvg from '../../assets/images/imagebackgorund/splash.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

    const setInitialPin = async () => {
        await AsyncStorage.setItem('pincodeAreaId', "10652");
    }

    useEffect(() => {
        setInitialPin();
    }, []);

    return (
        <View style={styles.container}>
            <SplashSvg width="100%" height="100%" />
        </View>
    );
};

export default SplashScreen;