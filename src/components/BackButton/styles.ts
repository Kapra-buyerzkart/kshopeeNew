import { StyleSheet } from 'react-native';
import { fonts } from '../../assets/theme/typography';

export const getStyles = (colour: any) => StyleSheet.create({
    button: {
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    text: {
        ...fonts.body1,
        color: colour.text,
    },
    primary: {
        color: colour.primary, // iOS blue
        backgroundColor: colour.secondary,
    },
    secondary: {
        color: colour.secondary, // Gray
        backgroundColor: colour.primary,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colour.primary,
    },
    outlineText: {
        color: colour.primary,
    },
    large: {
        paddingVertical: 16,
        paddingHorizontal: 24,
    },
    small: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    medium: {
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    disabled: {
        opacity: 0.5,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },

});
