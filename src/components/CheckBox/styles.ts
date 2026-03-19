import { StyleSheet } from 'react-native';
import { colors, fontColors } from '../../assets/theme/colours';

export const getStyles = (colour: any) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 0.7,
        borderColor: colour.themeTeal,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checked: {
        backgroundColor: colour.primary,
        borderColor: colour.secondary,
    },
    checkmark: {
        color: colour.white,
    },
    label: {
        marginLeft: 10,
        fontSize: 14,
        color: fontColors.subtext,
    },
});