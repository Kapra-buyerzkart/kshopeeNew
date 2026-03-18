import { StyleSheet } from 'react-native';
import { colors } from '../../assets/theme/colours';
import { fonts } from '../../assets/theme/typography';

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 24,
    },
    label: {
        ...fonts.subtitle2,
        color: colors.grey,
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: 25,
        paddingHorizontal: 16,
        height: 50,
        backgroundColor: colors.white,
    },
    focused: {
        borderColor: colors.themeTeal,
    },
    error: {
        borderColor: colors.red,
    },
    prefix: {
        ...fonts.body1,
        color: colors.black,
        marginRight: 10,
    },
    separator: {
        width: 1,
        height: '60%',
        backgroundColor: colors.lightGrey,
        marginRight: 12,
    },
    input: {
        flex: 1,
        ...fonts.body1,
        color: colors.black,
        height: '100%',
        padding: 0,
    },
    errorText: {
        ...fonts.caption,
        color: colors.red,
        marginTop: 4,
        marginLeft: 16,
    },
});
