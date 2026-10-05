import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import React, { useState, useRef, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { resetPassword } from '../api';
import images from '@/assets/images';
import BallPulse from '@/components/BallPulse';

const ChangePwdScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { showStatus } = useCart();
  const { resetToken, phone } = route.params || {};

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const bottomOpacity = useRef(new Animated.Value(0)).current;
  const bottomTranslate = useRef(new Animated.Value(20)).current;

  useEffect(() => {
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
    ]).start();
  }, [bottomOpacity, bottomTranslate]);

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      showStatus({
        type: 'error',
        title: 'Error',
        message: 'Please fill in both fields',
      });
      return;
    }

    if (newPassword.length < 6) {
      showStatus({
        type: 'error',
        title: 'Weak Password',
        message: 'Password must be at least 6 characters long',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      showStatus({
        type: 'error',
        title: 'Mismatch',
        message: 'Passwords do not match',
      });
      return;
    }

    try {
      setLoading(true);
      if (!resetToken) {
        showStatus({
          type: 'error',
          title: 'Error',
          message: 'Reset token not found. Please restart the process.',
        });
        return;
      }

      const response = await resetPassword(resetToken, newPassword);
      if (response?.success) {
        showStatus({
          type: 'success',
          title: 'Success',
          message: 'Password changed successfully',
          onClose: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'LoginPwdScreen', params: { phone } }],
            });
          },
        });
      } else {
        showStatus({
          type: 'error',
          title: 'Error',
          message:
            response?.message ||
            response?.Message ||
            'Something went wrong. Please try again.',
        });
      }
    } catch (error) {
      showStatus({
        type: 'error',
        title: 'Error',
        message:
          error?.message ||
          error?.Message ||
          (typeof error === 'string' ? error : 'Failed to reset password'),
      });
    } finally {
      setLoading(false);
    }
  };

  const backButtonStyle = [
    styles.backButton,
    { top: insets.top ? insets.top + 8 : 16 },
  ];

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <TouchableOpacity
        style={backButtonStyle}
        onPress={() => navigation.goBack()}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        activeOpacity={0.8}
      >
        <Feather name="arrow-left" size={20} color="#12372A" />
      </TouchableOpacity>

      <KeyboardAwareScrollView
        style={styles.keyboardAvoid}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
        bottomOffset={Platform.OS === 'ios' ? 40 : 24}
      >
        <View style={styles.topImageContainer}>
          <ImageBackground
            style={styles.backgroundImage}
            source={images.pwdLuxuryBg}
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
          <Text style={styles.subHeaderText}>SET NEW PASSWORD</Text>

          <View style={styles.titleDivider} />

          {phone ? (
            <View style={styles.phoneBadge}>
              <Text style={styles.countryCode}>+91</Text>
              <View style={styles.phoneDivider} />
              <Text style={styles.phoneNumberText}>{phone}</Text>
              <Feather name="shield" size={15} color="#0A2A20" />
            </View>
          ) : null}

          {/* New Password */}
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Enter new password"
              placeholderTextColor="rgba(255, 255, 255, 0.45)"
              style={styles.input}
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
              selectionColor="#FFFFFF"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              onPress={() => setShowNewPassword(!showNewPassword)}
              activeOpacity={0.7}
            >
              <Feather
                name={showNewPassword ? 'eye' : 'eye-off'}
                size={20}
                color="rgba(255, 255, 255, 0.6)"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Confirm new password"
              placeholderTextColor="rgba(255, 255, 255, 0.45)"
              style={styles.input}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              selectionColor="#FFFFFF"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              activeOpacity={0.7}
            >
              <Feather
                name={showConfirmPassword ? 'eye' : 'eye-off'}
                size={20}
                color="rgba(255, 255, 255, 0.6)"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.helperText}>
            Must be at least 6 characters long
          </Text>

          <TouchableOpacity
            onPress={handleChangePassword}
            style={styles.continueButton}
            disabled={loading}
            activeOpacity={0.88}
          >
            {loading ? (
              <BallPulse size="large" color="#FFFFFF" />
            ) : (
              <Text style={styles.continueButtonText}>Update Password</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ChangePwdScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
    marginBottom: 20,
  },
  phoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 44,
    marginBottom: 16,
  },
  countryCode: {
    fontFamily: 'Lexend-Medium',
    fontSize: 14,
    color: '#0A2A20',
  },
  phoneDivider: {
    width: 1,
    height: 18,
    backgroundColor: '#D8D8D0',
    marginHorizontal: 10,
  },
  phoneNumberText: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: 14,
    color: '#0A2A20',
    flex: 1,
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#0A2A20',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Lexend-Medium',
    paddingVertical: 0,
  },
  helperText: {
    fontFamily: 'Lexend-Regular',
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    marginBottom: 8,
  },
  continueButton: {
    backgroundColor: '#0A2A20',
    width: '100%',
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 10,
  },
  continueButtonText: {
    fontFamily: 'Lexend-Medium',
    fontSize: 15,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
