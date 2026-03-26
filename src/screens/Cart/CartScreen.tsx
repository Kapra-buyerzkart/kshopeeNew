import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Platform, RefreshControl, Modal } from 'react-native'
import React, { useContext, useState, useEffect, useRef } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FONTS } from '../../styles/typography'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import CartItemCard, { CartItem as UICartItem } from '../../components/CartItemCard';
import SaveMoneySection from '../../components/SaveMoneySection';
import { colors } from '../../assets/theme/colours';
import { Fonts } from '../../assets/theme/fonts';
import { AppIcons } from '../../assets/icons';
import LinearGradient from 'react-native-linear-gradient'
import { useCartScreen } from '../../hooks/useCartScreen'
import { useCart } from '../../context/CartContext'
import { LoaderContext } from '../../context/loaderContext'
import ConfirmationModal from '../../components/ConfirmationModal'
import { getPaymentModesApi } from '../../api/services/configService'
import { createOrderApi, confirmCodApi } from '../../api/services/orderService'
import { createRazorpayOrderApi, verifyRazorpayPaymentApi } from '../../api/services/paymentService'
import { updateCartItemApi, removeFromCartApi } from '../../api/services/cartService'
import RazorpayCheckout from 'react-native-razorpay'

import AddressModal from '../../components/AddressModal'
import AddressConfirmationModal from '../../components/AddressConfirmationModal'
import DeliverySlotModal from '../../components/DeliverySlotModal'
import CouponModal from '../../components/CouponModal'
import BillSection from '../../components/BillSection'
import CartEmptyComponent from '../../components/CartEmptyComponent'
import StoreUnavailable from '../../components/StoreUnavailable'
import StatusModal from '../../components/StatusModal'
import { useUser } from '../../context/UserContext'

