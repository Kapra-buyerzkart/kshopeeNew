import React, { useState } from 'react';
import { View, TextInput, Text, StyleProp, ViewStyle, TextInputProps } from 'react-native';
import { colors } from '../../assets/theme/colours';
import { styles } from './styles';

interface PhoneInputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: StyleProp<ViewStyle>;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ label, error, containerStyle, ...rest }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[
                styles.inputWrapper,
                isFocused && styles.focused,
                error && styles.error
            ]}>
                <Text style={styles.prefix}>+91</Text>
                <View style={styles.separator} />
                <TextInput
                    style={styles.input}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholderTextColor={colors.grey}
                    keyboardType="phone-pad"
                    maxLength={10}
                    {...rest}
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

export default PhoneInput;
