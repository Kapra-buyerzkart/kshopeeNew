import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleProp, ViewStyle, TextStyle, View } from 'react-native';
import { getStyles } from './styles';
import { colors } from '../../assets/theme/colours';

// Define the shape of the component's props using an interface
interface ButtonProps {
    title: string;
    onPress: () => void;
    type?: 'primary' | 'secondary' | 'outline';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    type = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    style,
    textStyle,
    icon,
}) => {
    const colour = colors;
    const styles = getStyles(colour);
    const buttonStyles: StyleProp<ViewStyle> = [
        styles.button,
        styles[type],
        styles[size],
        disabled && styles.disabled,
        style,
    ].filter(Boolean) as ViewStyle[];

    const textStyles: StyleProp<TextStyle> = [
        styles.text,
        type === 'outline' && styles.outlineText,
        textStyle,
    ].filter(Boolean) as TextStyle[];

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {icon && !loading && (
                <View style={styles.iconContainer}>
                    {icon}
                </View>
            )}

            {loading ? (
                <ActivityIndicator color={type === 'outline' ? styles.outlineText.color : styles.text.color} />
            ) : (
                <Text style={type === 'outline' ?styles.outlineText : textStyles}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

export default Button;