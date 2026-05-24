import { StyleSheet, Platform } from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { colors, fontColors } from '../../assets/theme/colours';
import { Fonts as FONTS } from '../../assets/theme/fonts';

export const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: colors.white },
  headerSection: {
    height: hp('45%'),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    // flex: 1,
    width: '100%',
    height: '100%',
  },
  logo: {
    width: wp('40%'),
    height: hp('12%'),
    resizeMode: 'contain',
  },
  bottomContainer: {
    flex: 1,
    paddingHorizontal: wp('5.8%'),
    paddingTop: hp('1%'),
    paddingBottom: hp('3%'),
    backgroundColor: 'transparent',
  },
  headerText: {
    fontFamily: FONTS.gilroyBold,
    fontSize: wp('6%'),
    color: fontColors.titleBlack,
    alignSelf: 'center',
    fontWeight: 'bold',
    marginBottom: hp('1%'),
  },
  phoneNoEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.5%'),
    alignSelf: 'center',
    marginBottom: hp('3%'),
  },
  phoneNoText: {
    fontFamily: FONTS.gilroyRegular,
    fontSize: wp('3.5%'),
    color: fontColors.subtext,
    textAlign: 'center',
  },
  editIconImage: {
    width: wp('2.79%'),
    height: wp('2.79%'),
    marginLeft: wp('2%'),
  },
  enterNumberText: {
    fontFamily: FONTS.gilroyRegular,
    fontSize: wp('3.8%'),
    color: fontColors.titleBlack,
    marginBottom: hp('1.5%'),
    alignSelf: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5%'),
    marginBottom: hp('2%'),
  },
  numberBox: {
    width: wp('12.95%'),
    height: hp('6.36%'),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.themeLightGray,
    borderRadius: wp('6.36%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpInput: {
    fontSize: wp('4.5%'),
    textAlign: 'center',
    width: '100%',
    color: fontColors.titleBlack,
    fontWeight: 'bold',
  },
  pwdResendTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('0.8%'),
    paddingHorizontal: wp('5%'),
    marginBottom: hp('4%'),
  },
  usePwdText: {
    fontFamily: FONTS.gilroyMedium,
    fontSize: wp('3.25%'),
    color: colors.themeTeal,
  },
  time: {
    fontFamily: FONTS.gilroyRegular,
    fontSize: wp('3.25%'),
    color: fontColors.subtext,
  },
});
