import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../assets/theme/colours';
import { Fonts } from '../../assets/theme/fonts';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.themeWhite,
    },
    bannerContainer: {
        width: '100%',
        height: 200,
        backgroundColor: '#E5E5E5',
    },
    bannerBg: {
        width: '100%',
        height: '100%',
    },
    bannerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 55, // safe area padding
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bannerTitle: {
        fontFamily: Fonts.gilroyBold,
        fontSize: 22,
        color: '#2A1A10',
        marginLeft: 15,
    },
    topFilterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        //paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: colors.themeWhite,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        height: 62
    },
    optionsIconContainer: {
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'center',
        width: 38,
        height: 38,
        borderRadius: 19,
        borderWidth: 1,
        borderColor: colors.grey,
    },
    optionsBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: colors.themeTeal,
        borderRadius: 10,
        width: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    optionsBadgeText: {
        color: colors.black,
        fontFamily: Fonts.gilroyBold,
        fontSize: 12,
        fontWeight: '400'
    },
    topFilterList: {
        flex: 1,
    },
    filterItemContainer: {
        alignItems: 'center',
        marginRight: 20,
        height: '100%',
        justifyContent: 'center',
    },
    filterContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    activeIndicator: {
        height: 6,
        backgroundColor: colors.themeTeal,
        width: 70, // You can increase this explicitly or keep it 100% depending on desired visual length
        borderTopLeftRadius: 70,
        borderTopRightRadius: 70,
        position: 'absolute',
        bottom: 0,
    },
    filterImage: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
    filterText: {
        fontFamily: Fonts.gilroyMedium,
        fontSize: 16,
        color: colors.themeDarkGray,
        fontWeight: '400'
    },
    filterTextActive: {
        color: colors.themeTeal,
        fontFamily: Fonts.gilroySemiBold,
    },
    mainContent: {
        flex: 1,
        flexDirection: 'row',
    },
    sidebarContainer: {
        width: 75,
        backgroundColor: colors.themeWhite,
        borderRightWidth: 1,
        borderRightColor: colors.lightGrey,
    },
    sidebarItem: {
        alignItems: 'center',
        paddingVertical: 12,
        width: '100%',
    },
    sidebarIconActiveBg: {
        backgroundColor: colors.themeTeal,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        paddingRight: 12,
        paddingVertical: 6,
        paddingLeft: 10,
        alignSelf: 'flex-start',
        marginLeft: 0,
    },
    sidebarIconInactiveBg: {
        paddingRight: 12,
        paddingVertical: 6,
        paddingLeft: 10,
        //alignSelf: 'flex-start',
        marginLeft: 0,
    },
    sidebarIconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: colors.themeWhite,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E8E8E8',
        alignSelf: 'center'
    },
    sidebarIconWrapperActive: {
        borderColor: colors.themeWhite,
    },
    sidebarIconImage: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    sidebarItemText: {
        fontFamily: Fonts.gilroyMedium,
        fontSize: 12,
        color: colors.themeDarkGray,
        marginTop: 6,
    },
    sidebarItemTextActive: {
        color: colors.themeTeal,
        fontFamily: Fonts.gilroySemiBold,
    },
    productsGrid: {
        flex: 1,
        backgroundColor: colors.white,
        padding: 8,
    },
    exploreItemCard: {
        width: 146,
        marginRight: 16,
        marginBottom: 16,
        backgroundColor: colors.themeWhite,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.outlineTeal,
        paddingTop: 10,
    },
    exploreTopBadgesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginBottom: '-25%',
        zIndex: 2
    },
    discountCircle: {
        width: 27,
        height: 27,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: colors.tealIconFont,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: colors.white,
    },
    discountCircleText: {
        color: colors.tealIconFont,
        fontSize: 8,
        fontFamily: Fonts.medium,
        fontWeight: '500',
        textAlign: 'center',
        textAlignVertical: 'center',
        includeFontPadding: false,
    },
    exploreItemImage: {
        width: '100%',
        height: 132,
        resizeMode: 'contain'
    },
    pricePill: {
        backgroundColor: colors.themeTealTwo,
        borderRadius: 8,
        paddingHorizontal: 2,
        height: 29,
        elevation: 2,
        shadowColor: colors.themeBlack,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.85,
        shadowRadius: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    pricePillText: {
        color: colors.themeWhite,
        fontSize: 12,
        fontFamily: Fonts.regular,
        fontWeight: '700'
    },
    originalPriceText: {
        fontSize: 10,
        color: colors.themeDarkGray,
        textDecorationLine: 'line-through',
        fontFamily: Fonts.regular,
        fontWeight: '300'
    },
    caption: {
        fontSize: 12,
        color: colors.themeBlack,
        fontFamily: Fonts.regular,
        fontWeight: '300',
    },
});
