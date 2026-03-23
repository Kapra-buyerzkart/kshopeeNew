import { StyleSheet } from 'react-native';
import { colors } from '../../assets/theme/colours';
import { Fonts } from '../../assets/theme/fonts';

export const saveMoneyStyles = StyleSheet.create({
    section: {
        marginTop: 4,
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 12,
    },
    sectionTitle: {
        fontFamily: Fonts.gilroySemiBold,
        fontSize: 16,
        color: '#000',
        paddingEnd: 10,
        marginBottom: 8,
    },
    offerCardsList: {},
    offerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    menuIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    offerDetails: {
        flex: 1,
        marginLeft: 12,
    },
    offerName: {
        fontFamily: Fonts.gilroySemiBold,
        fontSize: 14,
        color: '#000',
    },
    offerSub: {
        fontFamily: Fonts.gilroyRegular,
        fontSize: 13,
        color: colors.themeTeal,
        marginTop: 4,
    },
    applyBtn: {
        paddingHorizontal: 12,
    },
    applyBtnText: {
        fontFamily: Fonts.gilroyMedium,
        fontSize: 13,
        color: '#757575',
    },
    appliedCouponTag: {
        backgroundColor: '#E8F8EA',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    appliedCouponText: {
        fontFamily: Fonts.gilroySemiBold,
        fontSize: 12,
        color: colors.green,
    },
    appliedBadgeText: {
        fontFamily: Fonts.gilroyMedium,
        fontSize: 13,
        color: colors.green,
        marginLeft: 4,
    },
    checkIcon: {
        marginLeft: 6,
    },
    offerCardSpacing: {
        marginTop: 12,
    },
});