const CartScreen = () => {
    const navigation = useNavigation<any>()
    const { profile } = useUser();
    const {
        // Cart
        billCalculations,
        cartSummary,

        // Offers
        showCouponModal,
        setShowCouponModal,
        couponCode,
        setCouponCode,
        isGiftCard,
        availableCoupons,
        availableGiftCards,
        appliedCouponCode,
        appliedGiftCardCode,
        onApplyOffer,
        onRejectOffer,
        handleApplyCoupon,
        handleCouponClick,

        // Delivery
        selectedDeliveryType,
        setSelectedDeliveryType,
        selectedSlot,
        setSelectedSlot,
        showSlotModal,
        setShowSlotModal,
        datesList,
        slotsByDate,
        onSelectDate,
        deliveryModes,
    } = useCartScreen();

    const { showLoader } = useContext(LoaderContext);
    const {
        cartItems,
        clearCart,
        getCartSummary,
        error: cartError,
        addresses,
        fetchAddresses,
        showAddressModal,
        setShowAddressModal,
        onSelectAddress,
        onThreeDotsClicked,
        onDeleteClicked,
        onCloseThreeDots,
        addressConfirmationData,
        setAddressConfirmationData,
        refreshAddresses,
        refreshCart,
        serviceabilityTrigger,
        setServiceabilityTrigger
    } = useCart();

    const [isClearCartModalVisible, setIsClearCartModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [paymentModes, setPaymentModes] = useState<any[]>([]);

    // Status Modal State
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [statusType, setStatusType] = useState('success');
    const [statusTitle, setStatusTitle] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [chosenSlot, setChosenSlot] = useState<any>(null);
    const [isFinalizingOrder, setIsFinalizingOrder] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const scrollViewRef = useRef<ScrollView>(null);
    const insets = useSafeAreaInsets();

    const selectedAddress = addresses.find(a => a.selected);

    // --- Cart Item Actions ---
    const handleUpdateQty = async (item: any, newQty: number) => {
        if (newQty < 1) {
            handleRemoveItem(item);
            return;
        }
        try {
            showLoader(true);
            const res = await updateCartItemApi(item.cartItemId, newQty, cartSummary?.cartVersion, item.productId, selectedAddress?.pincodeAreaId);
            if (res?.success) {
                await refreshCart();
                await getCartSummary();
            }
        } catch (err) {
            console.error('Error updating qty:', err);
        } finally {
            showLoader(false);
        }
    };

    const handleRemoveItem = async (item: any) => {
        try {
            showLoader(true);
            const res = await removeFromCartApi(item.cartItemId, cartSummary?.cartVersion, item.productId, selectedAddress?.pincodeAreaId);
            if (res?.success) {
                await refreshCart();
                await getCartSummary();
            }
        } catch (err) {
            console.error('Error removing item:', err);
        } finally {
            showLoader(false);
        }
    };

    // Fetch payment modes on mount
    useEffect(() => {
        const fetchPaymentModes = async () => {
            try {
                const response = await getPaymentModesApi();
                if (response?.success && response?.data) {
                    let modes = [...response.data];
                    // Ensure online exists for testing
                    if (!modes.some(m => ['online', 'razorpay', 'upi'].includes(m.paymentModeName?.toLowerCase()))) {
                        modes.push({ paymentModeId: 'online_test', paymentModeName: 'Online', description: 'UPI, Cards, Net Banking' });
                    }
                    setPaymentModes(modes);
                    const cod = modes.find(m => m.paymentModeName?.toUpperCase() === 'COD');
                    if (cod) setPaymentMethod(cod.paymentModeName);
                }
            } catch (err) {
                console.error('Error fetching payment modes:', err);
            }
        };
        fetchPaymentModes();
    }, []);

    // Addresses and Cart summary are handled by useCartScreen focus effect

    // Calculate total B-Tokens
    const totalCartBTokens = cartItems.reduce((sum, item) => sum + (item.totalBtokens || item.bTokenValue || item.bTokens || 0), 0);

    // Pull-to-Refresh
    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        try {
            await Promise.all([getCartSummary(), refreshAddresses()]);
        } finally {
            setRefreshing(false);
        }
    }, [getCartSummary, fetchAddresses]);

    // --- Order Placement Logic ---
    const handleConfirmOrder = async () => {
        if (!selectedAddress) {
            setShowAddressModal(true);
            return;
        }

        try {
            showLoader(true);
            const summaryRes = await getCartSummary(
                selectedDeliveryType,
                chosenSlot?.id,
                null, // cartVersion
                null, // couponCode (new 4th arg)
                selectedAddress?.pincodeAreaId // pincodeAreaId (now 5th arg)
            );

            showLoader(false);

            const pincode = selectedAddress.pin || '';
            const area = selectedAddress.raw?.areaName || selectedAddress.raw?.pincodeAreaName || selectedAddress.raw?.area_name || 'N/A';

            if (summaryRes?.success === false && (summaryRes?.status === 'STORE_NOT_FOUND' || summaryRes?.status === 'STORE_CLOSED_FOR_DELIVERY')) {
                setAddressConfirmationData({
                    pincode,
                    areaName: area,
                    isPlacingOrder: true,
                    isServiceable: false,
                    unavailableMessage: summaryRes?.message || "Store is currently closed for delivery"
                });
            } else {
                setAddressConfirmationData({
                    pincode,
                    areaName: area,
                    isPlacingOrder: true,
                    isServiceable: true
                });
            }
        } catch (error: any) {
            showLoader(false);
            console.error('❌ [ORDER] Validation Error:', error);
            const pincode = selectedAddress.pin || '';
            const area = selectedAddress.raw?.areaName || selectedAddress.raw?.pincodeAreaName || selectedAddress.raw?.area_name || 'N/A';
            const errorMsg = typeof error === 'string' ? error : (error?.message || error?.Message || "");

            if (errorMsg.toLowerCase().includes('no store') ||
                errorMsg.toLowerCase().includes('not found') ||
                errorMsg.toLowerCase().includes('closed') ||
                errorMsg.toLowerCase().includes('pincode area')) {
                setAddressConfirmationData({
                    pincode,
                    areaName: area,
                    isPlacingOrder: true,
                    isServiceable: false,
                    unavailableMessage: errorMsg || "Delivery currently not available in this area."
                });
            } else {
                setAddressConfirmationData({ pincode, areaName: area, isPlacingOrder: true, isServiceable: true });
            }
        }
    };

    const submitOrder = async () => {
        console.log('🚀 [ORDER] Starting submitOrder...');
        const onlineTerms = ['online', 'prepaid', 'razorpay', 'upi', 'online_test', 'online payment'];
        const isOnlinePayment = onlineTerms.some(term => paymentMethod?.toLowerCase()?.includes(term));

        try {
            showLoader(true);
            setAddressConfirmationData(null);

            console.log('📦 [ORDER] Payload State:', {
                hasSummary: !!cartSummary,
                cartId: cartSummary?.cartId,
                itemsCount: cartItems.length,
                addressId: selectedAddress?.id
            });

            if (!cartSummary?.cartId && !cartItems?.[0]?.cartId) {
                console.warn('❌ [ORDER] No cartId found');
                throw new Error('Your cart session has expired. We are refreshing it for you.');
            }

            const createPayload = {
                cartId: cartSummary?.cartId || cartItems?.[0]?.cartId,
                shippingAddressId: selectedAddress.id,
                billingAddressId: selectedAddress.id,
                paymentMethod: isOnlinePayment ? "online" : paymentMethod,
                ifMatchCartVersion: cartSummary?.cartVersion,
                deliverySlotDate: selectedDeliveryType === 'slot'
                    ? (chosenSlot?.date?.split('T')[0] || (typeof chosenSlot?.date === 'string' ? chosenSlot.date : null))
                    : null,
                deliverySlotTime: selectedDeliveryType === 'slot' ? (chosenSlot?.slotValue || null) : null,
                deliveryMode: selectedDeliveryType === 'slot' ? "slotted" : "express",
                orderPlacedFromDevice: "app",
                pincodeAreaId: selectedAddress.pincodeAreaId
            };

            console.log('📤 [ORDER] Sending createOrderApi call...', createPayload);
            const createResponse = await createOrderApi(createPayload);
            console.log('📥 [ORDER] createOrderApi Response:', createResponse);

            if (createResponse?.success && createResponse?.data?.orderId) {
                const orderId = createResponse.data.orderId;
                const orderNumber = createResponse.data.orderNumber || orderId;

                if (isOnlinePayment) {
                    await handlePaymentFlow(orderId, orderNumber);
                } else {
                    const confirmResponse = await confirmCodApi(orderId);
                    if (confirmResponse?.success) {
                        await finalizeOrder(createResponse.data);
                    } else {
                        throw new Error(confirmResponse?.message || 'Failed to confirm COD');
                    }
                }
            } else if (createResponse?.status === 'CART_CONFLICT') {
                showLoader(false);
                setStatusType('error');
                setStatusTitle('Price/Stock Changed');
                setStatusMessage('Price or stock of some items has changed, please reload');
                setStatusModalVisible(true);
            } else {
                throw new Error(createResponse?.message || 'Failed to create order');
            }
        } catch (error: any) {
            showLoader(false);
            console.log('❌ [ORDER] submitOrder FULL ERROR OBJECT:', JSON.stringify(error, null, 2));
            console.error('❌ [ORDER] submitOrder Catch Error:', error);

            setStatusType('error');
            setStatusTitle('Order Failed');
            setStatusMessage(typeof error === 'string' ? error : (error.message || error.Message || 'An unexpected error occurred during order creation.'));
            setTimeout(() => setStatusModalVisible(true), 500);
        }
    };

    const handlePaymentFlow = async (orderId: any, orderNumber: any) => {
        try {
            const rzpResponse = await createRazorpayOrderApi({ orderId });
            if (rzpResponse?.success && rzpResponse?.data) {
                const keyId = rzpResponse.data.keyId || rzpResponse.data.razorpayKeyId;
                const razorpayOrderId = rzpResponse.data.razorpayOrderId;
                const amount = rzpResponse.data.amount;

                const options = {
                    key: keyId,
                    amount: amount,
                    currency: "INR",
                    name: "Kapra Daily",
                    description: `Order #${orderNumber}`,
                    order_id: razorpayOrderId,
                    prefill: {
                        email: profile?.email || '',
                        contact: profile?.phone || profile?.phoneNo || ''
                    },
                    theme: { color: "#F25000" }
                };

                showLoader(false);
                setTimeout(async () => {
                    try {
                        const sdkResponse = await RazorpayCheckout.open(options);
                        showLoader(true);
                        const verifyPayload = {
                            orderId,
                            razorpayOrderId: sdkResponse.razorpay_order_id,
                            razorpayPaymentId: sdkResponse.razorpay_payment_id,
                            razorpaySignature: sdkResponse.razorpay_signature,
                            amount: Number(amount)
                        };

                        let verifyResponse;
                        let retryCount = 0;
                        const maxRetries = 2;

                        const attemptVerification = async () => {
                            try { return await verifyRazorpayPaymentApi(verifyPayload); } catch (e) { return null; }
                        };

                        verifyResponse = await attemptVerification();
                        while ((!verifyResponse?.success || verifyResponse?.status === 'pending') && retryCount < maxRetries) {
                            retryCount++;
                            await new Promise(resolve => setTimeout(() => resolve(undefined), 3000));
                            verifyResponse = await attemptVerification();
                        }

                        if (verifyResponse?.success) {
                            await finalizeOrder({ orderId, orderNumber });
                        } else {
                            showLoader(false);
                            // Fallback to OrderPendingScreen if verification is inconclusive
                            navigation.replace('OrderPendingScreen', { orderId, orderNumber });
                        }
                    } catch (sdkError: any) {
                        showLoader(false);
                        navigation.navigate('OrderFailedScreen', {
                            errorMessage: sdkError?.description || 'Payment cancelled or failed.',
                            orderId,
                            orderNumber
                        });
                        refreshCart();
                    }
                }, 500);
            }
        } catch (error: any) {
            showLoader(false);
            setStatusType('error');
            setStatusTitle('Payment Error');
            setStatusMessage(error.message || 'Failed to initialize payment');
            setStatusModalVisible(true);
        }
    };

    const finalizeOrder = async (orderData: any) => {
        const itemsCount = cartItems.length;
        const totalAmount = billCalculations.toPay;
        const mode = selectedDeliveryType === 'slot' ? 'slotted' : 'express';
        const addr = selectedAddress?.address || '';

        try {
            setIsFinalizingOrder(true);
            await clearCart();
        } finally {
            showLoader(false);
            navigation.reset({
                index: 0,
                routes: [{
                    name: 'OrderSuccessScreen',
                    params: {
                        orderId: orderData.orderId,
                        orderNumber: orderData.orderNumber || orderData.orderId,
                        paymentMethod,
                        totalItems: itemsCount,
                        totalAmount: totalAmount,
                        deliveryMode: mode,
                        address: addr,
                    }
                }],
            });
        }
    };    // --- Rendering Map ---
    const mappedItems = cartItems.map(item => ({
        id: String(item.cartItemId),
        title: item.productName,
        size: item.unitSize || item.variantName || 'Standard',
        color: '#8B4513',
        price: item.specialPrice || item.unitPrice,
        originalPrice: item.unitPrice,
        discount: item.unitPrice > (item.specialPrice || item.unitPrice)
            ? `${Math.round(((item.unitPrice - (item.specialPrice || item.unitPrice)) / item.unitPrice) * 100)}%`
            : '0%',
        quantity: item.quantity,
        image: item.productImage,
    }));

    if (cartItems.length === 0 && !isFinalizingOrder) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <AppIcons.Back color={colors.black} size={24} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Cart</Text>
                    <View style={{ width: 44 }} />
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <CartEmptyComponent />
                </View>
            </SafeAreaView>
        );
    }

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

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* Delivery Method Toggle */}
                <View style={styles.deliveryToggleRow}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setSelectedDeliveryType('express')}
                        style={[styles.toggleButton, selectedDeliveryType === 'express' && styles.toggleButtonActive]}
                    >
                        <LinearGradient
                            colors={selectedDeliveryType === 'express' ? [colors.themeTeal, colors.themeDarkTeal] : [colors.white, colors.white]}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={styles.toggleGradient}
                        >
                            <AppIcons.Check color={selectedDeliveryType === 'express' ? colors.white : colors.themeTeal} size={16} />
                            <Text style={[styles.toggleText, selectedDeliveryType === 'express' && styles.toggleTextActive]}>Express</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                            setSelectedDeliveryType('slot');
                            setShowSlotModal(true);
                        }}
                        style={[styles.toggleButton, selectedDeliveryType === 'slot' && styles.toggleButtonActive]}
                    >
                        <LinearGradient
                            colors={selectedDeliveryType === 'slot' ? [colors.themeTeal, colors.themeDarkTeal] : [colors.white, colors.white]}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={styles.toggleGradient}
                        >
                            <AppIcons.Calendar color={selectedDeliveryType === 'slot' ? colors.white : colors.themeTeal} size={16} />
                            <Text style={[styles.toggleText, selectedDeliveryType === 'slot' && styles.toggleTextActive]}>Scheduled</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Delivering to Section */}
                <View style={styles.addressCard}>
                    <View style={styles.addressRow}>
                        <View style={styles.locationIconContainer}>
                            <AppIcons.Home color={colors.themeTeal} size={20} />
                        </View>
                        <View style={styles.addressInfo}>
                            <View style={styles.deliveringToRow}>
                                <Text style={styles.deliveringToText}>Delivering to : </Text>
                                <Text style={styles.addressType}>{selectedAddress?.addressType || 'Home'}</Text>
                            </View>
                            <Text style={styles.addressDetail} numberOfLines={2}>
                                {selectedAddress ? selectedAddress.address : 'No address selected'}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => setShowAddressModal(true)}>
                            <Text style={styles.changeLink}>Change</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.deliveryDateRow}>
                        <View style={styles.calendarIconContainer}>
                            <AppIcons.Calendar color={colors.themeTeal} size={18} />
                        </View>
                        <Text style={styles.deliveryByText}>Delivery by : </Text>
                        <Text style={styles.deliveryDate}>
                            {selectedDeliveryType === 'slot'
                                ? (chosenSlot ? `${chosenSlot.dateDisplay} | ${chosenSlot.slotDisplay}` : 'Select Slot')
                                : 'Express (20-30 min)'}
                        </Text>
                    </View>
                </View>

                {/* Cart Items List */}
                <View style={styles.itemsSection}>
                    {mappedItems.map((item) => (
                        <CartItemCard
                            key={item.id}
                            item={item}
                            onDelete={(id) => {
                                const originalItem = cartItems.find(i => String(i.cartItemId) === id);
                                if (originalItem) handleRemoveItem(originalItem);
                            }}
                            onIncrement={(id) => {
                                const originalItem = cartItems.find(i => String(i.cartItemId) === id);
                                if (originalItem) handleUpdateQty(originalItem, (originalItem.quantity || 0) + 1);
                            }}
                            onDecrement={(id) => {
                                const originalItem = cartItems.find(i => String(i.cartItemId) === id);
                                if (originalItem) handleUpdateQty(originalItem, (originalItem.quantity || 0) - 1);
                            }}
                        />
                    ))}
                </View>

                {/* Save Money Section */}
                <SaveMoneySection
                    appliedCouponCode={appliedCouponCode}
                    appliedGiftCardCode={appliedGiftCardCode}
                    bcoinsAppliedValue={billCalculations.bcoinsAppliedValue || 0}
                    availableBCoins={profile?.totalBCoins || profile?.bCoins || 0}
                    onApplyOffer={onApplyOffer}
                    onRejectOffer={onRejectOffer}
                />

                {/* Bill Summary */}
                <BillSection billCalculations={billCalculations} />

            </ScrollView>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                <View style={styles.savingsBanner}>
                    <Text style={styles.savingsBannerText}>
                        Yay! You are saving <Text style={styles.savingsBold}>₹{billCalculations.totalSavings.toFixed(2)}</Text>
                    </Text>
                </View>
                <View style={styles.paymentActionRow}>
                    <View style={styles.paymentInfo}>
                        <Text style={styles.payUsingLabel}>PAY USING</Text>
                        <TouchableOpacity style={styles.paymentMethod} onPress={() => setShowPaymentModal(true)}>
                            <View style={styles.paymentIconCircle}>
                                <AppIcons.Check color={colors.white} size={14} />
                            </View>
                            <Text style={styles.payUsingValue}>{paymentMethod}</Text>
                            <AppIcons.ArrowUp color={colors.black} size={14} style={{ marginLeft: 4 }} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleConfirmOrder}
                        style={styles.payButtonContainer}>
                        <LinearGradient
                            colors={[colors.themeTeal, colors.themeDarkTeal]}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={styles.payButton}>
                            <Text style={styles.payButtonText}>Pay ₹{billCalculations.toPay.toFixed(2)}</Text>
                            <AppIcons.Forward color={colors.white} size={16} />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>

            <StatusModal visible={statusModalVisible} onClose={() => setStatusModalVisible(false)} type={statusType} title={statusTitle} message={statusMessage} />
            <AddressModal visible={showAddressModal} onClose={() => setShowAddressModal(false)} addresses={addresses} onSelectAddress={onSelectAddress} />
            <DeliverySlotModal
                visible={showSlotModal}
                onClose={() => setShowSlotModal(false)}
                onSelectSlot={(slot: any) => { setChosenSlot(slot); setSelectedDeliveryType('slot'); }}
                datesList={datesList}
                slotsByDate={slotsByDate}
            />
            <CouponModal visible={showCouponModal} onClose={() => setShowCouponModal(false)} isGiftCard={isGiftCard} availableCoupons={availableCoupons} availableGiftCards={availableGiftCards} onCouponClick={handleCouponClick} />
            <ConfirmationModal visible={isClearCartModalVisible} onClose={() => setIsClearCartModalVisible(false)} onConfirm={() => { clearCart(); setIsClearCartModalVisible(false); }} title="Clear Cart" message="Are you sure you want to remove all items?" />

            <Modal visible={showPaymentModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.paymentModalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Payment Method</Text>
                            <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                                <AppIcons.Delete color={colors.black} size={24} />
                            </TouchableOpacity>
                        </View>
                        {paymentModes.map((mode, index) => {
                            const isSelected = paymentMethod === mode.paymentModeName;
                            return (
                                <TouchableOpacity
                                    key={mode.paymentModeId || index}
                                    style={[styles.paymentMethodOption, isSelected && styles.paymentMethodOptionActive]}
                                    onPress={() => {
                                        setPaymentMethod(mode.paymentModeName);
                                        setShowPaymentModal(false);
                                    }}
                                >
                                    <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                                        {isSelected && <View style={styles.radioInner} />}
                                    </View>
                                    <Text style={[styles.paymentMethodName, isSelected && styles.paymentMethodNameActive]}>
                                        {mode.paymentModeName}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </Modal>

            <AddressConfirmationModal
                visible={!!addressConfirmationData}
                onClose={() => { setAddressConfirmationData(null); }}
                onConfirm={submitOrder}
                data={addressConfirmationData}
            />
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
        fontFamily: Fonts.gilroyBold,
    },
    deliveryToggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        gap: 12
    },
    toggleButton: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.themeTeal,
        height: 48,
    },
    toggleButtonActive: {
        borderColor: colors.themeDarkTeal,
    },
    toggleGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    toggleText: {
        fontSize: 14,
        fontFamily: Fonts.gilroyBold,
        color: colors.themeTeal,
    },
    toggleTextActive: {
        color: colors.white,
    },
    itemsSection: {
        backgroundColor: '#E8F8FA',
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    paymentModalContent: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: Fonts.bold,
        color: colors.black,
    },
    paymentMethodOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        marginBottom: 12,
    },
    paymentMethodOptionActive: {
        borderColor: colors.themeTeal,
        backgroundColor: '#F2FBFB',
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#CCC',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    radioCircleActive: {
        borderColor: colors.themeTeal,
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.themeTeal,
    },
    paymentMethodName: {
        fontSize: 16,
        fontFamily: Fonts.gilroyMedium,
        color: colors.black,
    },
    paymentMethodNameActive: {
        fontFamily: Fonts.gilroyBold,
        color: colors.themeTeal,
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
