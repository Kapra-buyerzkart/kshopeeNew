import { StyleSheet } from 'react-native';

export const getStyles = (colour: any) => StyleSheet.create({
    container: {
        flex: 1,
        maxHeight: '80%',
        justifyContent: 'flex-end',
        backgroundColor: colour.halfTransparent, // Use half-transparent background
        bottom: 0,
        position: 'absolute',
        width: '100%',
    },
    sheet: {
        backgroundColor: 'white',
        padding: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: colour.black,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    option: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: colour.white,
        alignItems: 'center',
    },
    optionText: {
        fontSize: 18,
        color: colour.blue,
    },
    cancelOption: {
        marginTop: 10,
        backgroundColor: colour.white,
        borderRadius: 10,
    },
    cancelText: {
        color: colour.red,
        fontWeight: '600',
    },
});