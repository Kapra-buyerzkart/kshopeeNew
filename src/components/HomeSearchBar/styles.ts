import { StyleSheet } from 'react-native';
import { colors } from '../../assets/theme/colours';
import { fonts } from '../../assets/theme/typography';
import { Fonts } from '../../assets/theme/fonts';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 24, // Pill shape match from Figma
    paddingHorizontal: 12,
    marginHorizontal: 16,
    height: 48,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  searchBarContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 24, // Pill shape match from Figma
    paddingHorizontal: 12,
    height: 50,
  },
  kIcon: {
    width: 20,
    height: 17,
    resizeMode: 'contain',
  },
  iconLeftContainer: {
    marginRight: 8,
  },
  kIconText: {
    fontWeight: '800',
    fontSize: 20,
    color: '#00B4D8', // Bright cyan matching Figma "K"
    fontFamily: fonts.h1.fontFamily,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: colors.text,
    fontWeight:'400'
  },

  micIconText: {
    fontSize: 12,
    color: colors.black,
  }
});
