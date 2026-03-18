import { StyleSheet } from 'react-native';

export const getStyles = (colour: any) => StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colour.white,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colour.black,
        flex: 1, // Allows the title to take up remaining space
        textAlign: 'center',
    },
    sideContent: {
        minWidth: 40, // Ensures consistent spacing even if content is small
        alignItems: 'center',
    },
    // Spacing for left and right content
    leftSpacer: {
        minWidth: 40,
    },
    rightSpacer: {
        minWidth: 40,
    },
});