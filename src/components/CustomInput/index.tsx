import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { styles } from './styles';
import { colors } from '../../assets/theme/colours';

interface CustomInputProps extends TextInputProps {
    label?: string;
    rightIcon?: React.ReactNode;
    onPressRightIcon?: () => void;
    containerStyle?: StyleProp<ViewStyle>;
}

const CustomInput: React.FC<CustomInputProps> = ({
    label,
    rightIcon,
    onPressRightIcon,
    containerStyle,
    ...rest
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
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
        </View>
    );
};

export default CustomInput;
