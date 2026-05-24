import React, { useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useCustomAlert } from '../../context/AlertContext';
import CustomGradientButton from '../../components/CustomGradientButton';
import CustomInput from '../../components/CustomInput';
import { colors, fontColors } from '../../assets/theme/colours';
import { Fonts as FONTS } from '../../assets/theme/fonts';
import { AppIcons } from '../../assets/icons';
import { loginWithPassword, sendForgotPwdOtp } from '../../api/services';
import { setTokens } from '../../api/services/tokenService';
import { useUser } from '../../context/UserContext';

type RootStackParamList = {
  Login: { type?: 'login' | 'register' | 'reset' };
  OtpScreen: { phone: string; type: 'login' | 'register' | 'reset' };
  LoginPwdScreen: { phone: string };
  MainTabs: undefined;
};

type LoginPwdScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'LoginPwdScreen'
>;
type LoginPwdScreenRouteProp = RouteProp<RootStackParamList, 'LoginPwdScreen'>;

const mergeCustomerIdIntoProfile = async (custId: number | string) => {
  const storedProfile = await AsyncStorage.getItem('profile');
  const existingProfile = storedProfile ? JSON.parse(storedProfile) : {};

  const updatedProfile = {
    ...existingProfile,
    custId,
  };

  await AsyncStorage.setItem('profile', JSON.stringify(updatedProfile));
};

const LoginPwdScreen: React.FC = () => {
  const navigation = useNavigation<LoginPwdScreenNavigationProp>();
  const route = useRoute<LoginPwdScreenRouteProp>();
  const { showAlert } = useCustomAlert();
  const { loadProfile } = useUser();

  const phone = route.params?.phone || '';

  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!password) {
      setError('Password is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await loginWithPassword(phone, password);

      if (response?.success && response?.data) {
        const { accessToken, refreshToken, custId } = response.data;
        await setTokens(accessToken, refreshToken);

        if (custId) {
          await mergeCustomerIdIntoProfile(custId);
        }

        await loadProfile();

        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' as any }],
        });
      } else {
        showAlert(
          'Error',
          response?.message || 'Login failed. Please check your password.',
        );
      }
    } catch (err: any) {
      console.error('Password Login Error:', err);
      const errorMessage =
        typeof err === 'string'
          ? err
          : err?.message || err?.Message || 'Something went wrong';
      showAlert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      setLoading(true);
      const response = await sendForgotPwdOtp(phone);
      if (response?.success && response?.data) {
        navigation.navigate('OtpScreen', {
          phone,
          type: 'reset',
        });
      } else {
        showAlert('Error', response?.message || 'Failed to send OTP');
      }
    } catch (err: any) {
      console.error('Forgot Password Send OTP Error:', err);
      const errorMessage =
        typeof err === 'string'
          ? err
          : err?.message || err?.Message || 'Failed to send OTP';
      showAlert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    // <SafeAreaView style={styles.mainContainer}>
    <ImageBackground
      source={require('../../assets/images/login/bg_test.png')}
      style={styles.backgroundImage}
      resizeMode="stretch"
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerBar}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <AppIcons.ArrowBack size={28} color={colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.headerSection}>
            <Image
              source={require('../../assets/images/login/logo.png')}
              style={styles.logo}
            />
          </View>

          <View style={styles.bottomContainer}>
            <Text style={styles.headerText}>Login with Password</Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('Login', { type: 'login' })}
              style={styles.phoneNoEditContainer}
            >
              <Text style={styles.phoneNoText}>Mobile Number: {phone}</Text>
              <Image
                style={
                  Platform.OS === 'android'
                    ? [styles.editIconImage, { marginBottom: 2 }]
                    : styles.editIconImage
                }
                tintColor={fontColors.titleBlack}
                source={require('../../assets/images/edit_icon.png')}
              />
            </TouchableOpacity>

            <View style={styles.inputSpacing}>
              <CustomInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={text => {
                  setPassword(text);
                  setError('');
                }}
                secureTextEntry={!isPasswordVisible}
                rightIcon={
                  <Image
                    source={require('../../assets/icons/eye.png')}
                    style={{
                      width: wp('5.5%'),
                      height: wp('5.5%'),
                      resizeMode: 'contain',
                      opacity: isPasswordVisible ? 1 : 0.4,
                    }}
                  />
                }
                onPressRightIcon={() =>
                  setIsPasswordVisible(!isPasswordVisible)
                }
                error={error}
              />
            </View>

            <TouchableOpacity
              onPress={handleForgotPassword}
              style={styles.forgotPwdTouchable}
            >
              <Text style={styles.forgotPwdText}>Forgot password?</Text>
            </TouchableOpacity>

            <View style={styles.continueButtonContainer}>
              <CustomGradientButton
                title="Continue"
                onPress={handleLogin}
                loading={loading}
                disabled={!password || loading}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
    // </SafeAreaView>
  );
};

export default LoginPwdScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('3%'),
    paddingTop: Platform.OS === 'ios' ? 0 : hp('1%'),
    height: hp('6%'),
  },
  backButton: {
    padding: 10,
  },
  headerSection: {
    height: hp('35%'),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: wp('30%'),
    height: hp('15%'),
    resizeMode: 'contain',
  },
  bottomContainer: {
    flex: 1,
    paddingHorizontal: wp('5.8%'),
    paddingTop: hp('1%'),
    paddingBottom: hp('4%'),
    backgroundColor: 'transparent',
  },
  headerText: {
    fontFamily: FONTS.gilroyBold,
    fontSize: wp('6%'),
    color: fontColors.titleBlack,
    alignSelf: 'center',
    fontWeight: 'bold',
    marginBottom: hp('1%'),
  },
  phoneNoEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.5%'),
    alignSelf: 'center',
    marginBottom: hp('3%'),
  },
  phoneNoText: {
    fontFamily: FONTS.gilroyRegular,
    fontSize: wp('3.5%'),
    color: fontColors.subtext,
  },
  editIconImage: {
    width: wp('2.79%'),
    height: wp('2.79%'),
    marginLeft: wp('2%'),
  },
  inputSpacing: {
    marginBottom: hp('1.5%'),
  },
  forgotPwdTouchable: {
    alignSelf: 'flex-end',
    marginTop: hp('1%'),
  },
  forgotPwdText: {
    fontFamily: FONTS.gilroyMedium,
    fontSize: wp('3.5%'),
    color: colors.themeTeal || '#F25000',
  },
  continueButtonContainer: {
    marginTop: hp('4%'),
  },
});
