import { StyleSheet } from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { Fonts as FONTS } from '../../assets/theme/fonts';
import { colors, fontColors } from '../../assets/theme/colours';

export const styles = StyleSheet.create({
  // mainContainer: {
  //   flex: 1,
  //   backgroundColor: colors.white,
  // },
  headerSection: {
    height: hp('45%'),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    //flex: 1,
    width: '100%',
    height: '100%',
  },
  logo: {
    width: wp('30%'),
    height: hp('20%'),
    resizeMode: 'contain',
  },
  bottomContainer: {
    flex: 1,
    paddingHorizontal: wp('5.8%'),
    paddingBottom: hp('4%'),
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
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
    marginBottom: hp('1.5%'),
  },
  // ... rest of the styles remain mostly same, but I'll update the ones I need
  continueButton: {
    backgroundColor: colors.primary,
    width: '100%',
    height: hp('6.11%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('2.33%'),
    marginTop: hp('10%'),
  },
  continueButtonText: {
    fontFamily: FONTS.bold,
    fontSize: wp('4.18%'),
    color: colors.white,
  },
  inputContainer: {
    marginTop: hp('1.5%'),
  },
  eyeIcon: {
    width: wp('4.19%'),
    height: hp('1.29%'),
    resizeMode: 'contain',
  },
  forgotPwdText: {
    alignSelf: 'flex-end',
    marginTop: hp('0.5%'),
    color: colors.primary,
    fontFamily: FONTS.medium,
    fontSize: wp('3.25%'),
  },
});
