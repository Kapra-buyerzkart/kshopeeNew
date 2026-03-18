import { StyleSheet } from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { Fonts as FONTS } from '../../assets/theme/fonts';
import { colors, fontColors } from '../../assets/theme/colours';

export const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.white
    },
    backgroundImage: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: hp('6%'),
        paddingBottom: hp('7.5%')
    },
    kapraLogo: {
        width: wp('47%'),
        height: hp('10%'),
        resizeMode: 'contain'
    },
    tagLine: {
        width: wp('50.7%'),
        height: hp('16.95%'),
        resizeMode: 'contain',
    },
    bottomContainer: {
        height: hp('35%'), // Slightly increased to account for overlap
        paddingHorizontal: wp('5.8%'),
        paddingTop: hp('3%'),
        paddingBottom: hp('4%'),
        borderTopLeftRadius: wp('9.3%'),
        borderTopRightRadius: wp('9.3%'),
        backgroundColor: colors.white,
        justifyContent: 'space-between',
        marginTop: -hp('4%'),
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    headerText: {
        fontFamily: FONTS.gilroyBold, // Fallback for semiBold
        fontSize: wp('4.65%'),
        color: fontColors.titleBlack,
        alignSelf: 'center',
        marginBottom: hp('3%'),
        fontWeight: 'bold',
    },
    enterNumberText: {
        fontFamily: FONTS.regular,
        fontSize: wp('3.72%'),
        color: fontColors.subtext,
        marginBottom: hp('1.5%')
    },
    continueButton: {
        backgroundColor: colors.primary,
        width: '100%',
        height: hp('6.11%'),
        justifyContent: "center",
        alignItems: 'center',
        borderRadius: wp('2.33%'),
        marginTop: hp('5%')
    },
    continueButtonText: {
        fontFamily: FONTS.bold,
        fontSize: wp('4.18%'),
        color: colors.white
    },
    inputContainer: {
        marginTop: hp('1.5%')
    },
    eyeIcon: {
        width: wp('4.19%'),
        height: hp('1.29%'),
        resizeMode: 'contain'
    },
    forgotPwdText: {
        alignSelf: "flex-end",
        marginTop: hp('0.5%'),
        color: colors.primary,
        fontFamily: FONTS.medium,
        fontSize: wp('3.25%')
    }
});
