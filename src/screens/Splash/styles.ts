import { StyleSheet } from "react-native";
import { colors } from "../../assets/theme/colours";

export const getStyles = (colour: any) => StyleSheet.create({
    container:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.themeTeal

    },
    title:
    {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: colour.text
    },
});