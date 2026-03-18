import React from 'react';
import { TouchableOpacity, View, Text, StyleProp, TextStyle, StyleSheet } from 'react-native';
import { colors } from '../../assets/theme/colours';
import { getStyles } from './styles';
import { AppIcons } from '../../assets/icons';

interface CheckboxProps {
    label: string;
    isChecked: boolean;
    onPress: () => void;
    size?: number;
    color?: string;
    labelStyle?: StyleProp<TextStyle>;
}

const Checkbox: React.FC<CheckboxProps> = ({
    label,
    isChecked,
    onPress,
    size = 24,
    color,
    labelStyle,
}) => {
    const colour = colors;
    const styles = getStyles(colour);
    const boxStyle: React.CSSProperties | any = {
        width: size,
        height: size,
        borderRadius: size / 4,
        borderColor: isChecked ? (color || colour.primary) : colour.lightGrey,
        backgroundColor: isChecked ? (color || colour.secondary) : 'transparent',
        borderWidth: 2,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
    };



    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            <View style={boxStyle}>
                {isChecked && (
                    <AppIcons.CheckMark />
                )}
            </View>
            <Text style={[styles.label, labelStyle]}>{label}</Text>
        </TouchableOpacity>
    );
};



export default Checkbox;
