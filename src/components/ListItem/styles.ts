import { StyleSheet } from 'react-native';

export const getStyles = (colour: any) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 16,
        backgroundColor: colour.white,
    },
    content: {
        flex: 1,
        marginLeft: 15,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: colour.black,
    },
    subtitle: {
        fontSize: 14,
        color: colour.lightGrey,
        marginTop: 2,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: colour.lightGrey,
        marginLeft: 16,
    },
    rightContent: {
        marginLeft: 15,
    },
});