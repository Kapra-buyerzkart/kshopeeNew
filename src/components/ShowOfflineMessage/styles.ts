import { StyleSheet } from "react-native";
import { fonts } from "../../assets/theme/typography";


export const getStyles = (colour: any) => StyleSheet.create({
    banner: {
        backgroundColor: colour.blue,
        padding: 10,
        alignItems: 'center',
        zIndex: 999,
    },
    text: {
        ...fonts.caption
    },
});