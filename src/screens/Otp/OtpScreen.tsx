import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    Image,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    ActivityIndicator,
    Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RNOtpVerify from 'react-native-otp-verify';
import { mergeCustomerIdIntoProfile } from '../../utils/profileUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { hp } from '../../utils/responsive';
import { colors, fontColors } from '../../assets/theme/colours';
import { useCart } from '../../context/CartContext';
import { useCustomAlert } from '../../context/AlertContext';
import { styles } from './styles';
import {
    verifyLoginOtp,
    sendLoginOtp,
    sendForgotPwdOtp,
    verifyForgotPwdOtp,
    resendLoginOtp,
    resendForgotPwdOtp,
    verifyRegisterOtp,
    sendRegisterOtp
} from '../../api/services';
import CustomGradientButton from '../../components/CustomGradientButton';
import { Fonts } from '../../assets/theme/fonts';

import { useUser } from '../../context/UserContext';

const ACCESS_TOKEN = 'ACCESS_TOKEN';
const REFRESH_TOKEN = 'REFRESH_TOKEN';

type RootStackParamList = {
    Login: { type?: 'login' | 'register' | 'reset' };
    OtpScreen: {
        phone: string;
        type: 'login' | 'register' | 'reset';
        name?: string;
        email?: string;
        password?: string;
        whatsAppNo?: string;
        referCode?: string;
        pincodeAreaId?: number | string;
    };
    RegistraionScreen: { phone: string; registerToken: string };
    MainTabs: undefined;
    ChangePwdScreen: { resetToken: string; phone: string };
    LoginPwdScreen: { phone: string };
};

type OtpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OtpScreen'>;
type OtpScreenRouteProp = RouteProp<RootStackParamList, 'OtpScreen'>;

const setTokens = async (accessToken: string, refreshToken: string) => {
    await AsyncStorage.multiSet([
        [ACCESS_TOKEN, accessToken],
        [REFRESH_TOKEN, refreshToken],
    ]);
};


