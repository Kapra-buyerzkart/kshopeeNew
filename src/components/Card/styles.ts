import { StyleSheet } from 'react-native';

export const getStyles = (colour: any) => StyleSheet.create({
    card: {
        backgroundColor: colour.card,
        borderRadius: 12,
        shadowColor: colour.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // For Android
        padding: 20,
        marginVertical: 10,
        marginHorizontal: 16,
    },
});