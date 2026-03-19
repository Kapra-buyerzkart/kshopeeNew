import { StyleSheet } from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { colors, fontColors } from '../../assets/theme/colours';
import { Fonts } from '../../assets/theme/fonts';

export const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp('4%'),
        paddingVertical: hp('1.5%'),
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: wp('5%'),
        fontFamily: Fonts.gilroyBold,
        color: fontColors.titleBlack,
        marginLeft: wp('4%'),
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: {
        marginLeft: wp('4%'),
    },
    cartIconContainer: {
        width: wp('10%'),
        height: wp('10%'),
        borderRadius: wp('5%'),
        backgroundColor: colors.themeTeal,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: wp('4%'),
    },
    listContent: {
        padding: wp('2%'),
        paddingBottom: hp('10%'),
    },
    footerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp('4%'),
        marginBottom: hp('10%'),
        position: 'relative',
    },
    heartOutlineWrapper: {
        position: 'absolute',
        opacity: 0.3,
    },
    noMoreWishlistText: {
        fontSize: wp('3.8%'),
        fontFamily: Fonts.gilroyBold,
        color: '#B2EBF2', // Light teal color from design
        textAlign: 'center',
        letterSpacing: 1,
    },
    heartOutlineLarge: {
        width: wp('30%'),
        height: wp('20%'),
        tintColor: '#B2EBF2',
        resizeMode: 'contain',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //  alignSelf: 'center',
        paddingTop: -hp('25%'),
        //  backgroundColor: 'red',
    },
    emptyImage: {
        width: wp('60%'),
        height: hp('30%'),
        resizeMode: 'contain',
    },
    toggleButton: {
        position: 'absolute',
        top: hp('10%'),
        right: wp('4%'),
        backgroundColor: colors.themeTeal,
        padding: wp('2%'),
        borderRadius: wp('2%'),
        zIndex: 1000,
    },
    toggleButtonText: {
        color: colors.white,
        fontSize: wp('3%'),
        fontFamily: Fonts.gilroyBold,
    },
    emptyText: {
        fontSize: wp('4.5%'),
        fontFamily: Fonts.gilroyBold,
        color: fontColors.titleBlack,
        fontWeight: 'bold',
        //  marginTop: hp('2%'),
    },
    cartGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp('2%'),
    }
});