const OtpScreen: React.FC = () => {
    const navigation = useNavigation<OtpScreenNavigationProp>();
    const route = useRoute<OtpScreenRouteProp>();
    const { showAlert } = useCustomAlert();
    const { loadProfile } = useUser();
    const { phone, type } = route.params || {};

    const [otp, setOtp] = useState(['', '', '', '', '']);
    const inputRefs = [
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
    ];

    const [timer, setTimer] = useState(60);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const otpHandler = (message: string) => {
        try {
            const otpMatch = /(\d{5})/g.exec(message);
            if (otpMatch && otpMatch[1]) {
                const autoOtp = otpMatch[1];
                const otpArray = autoOtp.split('');
                setOtp(otpArray);
                Keyboard.dismiss();
                RNOtpVerify.removeListener();
            }
        } catch (error) {
            console.log('OTP Parse Error:', error);
        }
    };

    useEffect(() => {
        const sendOtpOnLoad = async () => {
            if (!phone) return;

            try {
                setLoading(true);
                let response;
                if (type === 'login') {
                    response = await sendLoginOtp(phone);
                } else if (type === 'register') {
                    response = await sendRegisterOtp(phone);
                }

                if (response?.success === false) {
                    if (response?.status === 'NOT_REGISTERED') {
                        showAlert('Not Registered', 'This phone number is not registered. Please sign up.');
                        navigation.navigate('Login', { type: 'register' });
                    } else if (response?.status === 'ALREADY_REGISTERED') {
                        showAlert('Already Registered', 'This phone number is already registered. Please login.');
                        navigation.navigate('Login', { type: 'login' });
                    } else {
                        showAlert('Error', response?.message || 'Failed to send OTP');
                    }
                }
            } catch (error: any) {
                console.log('Send OTP Error:', error);
                showAlert('Error', error?.message || 'Failed to send OTP');
            } finally {
                setLoading(false);
            }
        };

        sendOtpOnLoad();
    }, [type, phone]);

    useEffect(() => {
        if (Platform.OS !== 'android') return;

        const startOtpListener = async () => {
            try {
                await RNOtpVerify.getHash();
                await RNOtpVerify.getOtp();
                RNOtpVerify.addListener(otpHandler);
            } catch (error) {
                console.log('OTP Auto Fetch Error:', error);
            }
        };

        startOtpListener();

        return () => {
            RNOtpVerify.removeListener();
        };
    }, []);

    useEffect(() => {
        let interval: any;
        if (isResendDisabled) {
            interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setIsResendDisabled(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isResendDisabled]);

    const handleChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < inputRefs.length - 1) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handleContinueLogin = async () => {
        const enteredOtp = otp.join('');
        if (enteredOtp.length < 5) {
            showAlert('Error', 'Please enter complete OTP');
            return;
        }

        try {
            setLoading(true);
            const response = await verifyLoginOtp(phone, enteredOtp);

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
                showAlert('Error', response?.message || 'OTP verification failed');
            }
        } catch (error: any) {
            console.log('Verify OTP Error:', error);
            showAlert('Error', error?.message || 'Failed to verify OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleContinueRegister = async () => {
        const enteredOtp = otp.join('');
        if (enteredOtp.length < 5) {
            showAlert('Error', 'Please enter complete OTP');
            return;
        }

        try {
            setLoading(true);
            const response = await verifyRegisterOtp(phone, enteredOtp);

            if (response?.success && response?.data) {
                const registerToken = response.data.registerToken;
                navigation.navigate('RegistraionScreen', {
                    registerToken,
                    phone
                });
            } else {
                showAlert('Error', response?.message || 'OTP verification failed');
            }
        } catch (error: any) {
            console.log('Verify OTP Error:', error);
            showAlert('Error', error?.message || 'Failed to verify OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleContinueReset = async () => {
        const enteredOtp = otp.join('');
        if (enteredOtp.length < 5) {
            showAlert('Error', 'Please enter complete OTP');
            return;
        }

        try {
            setLoading(true);
            const response = await verifyForgotPwdOtp(phone, enteredOtp);

            if (response?.success && response?.data) {
                navigation.reset({
                    index: 0,
                    routes: [{
                        name: 'ChangePwdScreen',
                        params: { resetToken: response?.data?.resetToken, phone }
                    }],
                });
            } else {
                showAlert('Error', response?.message || 'OTP verification failed');
            }
        } catch (error: any) {
            console.log('Verify OTP Error:', error);
            showAlert('Error', error?.message || 'Failed to verify OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            setLoading(true);
            let response;
            if (type === 'login') {
                response = await resendLoginOtp(phone);
            } else if (type === 'reset') {
                response = await resendForgotPwdOtp(phone);
            }

            if (response?.success) {
                showAlert('Success', 'OTP resent successfully');
                setOtp(['', '', '', '', '']);
                inputRefs[0].current?.focus();
                setTimer(60);
                setIsResendDisabled(true);
            } else {
                showAlert('Error', response?.message || 'Failed to resend OTP');
            }
        } catch (error: any) {
            console.log('Resend OTP Error:', error);
            showAlert('Error', error?.message || 'Failed to resend OTP');
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
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <ImageBackground
                        style={styles.backgroundImage}
                        source={require('../../assets/images/imagebackgorund/reg.png')}
                    >
                    </ImageBackground>

                    <View style={styles.bottomContainer}>
                        <Text style={styles.headerText}>{
                            type === 'login'
                                ? "Login / Sign Up"
                                : type === 'reset'
                                    ? "Forgot Password"
                                    : "Login / Sign Up"
                        }</Text>

                        <TouchableOpacity onPress={() => navigation.navigate('Login', {
                            type: type
                        })} style={styles.phoneNoEditContainer}>
                            <Text style={styles.phoneNoText}>Otp has been sent to your mobile number {phone}</Text>
                            <Image
                                style={
                                    Platform.OS === 'android'
                                        ? [styles.editIconImage, { bottom: hp('0.2%') }]
                                        : styles.editIconImage
                                }
                                tintColor={fontColors.titleBlack}
                                source={require('../../assets/images/edit_icon.png')}
                            />
                        </TouchableOpacity>

                        <Text style={styles.enterNumberText}>Enter OTP</Text>

                        <View style={styles.otpContainer}>
                            {otp.map((digit, index) => (
                                <View style={styles.numberBox} key={index}>
                                    <TextInput
                                        ref={inputRefs[index]}
                                        style={styles.otpInput}
                                        keyboardType="numeric"
                                        maxLength={1}
                                        value={digit}
                                        textContentType="oneTimeCode"
                                        autoComplete="sms-otp"
                                        onChangeText={(text) => handleChange(text, index)}
                                        onKeyPress={(e) => handleKeyPress(e, index)}
                                    />
                                </View>
                            ))}
                        </View>

                        <View style={styles.pwdResendTimeContainer}>
                            <TouchableOpacity
                                style={type === 'reset' ? { height: 0 } : undefined}
                                onPress={() => navigation.navigate('LoginPwdScreen', { phone })}
                            >
                                <Text style={styles.usePwdText}>Use password</Text>
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {isResendDisabled ? (
                                    <>
                                        <Text style={[styles.usePwdText, {}]}>Resend OTP in </Text>
                                        <Text style={styles.time}>
                                            {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                                        </Text>
                                    </>
                                ) : (
                                    <TouchableOpacity onPress={handleResendOtp}>
                                        <Text style={[styles.usePwdText, { color: fontColors.subtext, fontFamily: Fonts.gilroyRegular, }]}>Resend OTP</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        <CustomGradientButton
                            title="Continue"
                            onPress={
                                type === 'login'
                                    ? handleContinueLogin
                                    : type === 'reset'
                                        ? handleContinueReset
                                        : handleContinueRegister
                            }
                            loading={loading}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default OtpScreen;
