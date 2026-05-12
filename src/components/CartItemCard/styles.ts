import { StyleSheet } from 'react-native';
import { colors } from '../../assets/theme/colours';
import { Fonts } from '../../assets/theme/fonts';
import { hp } from '../../utils/responsive';

export const cartItemCardStyles = StyleSheet.create({
    itemCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        borderColor: '#DADADA',
        borderWidth: 0.5
    },
    // Top section: image + details side by side
    itemTopRow: {
        flexDirection: 'row',
    },
    itemImage: {
        width: 110,
        height: 100,
        borderRadius: 21,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    itemDetails: {
        flex: 1,
        marginLeft: 12,
    },
    itemTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    itemTitle: {
        fontSize: 16,
        color: colors.black,
        fontFamily: Fonts.gilroyMedium,
        flex: 1,
        marginRight: 8,
        lineHeight: 20,
    },
    deleteButton: {
        padding: 2,
    },
    variantRow: {
        flexDirection: 'row',
        alignItems: 'center',
        //marginTop: 19,
    },
    variantLabel: {
        fontSize: 12,
        color: colors.black,
        fontFamily: Fonts.gilroyRegular,
    },
    variantValue: {
        fontSize: 13,
        color: colors.black,
        fontFamily: Fonts.gilroyRegular,
    },
    colorCircle: {
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    // Bottom section: quantity + price spanning full width
    itemBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp('1%'),
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 20,
        // borderWidth: 1,
        // borderColor: colors.themeTeal,
        height: 36,
    },
    qtyBtn: {
        width: 36,
        height: 38,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',

    },
    separator: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginTop: hp('1%'),
    },
    qtyText: {
        paddingHorizontal: 14,
        fontSize: 14,
        fontFamily: Fonts.semiBold,
        color: colors.black,
        fontWeight: '600',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    discountBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
    },
    discountArrow: {
        color: colors.green,
        fontSize: 14,
        marginRight: 2,
    },
    discountText: {
        color: colors.green,
        fontSize: 14,
        fontFamily: Fonts.gilroySemiBold,
    },
    mrpText: {
        fontSize: 10,
        color: '#727783',
        textDecorationLine: 'line-through',
        fontFamily: Fonts.gilroyLight,
        marginRight: 8,
    },
    priceText: {
        fontSize: 16,
        color: colors.black,
        fontFamily: Fonts.gilroyBold,
    },
    rupeeSign: {
        fontFamily: Fonts.gilroyBold,
        fontSize: 16,
    },
});
