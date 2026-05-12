import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
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
import { useCustomAlert } from '../../context/AlertContext';
import { AppIcons } from '../../assets/icons';
import { colors } from '../../assets/theme/colours';
import {
  requestEmailOtpApi,
  verifyEmailOtpApi,
  requestPhoneOtpApi,
  verifyPhoneOtpApi,
} from '../../api/services/userService';
import CustomPhoneInput from '../../components/CustomPhoneInput';
import CustomGradientButton from '../../components/CustomGradientButton';
import StatusModal from '../../components/StatusModal';

const UpdateContactScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { type } = route.params || { type: 'phone' }; // 'phone' or 'email'
  const { profile, loadProfile } = useUser();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<{ title: string; message: string; type: 'success' | 'error' }>({ title: '', message: '', type: 'success' });

  const showModal = (title: string, message: string, type: 'success' | 'error') => {
    setModalConfig({ title, message, type });
    setModalVisible(true);
  };

  const [value, setValue] = useState('');
  const [originalValue, setOriginalValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const normalizePhone = (ph: string) => {
    // Remove all non-digits
    const digits = ph.replace(/\D/g, '');
    // If it starts with 91 and has 12 digits, strip the 91
    if (digits.startsWith('91') && digits.length === 12) {
      return digits.substring(2);
    }
    // If it has more than 10 digits and starts with 91, try to be smart
    if (digits.length > 10 && digits.startsWith('91')) {
        return digits.slice(-10);
    }
    return digits.slice(-10); // Default to last 10 digits
  };

  useEffect(() => {
    if (profile) {
      const currentVal = type === 'phone' ? normalizePhone(profile.phoneNo || '') : profile.emailId;
      setValue(currentVal || '');
      setOriginalValue(currentVal || '');
    }
  }, [profile, type]);

  const validatePhoneNumbers = (ph: string) => /^[6-9]\d{9}$/.test(ph);

  const handleTextChange = (text: string) => {
    if (type === 'phone') {
      const cleaned = text.replace(/\D/g, '').slice(0, 10);
      setValue(cleaned);
    } else {
      setValue(text);
    }
  };

  const handleRequestOtp = async () => {
    if (!value.trim()) {
      showModal(
        'Error',
        `Please enter a valid ${
          type === 'phone' ? 'phone number' : 'email ID'
        }`,
        'error'
      );
      return;
    }

    if (type === 'phone' && !validatePhoneNumbers(value)) {
      showModal('Error', 'Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const payload = type === 'phone' ? { phone: value } : { email: value };
      const response =
        type === 'phone'
          ? await requestPhoneOtpApi(payload as any)
          : await requestEmailOtpApi(payload as any);

      if (response?.success) {
        navigation.navigate('UpdateContactOtpScreen', { type, contactValue: value });
      } else {
        showModal('Error', response?.message || 'Failed to request OTP', 'error');
      }
    } catch (error) {
      showModal('Error', 'Failed to request OTP. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const isDifferent = value.trim() !== originalValue.trim();
  const isInputValid =
    type === 'phone' ? validatePhoneNumbers(value) : value.includes('@');
  const canRequestOtp = isDifferent && isInputValid;

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
                Update {type === 'phone' ? 'Phone' : 'Email'}
              </Text>
              <View style={{ width: wp('12%') }} />
            </View>
          </ImageBackground>

          <View style={styles.bottomContainer}>
            <View style={styles.formContent}>
              <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View>
                  <Text style={styles.welcomeText}>
                    Update {type === 'phone' ? 'Phone' : 'Email'}
                  </Text>
                  <Text style={styles.subText}>
                    Enter your new{' '}
                    {type === 'phone' ? 'mobile number' : 'email ID'}
                  </Text>

                  {type === 'phone' ? (
                    <CustomPhoneInput
                      value={value}
                      onChangeText={handleTextChange}
                    />
                  ) : (
                    <View style={styles.inputContainer}>
                      <View style={styles.inputWrapper}>
                        <TextInput
                          placeholder={'Enter email ID'}
                          placeholderTextColor="#DADADA"
                          style={styles.input}
                          value={value}
                          onChangeText={handleTextChange}
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                      </View>
                    </View>
                  )}
                </View>

                <CustomGradientButton
                  title="Get OTP"
                  onPress={handleRequestOtp}
                  loading={isLoading}
                  disabled={!canRequestOtp || isLoading}
                />
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
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default UpdateContactScreen;

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
  label: {
    fontSize: wp('3.5%'),
    color: '#616161',
    marginBottom: hp('1%'),
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: hp('6.5%'),
    borderRadius: wp('8%'),
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: wp('5%'),
    backgroundColor: '#FAFAFA',
  },
  prefix: {
    fontSize: wp('4%'),
    color: '#000',
    marginRight: wp('2%'),
    fontWeight: '600',
  },
  input: {
    flex: 1,
    color: '#000',
    fontSize: wp('4%'),
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('1%'),
    paddingHorizontal: wp('2%'),
  },
  otpBox: {
    width: wp('11%'),
    height: wp('11%'),
    backgroundColor: '#F5F5F5',
    borderRadius: wp('2.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  otpInput: {
    fontSize: wp('5%'),
    color: '#000',
    textAlign: 'center',
    width: '100%',
    fontWeight: 'bold',
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
