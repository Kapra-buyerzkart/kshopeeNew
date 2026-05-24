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
} from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from './styles';
import { useCustomAlert } from '../../context/AlertContext';
import CustomGradientButton from '../../components/CustomGradientButton';
import CustomInput from '../../components/CustomInput';
import TermsCheckBox from '../../components/TermsCheckBox';
import { colors, fontColors } from '../../assets/theme/colours';
import { AppIcons } from '../../assets/icons';
import { setTokens } from '../../api/services/tokenService';
import { getAreasByPincode, registerUser } from '../../api/services';
import AreaSelectionCard from '../../components/AreaSelectionCard';
import { mergeCustomerIdIntoProfile } from '../../utils/profileUtils';

import { useUser } from '../../context/UserContext';

// Using the same typo matching rootnavigation.js if they haven't fixed it
type RootStackParamList = {
  RegistraionScreen: { phone: string; registerToken?: string };
  Login: undefined;
  MainTabs: undefined;
};

type RegistrationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'RegistraionScreen'
>;
type RegistrationScreenRouteProp = RouteProp<
  RootStackParamList,
  'RegistraionScreen'
>;

const RegistrationScreen: React.FC = () => {
  const navigation = useNavigation<RegistrationScreenNavigationProp>();
  const route = useRoute<RegistrationScreenRouteProp>();
  const { showAlert } = useCustomAlert();
  const { loadProfile } = useUser();

  const phone = route.params?.phone || '9988776655'; // Fallback for testing

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pincode, setPincode] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [areas, setAreas] = useState<any[]>([]);
  const [selectedArea, setSelectedArea] = useState<any>(null);

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    pincode: '',
  });

  const handlePincodeChange = async (value: string) => {
    setPincode(value);
    if (value.length === 6) {
      try {
        const response = await getAreasByPincode(value);
        setAreas(response?.data || []);
        setSelectedArea(null);
      } catch (error) {
        console.log('Error fetching areas:', error);
        setAreas([]);
      }
    } else {
      setAreas([]);
      setSelectedArea(null);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', password: '', pincode: '' };

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (pincode.length !== 6) {
      newErrors.pincode = 'Enter a valid 6-digit pincode';
      isValid = false;
    } else if (!selectedArea) {
      newErrors.pincode = 'Please select a valid area';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleContinue = async () => {
    if (!validateForm()) {
      return;
    }
    if (!agreed) {
      showAlert('Error', 'Please accept terms and conditions');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        registerToken: route.params?.registerToken || '',
        name,
        email,
        password,
        whatsAppNo: '',
        referCode: '',
        pincodeAreaId: selectedArea.pincodeAreaId,
        pincodeAreaName: selectedArea.areaName,
      };

      const registerResponse = await registerUser(payload);

      if (registerResponse?.success) {
        showAlert('Success', 'Registration completed successfully', [
          {
            text: 'OK',
            onPress: async () => {
              const { accessToken, refreshToken, custId } =
                registerResponse.data || {};
              if (accessToken && refreshToken) {
                await setTokens(accessToken, refreshToken);
              }
              if (custId) {
                await mergeCustomerIdIntoProfile(custId);
              }
              await loadProfile();
              navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
              });
            },
          },
        ]);
      } else {
        showAlert('Error', registerResponse?.message || 'Registration failed');
      }
    } catch (error: any) {
      console.log('Register error:', error);
      const errorMessage =
        typeof error === 'string'
          ? error
          : error?.message ||
            error?.Message ||
            'Something went wrong. Please try again.';
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
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <Image
              source={require('../../assets/images/login/logo.png')}
              style={styles.logo}
            />
          </View>

          <View style={styles.bottomContainer}>
            <ScrollView
              contentContainerStyle={styles.scrollViewContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.headerText}>Registration</Text>

              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={styles.phoneNoEditContainer}
              >
                <Text style={styles.phoneNoText}>{phone}</Text>
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
                  label="Name"
                  placeholder="Full Name" // Exact matching with user mock
                  value={name}
                  onChangeText={text => {
                    setName(text);
                    setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  error={errors.name}
                />
              </View>

              <View style={styles.inputSpacing}>
                <CustomInput
                  label="Email.ID"
                  placeholder="Enter email . ID"
                  value={email}
                  onChangeText={text => {
                    setEmail(text);
                    setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  keyboardType="email-address"
                  error={errors.email}
                />
              </View>

              <View style={styles.inputSpacing}>
                <CustomInput
                  label="Password"
                  placeholder="Create password"
                  value={password}
                  onChangeText={text => {
                    setPassword(text);
                    setErrors(prev => ({ ...prev, password: '' }));
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
                  error={errors.password}
                />
              </View>

              <View style={styles.inputSpacing}>
                <CustomInput
                  label="Pin code"
                  placeholder="00 00 00"
                  value={pincode}
                  onChangeText={text => {
                    handlePincodeChange(text);
                    setErrors(prev => ({ ...prev, pincode: '' }));
                  }}
                  keyboardType="number-pad"
                  maxLength={6}
                  error={errors.pincode}
                />
              </View>

              <AreaSelectionCard
                areas={areas}
                selectedArea={selectedArea}
                onSelectArea={area => {
                  setSelectedArea(area);
                }}
              />

              <TermsCheckBox
                isChecked={agreed}
                onPress={() => setAgreed(!agreed)}
              />

              <View style={styles.continueButton}>
                <CustomGradientButton
                  title="Continue"
                  onPress={handleContinue}
                  loading={loading}
                />
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
    // </SafeAreaView>
  );
};

export default RegistrationScreen;
