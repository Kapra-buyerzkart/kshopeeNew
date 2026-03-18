import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle, View } from 'react-native';
import { getStyles } from './styles';
import { colors } from '../../assets/theme/colours';

// Define the shape of the component's props using an interface
interface ButtonProps {
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
    icon?: React.ReactNode;
}

const BackButton: React.FC<ButtonProps> = ({
    onPress,
    style,
    icon,
}) => {
    const colour = colors;
    const styles = getStyles(colour);
    const buttonStyles: StyleProp<ViewStyle> = [
        styles.button,
        style,
    ].filter(Boolean) as ViewStyle[];

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.iconContainer}>
                {icon}
            </View>
        </TouchableOpacity>
    );
};

export default BackButton;