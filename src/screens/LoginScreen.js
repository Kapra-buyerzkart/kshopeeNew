import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import React, { useState, useContext, useRef, useEffect } from 'react';
import logger from '../utils/logger';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { checkPhone, sendForgotPwdOtp, sendLoginOtp } from '../api';
import { setTokens } from '../api/tokenService';
import LoaderComponent from '../components/LoaderComponent';
import { LoaderContext } from '../context/loaderContext';
import { validatePhoneNumbers } from '../utils/validation';
import images from '../assets/images';
import { requestPhoneNumberHint } from '../utils/phoneNumberHint';
import BallPulse from '../components/BallPulse';

const LoginScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { showStatus } = useCart();
  const [phone, setPhone] = useState(route.params?.phone || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const { type } = route.params || {};
  const { showLoader } = useContext(LoaderContext);
  const phoneInputRef = useRef(null);

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslate = useRef(new Animated.Value(-24)).current;
  const tagLineOpacity = useRef(new Animated.Value(0)).current;
  const tagLineTranslate = useRef(new Animated.Value(24)).current;
  const bottomOpacity = useRef(new Animated.Value(0)).current;
  const bottomTranslate = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.stagger(180, [
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(logoTranslate, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(tagLineOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(tagLineTranslate, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(bottomOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(bottomTranslate, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  useEffect(() => {
    if (route.params?.phone) {
      setPhone(route.params.phone);
      return;
    }
    let cancelled = false;

    const timer = setTimeout(async () => {
      const hinted = await requestPhoneNumberHint();
      if (!cancelled && hinted) setPhone(hinted);
    }, 600);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [route.params?.phone]);

  // const phoneNumber = '8137956574';

  const handleContinueLogin = async () => {
    if (!validatePhoneNumbers(phone)) {
      showStatus({
        type: 'error',
        title: 'Error',
        message: 'Please enter a valid mobile number',
      });
      return;
    }

    try {
      setLoading(true);
      showLoader(true);
      const response = await checkPhone(phone);
      logger.log('handleContinueLoginresponse', response);
      logger.log('OTP Response:', response);

      if (response?.data?.exists === true) {
        navigation.navigate('OtpScreen', {
          phone,
          type: 'login',
        });
      } else if (response?.data?.exists === false) {
        navigation.navigate('OtpScreen', {
          phone,
          type: 'register',
        });
      } else {
        showStatus({
          type: 'error',
          title: 'Error',
          message: response?.message || 'Failed to send OTP',
        });
      }
    } catch (error) {
      logger.log('OTP Error:', error);
      showStatus({
        type: 'error',
        title: 'Error',
        message: error?.Message || error?.message || 'Failed to send OTP',
      });
    } finally {
      setLoading(false);
      showLoader(false);
    }
  };

  const handleContinueRest = async () => {
    if (!validatePhoneNumbers(phone)) {
      showStatus({
        type: 'error',
        title: 'Error',
        message: 'Please enter a valid mobile number',
      });
      return;
    }

    try {
      setLoading(true);
      showLoader(true);
      const response = await sendForgotPwdOtp(phone);

      if (response?.success && response?.data) {
        navigation.navigate('OtpScreen', {
          phone,
          type: 'reset',
        });
      } else {
        showStatus({
          type: 'error',
          title: 'Error',
          message: response?.message || 'Failed to send OTP',
        });
      }
    } catch (error) {
      logger.log('OTP Error:', error);
      showStatus({
        type: 'error',
        title: 'Error',
        message: error?.Message || error?.message || 'Failed to send OTP',
      });
    } finally {
      setLoading(false);
      showLoader(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={'dark-content'}
      />
      {type === 'reset' && (
        <TouchableOpacity
          style={[styles.backButton, { top: insets.top ? insets.top + 8 : 16 }]}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.setParams({ type: undefined });
            }
          }}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.8}
        >
          <Feather name="arrow-left" size={20} color="#12372A" />
        </TouchableOpacity>
      )}
      <KeyboardAwareScrollView
        style={styles.keyboardAvoid}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        showsVerticalScrollIndicator={false}
        bottomOffset={Platform.OS === 'ios' ? 40 : 24}
      >
        <View style={styles.topImageContainer}>
          <ImageBackground
            style={styles.backgroundImage}
            source={images.loginLuxuryBg}
            resizeMode="cover"
          />
        </View>
        <Animated.View
          style={[
            styles.bottomContainer,
            {
              opacity: bottomOpacity,
              transform: [{ translateY: bottomTranslate }],
            },
          ]}
        >
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.brandTitleText}>Kapra Gold & Diamonds</Text>
          <Text style={styles.subHeaderText}>
            {type === 'reset' ? 'RESET PASSWORD' : 'LOG IN OR SIGN UP'}
          </Text>

          <View style={styles.titleDivider} />

          <View style={styles.signUpRow}>
            <Text style={styles.dontHaveText}>
              {type === 'reset'
                ? 'Remember password? '
                : "Don't have an account? "}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (type === 'reset') {
                  navigation.setParams({ type: undefined });
                } else {
                  phoneInputRef.current?.focus();
                }
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.signUpLinkText}>
                {type === 'reset' ? 'Log in' : 'Sign up with Mobile'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.countryCode}>+91</Text>
            <View style={styles.inputDivider} />
            <TextInput
              ref={phoneInputRef}
              placeholder="Enter phone number"
              placeholderTextColor="rgba(255, 255, 255, 0.45)"
              keyboardType="number-pad"
              style={styles.input}
              value={phone}
              maxLength={10}
              textContentType="telephoneNumber"
              autoComplete="tel"
              selectionColor="#FFFFFF"
              onChangeText={setPhone}
            />
          </View>

          <TouchableOpacity
            onPress={
              type === 'reset' ? handleContinueRest : handleContinueLogin
            }
            style={styles.continueButton}
            disabled={loading}
            activeOpacity={0.88}
          >
            {loading ? (
              <BallPulse size={'large'} color={'#FFFFFF'} />
            ) : (
              <Text style={styles.continueButtonText}>
                {type === 'reset' ? 'Send Reset OTP' : 'Send OTP'}
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
  },
  welcomeText: {
    fontFamily: 'CormorantGaramond-Italic',
    fontSize: wp('6.5%'),
    lineHeight: wp('7.8%'),
    color: '#12372A',
    textAlign: 'center',
  },
  brandTitleText: {
    fontFamily: 'CormorantGaramond-SemiBold',
    fontSize: wp('7.6%'),
    lineHeight: wp('9.2%'),
    color: '#12372A',
    textAlign: 'center',
    marginTop: 2,
    letterSpacing: -0.2,
  },
  subHeaderText: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3%'),
    letterSpacing: 2,
    color: '#262626',
    textAlign: 'center',
    marginTop: 12,
  },
  titleDivider: {
    width: wp('44%'),
    height: 1.5,
    backgroundColor: '#1E3E30',
    alignSelf: 'center',
    marginTop: 14,
    marginBottom: 26,
  },
  signUpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dontHaveText: {
    fontFamily: 'Lexend-Regular',
    fontSize: wp('3.6%'),
    color: '#262626',
  },
  signUpLinkText: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: wp('3.6%'),
    color: '#165A42',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#0A2A20',
  },
  countryCode: {
    fontFamily: 'Lexend-Medium',
    fontSize: 15,
    color: '#FFFFFF',
  },
  inputDivider: {
    width: 1,
    height: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    marginHorizontal: 14,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Lexend-Medium',
    paddingVertical: 0,
  },
  continueButton: {
    backgroundColor: '#0A2A20',
    width: '100%',
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 18,
  },
  continueButtonText: {
    fontFamily: 'Lexend-Medium',
    fontSize: 15,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  kapraLogo: {
    width: wp('47%'),
    height: hp('20%'),
    resizeMode: 'cover',
  },
  tagLine: {
    width: wp('50.7%'),
    height: hp('16.95%'),
    resizeMode: 'cover',
  },
  headerText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.65%'),
    color: '#000000',
    alignSelf: 'center',
    marginBottom: hp('3%'),
  },
  enterNumberText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.72%'),
    color: '#616161',
  },
  inputContainer: {
    marginTop: hp('1.5%'),
  },
  eyeIcon: {
    width: wp('4.19%'),
    height: hp('1.29%'),
    resizeMode: 'contain',
  },
  forgotPwdText: {
    alignSelf: 'flex-end',
    marginTop: hp('0.5%'),
    color: '#F25000',
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.25%'),
  },
  divider: {
    width: 1,
    height: hp('4%'),
    backgroundColor: '#E5E5E5',
    marginRight: wp('4%'),
  },
});
