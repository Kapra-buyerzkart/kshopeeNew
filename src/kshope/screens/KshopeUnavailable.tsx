import React, { useContext, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { AppContext } from '../../context/appContext';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import images from '../../assets/images';

const KshopeUnavailable: React.FC = () => {
  const { logout } = useContext(AppContext) || {};
  const forcedRef = useRef(false);

  useEffect(() => {
    if (forcedRef.current) return;
    forcedRef.current = true;
    logout?.(true);
  }, [logout]);

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={'dark-content'}
      />
      
      <View style={styles.topImageContainer}>
        <ImageBackground
          style={styles.backgroundImage}
          source={images.loginLuxuryBg}
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>Session expired</Text>
        <Text style={styles.body}>
          Log in again to unlock Kapra Gold & Diamonds and keep shopping exclusive collections.
        </Text>

        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.button}
          onPress={() => logout?.(true)}>
          <Text style={styles.buttonLabel}>Log in again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topImageContainer: {
    width: '100%',
    flex: 1,
    minHeight: hp('40%'),
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  bottomContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingHorizontal: wp('7%'),
    paddingTop: 32,
    paddingBottom: hp('8%'),
    marginTop: -32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 6,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'CormorantGaramond-SemiBold',
    fontSize: wp('7.6%'),
    lineHeight: wp('9.2%'),
    color: '#12372A',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  body: {
    fontFamily: 'Lexend-Regular',
    fontSize: wp('3.6%'),
    lineHeight: wp('5.5%'),
    color: '#262626',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#0A2A20',
    width: '100%',
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  buttonLabel: {
    fontFamily: 'Lexend-Medium',
    fontSize: 15,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});

export default KshopeUnavailable;
