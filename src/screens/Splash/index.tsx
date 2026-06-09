import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import { getStyles } from './styles';
import { colors } from '../../assets/theme/colours';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

interface SplashScreenProps {
  onFinish?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const colour = colors;
  const styles = getStyles(colour);

  useEffect(() => {
    if (onFinish) {
      const timer = setTimeout(onFinish, 3000);
      return () => clearTimeout(timer);
    }
  }, [onFinish]);

  useEffect(() => {
    setPincodeData();
  }, []);

  const setPincodeData = async () => {
    await AsyncStorage.setItem('pincodeAreaId', '10652');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logos/splashnew.png')}
        style={{ height: heightPercentageToDP('100%'), width: widthPercentageToDP('100%') }}
        resizeMode="cover"
      />
    </View>
  );
};

export default SplashScreen;
