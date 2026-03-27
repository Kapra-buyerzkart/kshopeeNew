import { useMemo, useCallback, useRef, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { useOffers } from './useOffers';
import { useDeliverySlot } from './useDeliverySlot';
import { useAddresses } from './useAddresses';
import { useUser } from '../context/UserContext';

export const useCartScreen = () => {
    const navigation = useNavigation<any>();
    const { cartItems, loadCart, cartTotal, cartCount, cartSummary, getCartSummary, clearCart, error: cartError, fetchAddresses } = useCart();

    // ─── Composed hooks ───
    const { profile } = useUser();
    const deliveryHook = useDeliverySlot();
    const addressHook = useAddresses();
    const offersHook = useOffers(deliveryHook, addressHook, cartSummary, getCartSummary, profile, loadCart);

    // ─── Bill calculations ───
    const frontendBillCalculations = useMemo(() => {
        let mrpTotal = 0;
        let itemTotal = 0;
        cartItems.forEach(item => {
            const quantity = item.quantity || 1;
            const specialPrice = item.specialPrice || item.unitPrice || item.price || 0;
            const mrpPrice = item.mrp || item.mrpPrice || specialPrice;
            itemTotal += specialPrice * quantity;
            mrpTotal += mrpPrice * quantity;
        });
        const savings = mrpTotal - itemTotal;
        const deliveryCharge = (itemTotal > 0 && itemTotal < 500) ? 0 : 0;
        const totalSavings = savings + (deliveryCharge === 0 && itemTotal >= 500 ? 5 : 0);
        const toPay = itemTotal + deliveryCharge;
        return {
            mrpTotal,
            itemTotal,
            savings,
            deliveryCharge,
            couponDiscount: 0,
            giftCardAmount: 0,
            bcoinsAppliedValue: 0,
            totalBtokens: 0,
            totalSavings: savings,
            toPay
        };
    }, [cartItems]);

    const billCalculations = useMemo(() => {
        if (cartSummary) {
            return {
                mrpTotal: (cartSummary.subTotal || 0) + (cartSummary.productDiscount || 0),
                itemTotal: cartSummary.subTotal ?? frontendBillCalculations.itemTotal,
                savings: cartSummary.productDiscount ?? 0,
                deliveryCharge: cartSummary.deliveryAmount ?? 0,
                couponDiscount: cartSummary.couponAmount ?? 0,
                giftCardAmount: cartSummary.giftCardAmount ?? 0,
                bcoinsAppliedValue: cartSummary.bcoinsAppliedValue ?? 0,
                totalTax: cartSummary.totalTax ?? 0,
                totalBtokens: cartSummary.totalBtokens ?? 0,
                totalSavings: cartSummary.totalDiscount ?? 0,
                toPay: cartSummary.grandTotal ?? frontendBillCalculations.toPay
            };
        }
        return frontendBillCalculations;
    }, [cartSummary, frontendBillCalculations]);

    // ─── Cart initialization (loadCart → getCartSummary) ───
    const isInitialMount = useRef(true);
    const selectedAddress = useMemo(() => addressHook.addresses.find(a => a.selected), [addressHook.addresses]);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initCart = async () => {
                console.log('🏁 [FOCUS] Fetching fresh data...');
                try {
                    await addressHook.refreshAddresses();
                    const loadResult: any = await loadCart();

                    if (!isActive) return;

                    // Use a functional approach to get the current address after refresh
                    // since the 'selectedAddress' from scope is stale
                    const bootstrapVersion = loadResult?.cartVersion;
                    await getCartSummary(deliveryHook.deliveryMode, deliveryHook.selectedSlot, bootstrapVersion);

                    // Slots fetch is handled by the useEffect below once addresses are loaded
                } catch (err) {
                    console.error('❌ [FOCUS] Error:', err);
                } finally {
                    if (isActive) {
                        isInitialMount.current = false;
                    }
                }
            };

            initCart();
            return () => { isActive = false; };
        }, [loadCart, getCartSummary]) // Removed selectedAddress to prevent loop
    );

    // Recalculate summary when conditions change
    useEffect(() => {
        if (isInitialMount.current || !selectedAddress) return;

        console.log('🔄 [HOOK] Refreshing summary on change:', selectedAddress?.id);
        // Added null as 4th arg for couponCode to correctly pass pincodeAreaId as 5th
        getCartSummary(deliveryHook.deliveryMode, deliveryHook.selectedSlot, null, null, selectedAddress?.pincodeAreaId);
        deliveryHook.fetchSlots(selectedAddress?.pincodeAreaId);
    }, [deliveryHook.selectedDeliveryType, deliveryHook.selectedSlot, selectedAddress?.id]);

    return {
        // Cart
        cartItems,
        cartSummary,
        billCalculations,
        loadCart,
        getCartSummary,
        clearCart,
        cartError,
        fetchAddresses,
        navigation,
        fetchAddresses,

        // Composed hooks (spread for backward compat)
        ...offersHook,
        ...deliveryHook,
        ...addressHook,
    };
};
