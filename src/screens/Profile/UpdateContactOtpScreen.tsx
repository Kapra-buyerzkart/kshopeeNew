import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { wp, hp } from '../../utils/responsive';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';
import StatusModal from '../../components/StatusModal';
import { AppIcons } from '../../assets/icons';
import { colors } from '../../assets/theme/colours';
import {
  verifyEmailOtpApi,
  verifyPhoneOtpApi,
  requestPhoneOtpApi,
  requestEmailOtpApi
} from '../../api/services/userService';
import CustomGradientButton from '../../components/CustomGradientButton';

const UpdateContactOtpScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { type, contactValue } = route.params || {}; 
  const { loadProfile } = useUser();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<{ title: string; message: string; type: 'success' | 'error', onCloseCallback?: () => void }>({ title: '', message: '', type: 'success' });

  const showModal = (title: string, message: string, type: 'success' | 'error', onCloseCallback?: () => void) => {
    setModalConfig({ title, message, type, onCloseCallback });
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (modalConfig.onCloseCallback) {
        modalConfig.onCloseCallback();
    }
  };

  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const otpRefs = useRef<any>([]);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleRequestOtp = async () => {
    try {
      setIsLoading(true);
      const payload = type === 'phone' ? { phone: contactValue } : { email: contactValue };
      const response =
        type === 'phone'
          ? await requestPhoneOtpApi(payload as any)
          : await requestEmailOtpApi(payload as any);

      if (response?.success) {
        setTimer(30);
        setCanResend(false);
        setOtp(['', '', '', '', '']);
        otpRefs.current[0]?.focus();
      } else {
        showModal('Error', response?.message || 'Failed to request OTP', 'error');
      }
    } catch (error) {
      showModal('Error', 'Failed to request OTP. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 5) {
      showModal('Error', 'Please enter the 5-digit OTP', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const payload =
        type === 'phone'
          ? { phone: contactValue, otp: otpValue }
          : { email: contactValue, otp: otpValue };

      const response =
        type === 'phone'
          ? await verifyPhoneOtpApi(payload as any)
          : await verifyEmailOtpApi(payload as any);

      if (response?.success) {
        await loadProfile();
        showModal(
          'Success',
          `${type === 'phone' ? 'Phone Number' : 'Email ID'} updated successfully`,
          'success',
          () => {
              // Reset stack routing to Profile/MainTabs properly
              navigation.reset({
                  index: 0,
                  routes: [{ name: 'MainTabs', params: { screen: 'KebraScreen' } as any }],
              });
          }
        );
      } else {
        showModal('Error', response?.message || 'Verification failed', 'error');
      }
    } catch (error) {
      showModal('Error', 'Invalid OTP or verification failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 4) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (event: any, index: number) => {
    if (event.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <ImageBackground
            style={styles.backgroundImage}
            source={require('../../assets/images/imagebackgorund/reg.png')}
          >
            <View style={styles.headerRow}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <AppIcons.ArrowBack size={28} color={colors.white} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>
                Verify OTP
              </Text>
              <View style={{ width: wp('12%') }} />
            </View>
          </ImageBackground>

          <View style={styles.bottomContainer}>
            <View style={styles.formContent}>
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                  <View>
                    <Text style={styles.welcomeText}>Verify OTP</Text>
                    <Text style={styles.subText}>
                      Enter the 5-digit code sent to {contactValue}
                    </Text>

                    <View style={styles.inputContainer}>
                      <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                          <View style={styles.otpBox} key={index}>
                            <TextInput
                              ref={el => (otpRefs.current[index] = el)}
                              style={styles.otpInput}
                              keyboardType="number-pad"
                              maxLength={1}
                              value={digit}
                              onChangeText={text => handleOtpChange(text, index)}
                              onKeyPress={e => handleBackspace(e, index)}
                            />
                          </View>
                        ))}
                      </View>
                    </View>

                    <View style={styles.resendRow}>
                      {canResend ? (
                        <TouchableOpacity onPress={handleRequestOtp}>
                          <Text style={styles.resendTextActive}>Resend OTP</Text>
                        </TouchableOpacity>
                      ) : (
                        <Text style={styles.resendTextDisabled}>
                          Resend OTP in {timer}s
                        </Text>
                      )}
                    </View>
                  </View>

                  <View>
                    <CustomGradientButton
                      title="Verify & Update"
                      onPress={handleVerifyOtp}
                      loading={isLoading}
                      disabled={isLoading}
                    />

                    <TouchableOpacity
                      onPress={() => navigation.goBack()}
                      style={styles.changeContactLink}
                    >
                      <Text style={styles.changeContactLinkText}>
                        Change {type === 'phone' ? 'Phone' : 'Email'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <StatusModal
        visible={modalVisible}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={handleModalClose}
      />
    </SafeAreaView>
  );
};

export default UpdateContactOtpScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    paddingTop: Platform.OS === 'ios' ? hp('5%') : hp('2%'),
    paddingBottom: hp('7.5%'),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('2%'),
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: wp('5%'),
    color: colors.white,
    fontWeight: 'bold',
    fontFamily: 'Gilroy-Bold',
  },
  bottomContainer: {
    height: hp('35%'),
    backgroundColor: colors.white,
    borderTopLeftRadius: wp('9.3%'),
    borderTopRightRadius: wp('9.3%'),
    marginTop: -hp('4%'),
    paddingTop: hp('3%'),
    paddingBottom: hp('4%'),
    paddingHorizontal: wp('5.8%'),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    justifyContent: 'space-between',
  },
  formContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: wp('4.65%'),
    color: '#000',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: hp('3%'),
    fontFamily: 'Gilroy-Bold',
  },
  subText: {
    fontSize: wp('3.72%'),
    color: '#616161',
    marginBottom: hp('1.5%'),
    fontFamily: 'Gilroy-Regular',
  },
  inputContainer: {
    marginBottom: hp('2.5%'),
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('1%'),
    paddingHorizontal: wp('2%'),
  },
  otpBox: {
    width: wp('12.95%'),
    height: hp('6.36%'),
    backgroundColor: colors.white,
    borderWidth: 0.5,
    borderColor: '#E5E5E5',
    borderRadius: wp('6.33%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpInput: {
    fontSize: wp('4.5%'),
    textAlign: 'center',
    width: '100%',
    color: '#000',
  },
  resendRow: {
    alignItems: 'center',
    marginTop: hp('2.5%'),
  },
  resendTextActive: {
    fontSize: wp('3.5%'),
    color: colors.themeTeal || '#F25000',
    fontWeight: 'bold',
  },
  resendTextDisabled: {
    fontSize: wp('3.5%'),
    color: '#616161',
  },
  changeContactLink: {
    alignItems: 'center',
    marginTop: hp('4%'),
  },
  changeContactLinkText: {
    fontSize: wp('3.5%'),
    color: colors.themeTeal || '#F25000',
    textDecorationLine: 'underline',
  },
});
