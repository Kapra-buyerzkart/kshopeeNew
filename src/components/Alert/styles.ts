import { StyleSheet } from 'react-native';

export const getStyles = (colour: any) => StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colour.halfTransparent
    },
    alertBox: {
        width: '75%',
        backgroundColor: 'white',
        borderRadius: 15,
        paddingTop: 25,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#666',
        paddingHorizontal: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colour.lightGrey,
    },
    button: {
        flex: 1,
        paddingVertical: 15,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 17,
        fontWeight: '600',
        color: colour.blue,
    },
    separator: {
        width: StyleSheet.hairlineWidth,
        backgroundColor: colour.lightGrey,
    },
});