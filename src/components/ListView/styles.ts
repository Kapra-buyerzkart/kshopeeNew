import { StyleSheet } from 'react-native';

export const getStyles = (colour: any) =>
    StyleSheet.create({
        center: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        errorText: {
            color: colour.red,
            fontSize: 16,
        },
        emptyText: {
            color: colour.grey,
            fontSize: 16,
        },
        footer: {
            paddingVertical: 16,
            alignItems: 'center',
        },
    });
