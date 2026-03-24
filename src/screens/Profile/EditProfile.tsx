import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { colors } from '../../assets/theme/colours';
import { styles } from './styles';
import { AppIcons } from '../../assets/icons';
import InputField from '../../components/TextField';

const EditProfile: React.FC = () => {
    const navigation = useNavigation();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <SafeAreaView style={styles.editProfileContainer}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} translucent={false} />
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header Section */}
                <View style={styles.editProfileHeader}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <AppIcons.ArrowBack size={28} color={colors.black} />
                    </TouchableOpacity>
                    <Text style={styles.editProfileTitle}>Edit Profile</Text>
                    <TouchableOpacity style={styles.editProfileCartIconBg}>
                        <AppIcons.Bag size={20} color={colors.white} />
                    </TouchableOpacity>
                </View>

                {/* Form Section */}
                <View style={styles.editProfileFormContainer}>
                    <InputField
                        label="Name"
                        placeholder="Enter name"
                        placeholderTextColor={colors.lightGrey}
                    />

                    <InputField
                        label="Email . ID"
                        placeholder="Enter email . ID"
                        placeholderTextColor={colors.lightGrey}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <InputField
                        label="Password"
                        placeholder="Create password"
                        placeholderTextColor={colors.lightGrey}
                        secureTextEntry={!isPasswordVisible}
                        rightIcon={
                            isPasswordVisible ? (
                                <AppIcons.EyeClose size={20} color={colors.lightGrey} />
                            ) : (
                                <AppIcons.EyeOpen size={20} color={colors.lightGrey} />
                            )
                        }
                        onPressRightIcon={() => setIsPasswordVisible(!isPasswordVisible)}
                    />

                    <InputField
                        label="Pin code"
                        placeholder="00 00 00"
                        placeholderTextColor={colors.lightGrey}
                        keyboardType="numeric"
                        maxLength={6}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default EditProfile;
