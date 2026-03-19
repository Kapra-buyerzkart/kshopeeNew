import { StyleSheet, Platform } from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { colors, fontColors } from '../../assets/theme/colours';
import { Fonts as FONTS } from '../../assets/theme/fonts';

export const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: colors.white },
    backgroundImage: {
        flex: 1,
        alignItems: 'center',
        paddingTop: hp('6%'),
        paddingBottom: hp('7.5%'),
    },
    bottomContainer: {
        flex: 2.2, // Gives more space to the scrollable area
        paddingHorizontal: wp('5.8%'),
        paddingTop: hp('3.5%'),
        borderTopLeftRadius: wp('9.3%'),
        borderTopRightRadius: wp('9.3%'),
        backgroundColor: colors.white,
        marginTop: -hp('4%'),
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    headerText: {
        fontFamily: FONTS.gilroySemiBold,
        fontSize: wp('4.65%'),
        color: fontColors.titleBlack,
        alignSelf: 'center',
        fontWeight: 'bold',
    },
    phoneNoEditContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp('1%'),
        alignSelf: 'center',
        marginBottom: hp('3%'),
    },
    phoneNoText: { fontFamily: FONTS.gilroyRegular, fontSize: wp('3.72%'), color: fontColors.titleBlack },
    editIconImage: { width: wp('2.79%'), height: wp('2.79%'), marginLeft: wp('2%') },

    scrollViewContent: {
        paddingBottom: hp('5%'), // Extra padding at bottom for keyboard
    },

    inputSpacing: {
        marginBottom: hp('2%'),
    },

    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: hp('2%'),
    },
    termsText: {
        fontFamily: FONTS.gilroyRegular,
        fontSize: wp('3.2%'),
        color: fontColors.subtext,
        marginLeft: wp('2%'),
    },
    continueButton: {
        //backgroundColor: colors.primary,
        width: '100%',
        height: hp('6.11%'),
        justifyContent: "center",
        alignItems: 'center',
        borderRadius: wp('8%'),
        marginTop: hp('2%'),
    },
    continueButtonText: {
        fontFamily: FONTS.bold,
        fontSize: wp('4.18%'),
        color: colors.white
    },
});

