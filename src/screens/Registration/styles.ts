import { StyleSheet, Platform } from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { colors, fontColors } from '../../assets/theme/colours';
import { Fonts as FONTS } from '../../assets/theme/fonts';

export const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: colors.white },
  headerSection: {
    height: hp('25%'),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  logo: {
    width: wp('30%'),
    height: hp('8%'),
    resizeMode: 'contain',
  },
  bottomContainer: {
    flex: 1,
    paddingHorizontal: wp('5.8%'),
    // paddingTop: hp('1%'),
    backgroundColor: 'transparent',
  },
  headerText: {
    fontFamily: FONTS.gilroyBold,
    fontSize: wp('6%'),
    color: fontColors.titleBlack,
    alignSelf: 'center',
    fontWeight: 'bold',
    //  marginBottom: hp('1%'),
  },
  phoneNoEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.5%'),
    alignSelf: 'center',
    marginBottom: hp('2%'),
  },
  phoneNoText: {
    fontFamily: FONTS.gilroyRegular,
    fontSize: wp('3.5%'),
    color: fontColors.subtext,
  },
  editIconImage: {
    width: wp('2.79%'),
    height: wp('2.79%'),
    marginLeft: wp('2%'),
  },

  scrollViewContent: {
    paddingBottom: hp('5%'),
  },

  inputSpacing: {
    marginBottom: hp('1.5%'),
  },

  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('1%'),
  },
  termsText: {
    fontFamily: FONTS.gilroyRegular,
    fontSize: wp('3.2%'),
    color: fontColors.subtext,
    marginLeft: wp('2%'),
  },
  continueButton: {
    width: '100%',
    height: hp('6.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('3%'),
    marginTop: hp('2%'),
  },
  continueButtonText: {
    fontFamily: FONTS.bold,
    fontSize: wp('4.18%'),
    color: colors.white,
  },
});
