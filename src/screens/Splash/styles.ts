import { StyleSheet } from "react-native";

export const getStyles = (colour: any) => StyleSheet.create({
    container:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colour.primary
    },
    title:
    {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: colour.text
    },
});