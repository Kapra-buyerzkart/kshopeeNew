import { StyleSheet } from 'react-native';
import { colors } from '../../assets/theme/colours';
import { verticalScale, moderateScale, scale } from '../../assets/styles';
import { Fonts } from '../../assets/theme/fonts';

export const styles = StyleSheet.create({
  container: {
    height: verticalScale(50),
    borderRadius: verticalScale(25), // Adjusted to exactly half of height for perfect pill shape
    overflow: 'hidden',
    width: '100%',
  },
  gradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    gap: scale(10),
    borderRadius: verticalScale(25),
  },
  text: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.gilroyBold,
    color: colors.themeWhite,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
});
