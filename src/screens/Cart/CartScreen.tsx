import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useCommonStyles } from '../../assets/styles';
import { colors } from '../../assets/theme/colours';
import { AppIcons } from '../../assets/icons';
import { Fonts } from '../../assets/theme/fonts';
import CartItemCard, { CartItem } from '../../components/CartItemCard';
import BillSection from '../../components/BillSection';
import SaveMoneySection from '../../components/SaveMoneySection';

const { width } = Dimensions.get('window');

const CartScreen: React.FC = () => {
    const commonStyles = useCommonStyles();
    const navigation = useNavigation();

    const cartItems: CartItem[] = [
        {
            id: '1',
            title: 'Lorem Ipsum is simply dummy text',
            size: '32',
            color: '#8B4513',
            price: 324,
            originalPrice: 394,
            discount: '17%',
            quantity: 1,
            image: 'https://picsum.photos/seed/shoes1/200/200',
        },
        {
            id: '2',
            title: 'Lorem Ipsum is simply dummy text',
            size: '32',
            color: '#8B4513',
            price: 324,
            originalPrice: 394,
            discount: '17%',
            quantity: 1,
            image: 'https://picsum.photos/seed/shoes2/200/200',
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <AppIcons.Back color={colors.black} size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cart</Text>
                <TouchableOpacity style={styles.heartButton}>
                    <View style={styles.heartCircle}>
                        <AppIcons.HeartOutline color={colors.white} size={20} />
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Delivering to Section */}
                <View style={styles.addressCard}>
                    <View style={styles.addressRow}>
                        <View style={styles.locationIconContainer}>
                            <AppIcons.Home color={colors.themeTeal} size={20} />
                        </View>
                        <View style={styles.addressInfo}>
                            <View style={styles.deliveringToRow}>
                                <Text style={styles.deliveringToText}>Delivering to : </Text>
                                <Text style={styles.addressType}>Home</Text>
                            </View>
                            <Text style={styles.addressDetail} numberOfLines={2}>
                                Nishamanzil(h),Vennala Chakkaraparambu Road ,ernakulam district 654443
                            </Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.changeLink}>Change</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.deliveryDateRow}>
                        <View style={styles.calendarIconContainer}>
                            <AppIcons.Calendar color={colors.themeTeal} size={18} />
                        </View>
                        <Text style={styles.deliveryByText}>Delivery by : </Text>
                        <Text style={styles.deliveryDate}>26 Jan 2026</Text>
                    </View>
                </View>

                {/* Cart Items List */}
                <View style={styles.itemsSection}>
                    {cartItems.map((item) => (
                        <CartItemCard
                            key={item.id}
                            item={item}
                            onDelete={(id) => console.log('Delete', id)}
                            onIncrement={(id) => console.log('Increment', id)}
                            onDecrement={(id) => console.log('Decrement', id)}
                        />
                    ))}
                </View>

                {/* Save Money Section */}
                <SaveMoneySection
                    appliedCouponCode={null}
                    appliedGiftCardCode={null}
                    bcoinsAppliedValue={0}
                    availableBCoins={0}
                    onApplyOffer={(id) => console.log('Apply offer', id)}
                    onRejectOffer={(id) => console.log('Reject offer', id)}
                />

                {/* Bill Summary */}
                <BillSection
                    billCalculations={{
                        itemTotal: 324,
                        savings: 70,
                        deliveryCharge: 0,
                        couponDiscount: 324,
                        totalSavings: 324,
                        toPay: 324,
                    }}
                />

            </ScrollView>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                <View style={styles.savingsBanner}>
                    <Text style={styles.savingsBannerText}>
                        Yay! You are saving <Text style={styles.savingsBold}>₹324</Text>
                    </Text>
                </View>
                <View style={styles.paymentActionRow}>
                    <View style={styles.paymentInfo}>
                        <Text style={styles.payUsingLabel}>PAY USING</Text>
                        <TouchableOpacity style={styles.paymentMethod}>
                            <View style={styles.paymentIconCircle}>
                                <AppIcons.Check color={colors.white} size={14} />
                            </View>
                            <Text style={styles.payUsingValue}>Cash on delivery</Text>
                            <AppIcons.ArrowUp color={colors.black} size={14} style={{ marginLeft: 4 }} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => console.log('Pay')}
                        style={styles.payButtonContainer}>
                        <LinearGradient
                            colors={[colors.themeTeal, colors.themeDarkTeal]}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={styles.payButton}>
                            <Text style={styles.payButtonText}>Pay ₹324.00</Text>
                            <AppIcons.Forward color={colors.white} size={16} />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default CartScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.homeScreenBackground,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: colors.white,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: Fonts.bold,
        color: colors.black,
    },
    heartButton: {
        padding: 5,
    },
    heartCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.themeTeal,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 120,
    },
    addressCard: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E8F8FA',
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    locationIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E8F8FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    addressInfo: {
        flex: 1,
    },
    deliveringToRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    deliveringToText: {
        fontSize: 16,
        color: colors.black,
        fontFamily: Fonts.gilroyRegular,
    },
    addressType: {
        fontSize: 14,
        color: colors.black,
        fontFamily: Fonts.semiBold,
        fontWeight: '600'
    },
    addressDetail: {
        fontSize: 14,
        color: colors.black,
        fontFamily: Fonts.gilroyLight,
        lineHeight: 16,
    },
    changeLink: {
        fontSize: 14,
        color: colors.themeTeal,
        fontFamily: Fonts.bold,
        fontWeight: '400',
        textDecorationLine: 'underline',
    },
    separator: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 12,
    },
    deliveryDateRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    calendarIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 4,
        backgroundColor: '#E8F8FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    deliveryByText: {
        fontSize: 14,
        color: colors.black,
        fontFamily: Fonts.gilroyRegular,
    },
    deliveryDate: {
        fontSize: 14,
        color: colors.black,
        fontFamily: Fonts.gilroyRegular,
    },
    itemsSection: {
        backgroundColor: '#E8F8FA',
        borderRadius: 16,
        padding: 12,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.white,
        paddingBottom: 34,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 20,
    },
    savingsBanner: {
        backgroundColor: '#F2FBFB',
        paddingVertical: 10,
        alignItems: 'center',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    savingsBannerText: {
        fontSize: 14,
        color: colors.black,
        fontFamily: Fonts.gilroyMedium,
    },
    savingsBold: {
        color: colors.green,
        fontFamily: Fonts.gilroyBold,
    },
    paymentActionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingTop: 15,
    },
    paymentInfo: {
        flex: 1,
    },
    payUsingLabel: {
        fontSize: 10,
        color: '#999',
        fontFamily: Fonts.gilroyBold,
        marginBottom: 4,
    },
    paymentMethod: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paymentIconCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.themeTeal,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    payUsingValue: {
        fontSize: 14,
        color: colors.black,
        fontFamily: Fonts.gilroyBold,
    },
    payButtonContainer: {
        borderRadius: 25,
        overflow: 'hidden',
    },
    payButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderRadius: 30,
        height: 45,
        width: 200, left: 20
    },
    payButtonText: {
        color: colors.white,
        fontSize: 16,
        fontFamily: Fonts.gilroyBold,
        marginRight: 8,
    },
});
