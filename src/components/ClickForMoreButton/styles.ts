import { StyleSheet } from 'react-native';

const figmaTeal = '#00B4D8';

export default StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: figmaTeal,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 14,
    color: '#333333',
    marginRight: 6,
  },
  chevronText: {
    fontSize: 16,
    color: figmaTeal,
    fontWeight: 'bold',
    letterSpacing: 2,
  }
});
