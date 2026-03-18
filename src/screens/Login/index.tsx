import React, { useState } from 'react';
import {
    View,
    Text,
    ImageBackground,
    Image,
    KeyboardAvoidingView,
    ScrollView,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from './styles';
import { useCustomAlert } from '../../context/AlertContext';
import { checkPhone, sendForgotPwdOtp } from '../../api/services';
import { validatePhoneNumbers } from '../../utils/validation';
import CustomGradientButton from '../../components/CustomGradientButton';
import CustomPhoneInput from '../../components/CustomPhoneInput';

type RootStackParamList = {
    Login: { type?: 'login' | 'register' | 'reset' };
    OtpScreen: { phone: string; type: 'login' | 'register' | 'reset' };
    RegistraionScreen: { phone: string };
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const route = useRoute<LoginScreenRouteProp>();
    const { showAlert } = useCustomAlert();

    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const type = route.params?.type || 'login';

    const handleContinueLogin = async () => {
        if (!validatePhoneNumbers(phone)) {
            showAlert('Error', 'Please enter a valid mobile number');
            return;
        }

        try {
            setLoading(true);
            const response = await checkPhone(phone);

            if (response?.data?.exists === true) {
                navigation.navigate('OtpScreen', {
                    phone,
                    type: 'login'
                });
            } else if (response?.data?.exists === false) {
                navigation.navigate('OtpScreen', {
                    phone,
                    type: 'register'
                });
            } else {
                showAlert('Error', response?.message || 'Failed to check phone number');
            }
        } catch (error: any) {
            console.error('Check Phone Error:', error);
            showAlert('Error', error?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleContinueRest = async () => {
        if (!validatePhoneNumbers(phone)) {
            showAlert('Error', 'Please enter a valid mobile number');
            return;
        }

        try {
            setLoading(true);
            let response;
            if (type === 'login' || type === 'reset') {
                response = await sendForgotPwdOtp(phone);
            }

            if (response?.success && response?.data) {
                navigation.navigate('OtpScreen', {
                    phone,
                    type: 'reset'
                });
            } else {
                showAlert('Error', response?.message || 'Failed to send OTP');
            }
        } catch (error: any) {
            console.error('Reset OTP Error:', error);
            showAlert('Error', error?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <ImageBackground
                        style={styles.backgroundImage}
                        source={require('../../assets/images/imagebackgorund/reg.png')}
                    >
                    </ImageBackground>

                    <View style={styles.bottomContainer}>
                        <View>
                            <Text style={styles.headerText}>
                                {type === 'reset' ? 'Forgot Password' : 'Login or Sign up'}
                            </Text>
                            <Text style={styles.enterNumberText}>Enter your mobile number</Text>

                            <CustomPhoneInput
                                value={phone}
                                onChangeText={setPhone}
                            />
                        </View>

                        <CustomGradientButton
                            title="Continue"
                            onPress={
                                type === 'login' || type === 'register'
                                    ? handleContinueLogin
                                    : handleContinueRest
                            }
                            loading={loading}
                            disabled={phone.length !== 10 || loading}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default LoginScreen;