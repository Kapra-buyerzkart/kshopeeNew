import { StyleSheet } from 'react-native';

export const getStyles = (colour: any) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: colour.lightGrey,
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
        fontSize: 16,
        color: colour.grey,
    },
});