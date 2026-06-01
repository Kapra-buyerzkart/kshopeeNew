import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { styles } from './styles';
import { colors } from '../../assets/theme/colours';

interface CustomInputProps extends TextInputProps {
    label?: string;
    rightIcon?: React.ReactNode;
    onPressRightIcon?: () => void;
    containerStyle?: StyleProp<ViewStyle>;
    error?: string;
    isRequired?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
    label,
    rightIcon,
    onPressRightIcon,
    containerStyle,
    error,
    isRequired,
    ...rest
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={[styles.label, { marginBottom: 0 }]}>{label}</Text>
                    {isRequired ? (
                        <Text style={{ color: 'red', marginLeft: 2, fontSize: 14 }}>*</Text>
                    ) : (
                        <Text style={{ color: colors.grey, marginLeft: 4, fontSize: 12 }}>(Optional)</Text>
                    )}
                </View>
            )}
            <View style={[styles.inputWrapper, isFocused && styles.focusedWrapper]}>
                <TextInput
                    style={styles.input}
                    placeholderTextColor={colors.grey}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...rest}
                />
                {rightIcon && (
                    <TouchableOpacity onPress={onPressRightIcon} style={styles.iconContainer}>
                        {rightIcon}
                    </TouchableOpacity>
                )}
            </View>
            {!!error && <Text style={{ color: 'red', fontSize: 12, marginTop: 4, marginLeft: 4 }}>{error}</Text>}
        </View>
    );
};

export default CustomInput;
