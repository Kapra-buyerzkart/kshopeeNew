import { StyleSheet } from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { colors, fontColors } from '../../assets/theme/colours';
import { Fonts as FONTS } from '../../assets/theme/fonts';

export const styles = StyleSheet.create({
    areaCard: {
        marginVertical: hp('1%'),
        paddingHorizontal: wp('2%'),
        backgroundColor: 'transparent',
        borderWidth: 0.4,
        borderColor: colors.lightGrey,
        borderBottomLeftRadius: wp('8%'),
        borderBottomRightRadius: wp('8%'),
    },
    areaCardAttached: {
        borderTopWidth: 0,
        marginVertical: 0,
        paddingTop: hp('1%'),
    },
    collapsedCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp('4%'),
        paddingVertical: hp('2%'),
        backgroundColor: 'transparent',
        borderWidth: 0.4,
        borderColor: colors.lightGrey,
        borderBottomLeftRadius: wp('8%'),
        borderBottomRightRadius: wp('8%'),
    },
    collapsedCardExpanded: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderBottomWidth: 0,
        marginBottom: 0,
        paddingBottom: hp('1%'),
    },
    title: {
        fontFamily: FONTS.gilroyMedium,
        fontSize: wp('3.5%'),
        color: fontColors.titleBlack,
        marginBottom: hp('2%'),
        alignSelf: 'center',
        marginTop: hp('1%')
    },
    collapsedText: {
        fontFamily: FONTS.gilroyMedium,
        fontSize: wp('3.5%'),
        color: fontColors.titleBlack,
        marginLeft: wp('2%'),
    },
    checkCircle: {
        width: wp('3.5%'),
        height: wp('3.5%'),
        borderRadius: wp('2%'),
        backgroundColor: '#00C853', // Bright green from screenshot
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: wp('2%'),
    },
    chevronIcon: {
        marginLeft: 'auto', 
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: hp('1.5%'),
        paddingEnd: wp('2%')
    },
    areaText: {
        fontFamily: FONTS.gilroyMedium,
        fontSize: wp('3.5%'),
        color: fontColors.titleBlack,
        marginStart: wp('2%'),
    },
    radioOuter: {
        width: wp('5%'),
        height: wp('5%'),
        borderRadius: 30,
        borderWidth: 1.5,
        borderColor: colors.lightGrey,
    },
    radioCheckedOuter: {
        width: wp('5%'),
        height: wp('5%'),
        borderRadius: 30,
        borderWidth: 1.5,
        borderColor: colors.themeTeal,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioCheckedInner: {
        width: wp('2.8%'),
        height: wp('2.8%'),
        borderRadius: 30,
        backgroundColor: colors.themeTeal,
    },
});
