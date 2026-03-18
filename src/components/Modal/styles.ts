import { StyleSheet } from 'react-native';

export const getStyles = (colour: any) => StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colour.halfTransparent
    },
    modalView: {
        width: '80%',
        backgroundColor: colour.white,
        borderRadius: 12,
        padding: 25,
        alignItems: 'center',
        shadowColor: colour.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});