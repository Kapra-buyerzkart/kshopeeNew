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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCustomAlert } from '../../context/AlertContext';
import CustomGradientButton from '../../components/CustomGradientButton';
import CustomInput from '../../components/CustomInput';
import { colors, fontColors } from '../../assets/theme/colours';
import { Fonts as FONTS } from '../../assets/theme/fonts';
import { AppIcons } from '../../assets/icons';
import { resetPassword } from '../../api/services';

type RootStackParamList = {
  Login: { type?: 'login' | 'register' | 'reset' };
  ChangePwdScreen: { resetToken: string; phone: string };
};

type ChangePwdScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ChangePwdScreen'
>;
type ChangePwdScreenRouteProp = RouteProp<RootStackParamList, 'ChangePwdScreen'>;

const ChangePwdScreen: React.FC = () => {
  const navigation = useNavigation<ChangePwdScreenNavigationProp>();
  const route = useRoute<ChangePwdScreenRouteProp>();
  const { showAlert } = useCustomAlert();

  const { resetToken, phone } = route.params || {};

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newPwdError, setNewPwdError] = useState('');
  const [confirmPwdError, setConfirmPwdError] = useState('');

  const validate = () => {
    let valid = true;
    if (!newPassword || newPassword.length < 6) {
      setNewPwdError('Password must be at least 6 characters');
      valid = false;
    } else {
      setNewPwdError('');
    }
    if (newPassword !== confirmPassword) {
      setConfirmPwdError('Passwords do not match');
      valid = false;
    } else {
      setConfirmPwdError('');
    }
    return valid;
  };

  const handleReset = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const response = await resetPassword(resetToken, newPassword);
      if (response?.success) {
        showAlert(
          'Success',
          'Your password has been reset successfully. Please login.',
        );
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login', params: { type: 'login' } }],
        });
      } else {
        showAlert('Error', response?.message || 'Failed to reset password.');
      }
    } catch (err: any) {
      const msg =
        typeof err === 'string'
          ? err
          : err?.message || err?.Message || 'Something went wrong';
      showAlert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
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
            <Text style={styles.headerText}>Reset Password</Text>
            <Text style={styles.subText}>
              Create a new password for{'\n'}
              <Text style={styles.phoneText}>{phone}</Text>
            </Text>

            <View style={styles.inputSpacing}>
              <CustomInput
                label="New Password"
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={text => {
                  setNewPassword(text);
                  setNewPwdError('');
                }}
                secureTextEntry={!showNew}
                rightIcon={
                  <Image
                    source={require('../../assets/icons/eye.png')}
                    style={{
                      width: wp('5.5%'),
                      height: wp('5.5%'),
                      resizeMode: 'contain',
                      opacity: showNew ? 1 : 0.4,
                    }}
                  />
                }
                onPressRightIcon={() => setShowNew(!showNew)}
                error={newPwdError}
              />
            </View>

            <View style={styles.inputSpacing}>
              <CustomInput
                label="Confirm Password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChangeText={text => {
                  setConfirmPassword(text);
                  setConfirmPwdError('');
                }}
                secureTextEntry={!showConfirm}
                rightIcon={
                  <Image
                    source={require('../../assets/icons/eye.png')}
                    style={{
                      width: wp('5.5%'),
                      height: wp('5.5%'),
                      resizeMode: 'contain',
                      opacity: showConfirm ? 1 : 0.4,
                    }}
                  />
                }
                onPressRightIcon={() => setShowConfirm(!showConfirm)}
                error={confirmPwdError}
              />
            </View>

            <View style={styles.continueButtonContainer}>
              <CustomGradientButton
                title="Reset Password"
                onPress={handleReset}
                loading={loading}
                disabled={!newPassword || !confirmPassword || loading}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default ChangePwdScreen;

const styles = StyleSheet.create({
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
    height: hp('28%'),
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
    marginBottom: hp('0.5%'),
  },
  subText: {
    fontFamily: FONTS.gilroyRegular,
    fontSize: wp('3.5%'),
    color: fontColors.subtext,
    textAlign: 'center',
    marginBottom: hp('3%'),
  },
  phoneText: {
    fontFamily: FONTS.gilroyBold,
    color: fontColors.titleBlack,
  },
  inputSpacing: {
    marginBottom: hp('1.5%'),
  },
  continueButtonContainer: {
    marginTop: hp('3%'),
  },
});
