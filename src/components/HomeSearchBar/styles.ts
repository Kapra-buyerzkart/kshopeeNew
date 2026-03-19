import { StyleSheet } from 'react-native';
import { colors } from '../../assets/theme/colours';
import { fonts } from '../../assets/theme/typography';

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
    fontFamily: fonts.body1.fontFamily,
    fontSize: 14,
    color: colors.text,
  },
  micButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    padding: 6,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
  micIconText: {
    fontSize: 12,
    color: colors.black,
  }
});
