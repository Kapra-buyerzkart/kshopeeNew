import { StyleSheet } from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { Fonts as FONTS } from '../../assets/theme/fonts';
import { colors, fontColors } from '../../assets/theme/colours';

export const styles = StyleSheet.create({
    termsAndConditionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: hp('2%'),
    },
    termsAndConditionsRadioOuter: {
        width: wp('3.5%'), // Slightly adjusted for better touch target but close to user request
        height: wp('3.5%'),
        borderRadius: 30,
        borderWidth: 1,
        borderColor: colors.themeTeal,
        justifyContent: 'center',
        alignItems: 'center'
    },
    termsAndConditionsRadioInner: {
        width: wp('2%'),
        height: wp('2%'),
        backgroundColor: colors.themeTeal,
        borderRadius: 30,
    },
    agreeText: {
        color: fontColors.subtext,
        fontFamily: FONTS.gilroyRegular,
        fontSize: wp('3.25%'),
        marginLeft: wp('2%')
    },
    termsAndConditionsText: {
        color: colors.themeTeal,
        fontFamily: FONTS.gilroyMedium,
        fontSize: wp('3.25%'),
        marginLeft: wp('1%')
    },
    mandatoryStar: {
        color: 'red',
        fontSize: wp('3.72%'),
    },
});
