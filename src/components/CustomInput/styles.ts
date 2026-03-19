import { StyleSheet } from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { colors, fontColors } from '../../assets/theme/colours';
import { Fonts as FONTS } from '../../assets/theme/fonts';

export const styles = StyleSheet.create({
    container: {
        marginBottom: hp('1%'),
    },
    label: {
        fontFamily: FONTS.gilroyMedium,
        fontSize: wp('4%'),
        color: fontColors.titleBlack,
        marginBottom: hp('1%'),
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: hp('6.5%'),
        borderRadius: wp('8%'),
        borderWidth: 1,
        borderColor: colors.lightGrey,
        paddingHorizontal: wp('5%'),
        backgroundColor: colors.white,
    },
    focusedWrapper: {
        borderColor: colors.primary,
    },
    input: {
        flex: 1,
        color: fontColors.subtext,
        fontSize: wp('3.8%'),
        fontFamily: FONTS.gilroyRegular,
    },
    iconContainer: {
        marginLeft: wp('2%'),
        padding: wp('1%'),
    }
});
