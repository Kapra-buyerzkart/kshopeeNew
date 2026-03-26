import { useState, useCallback, useEffect } from 'react';
import { 
    applyBCoinApi, removeBCoinApi, 
    applyCouponApi, removeCouponApi, 
    applyGiftCardApi, removeGiftCardApi,
    getAvailableCouponsApi, getAvailableGiftCardsApi
} from '../api/services/cartService';


export const useOffers = (deliveryHook: any, addressHook: any, cartSummary: any, getCartSummary: any, profile: any) => {
    const [showCouponModal, setShowCouponModal] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [isGiftCard, setIsGiftCard] = useState(false);
    const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
    const [availableGiftCards, setAvailableGiftCards] = useState<any[]>([]);
    const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
    const [appliedGiftCardCode, setAppliedGiftCardCode] = useState<string | null>(null);

    const selectedAddress = addressHook.addresses.find((a: any) => a.selected);

    // Fetch available offers
    const fetchOfferData = useCallback(async () => {
        try {
            const [couponsRes, giftCardsRes] = await Promise.all([
                getAvailableCouponsApi(selectedAddress?.pincodeAreaId),
                getAvailableGiftCardsApi(selectedAddress?.pincodeAreaId)
            ]);
            if (couponsRes?.success) setAvailableCoupons(couponsRes.data || []);
            if (giftCardsRes?.success) setAvailableGiftCards(giftCardsRes.data || []);
        } catch (err) {
            console.error('Error fetching offer data:', err);
        }
    }, [selectedAddress?.pincodeAreaId]);

    useEffect(() => {
        fetchOfferData();
    }, [fetchOfferData]);

    const onApplyOffer = useCallback(async (offerType: string) => {
        // offerType: '2' for Coupon, '3' for BCoin, '4' for Smart Point
        if (offerType === '2') {
            setIsGiftCard(false);
            setShowCouponModal(true);
        } else if (offerType === '3') {
            // Apply all available B-coins from profile
            try {
                const bcoinsToApply = profile?.totalBCoins || profile?.bCoins || 0;
                if (bcoinsToApply > 0) {
                    await applyBCoinApi(bcoinsToApply, cartSummary?.cartVersion);
                    await getCartSummary();
                }
            } catch (err) {
                console.error('Error applying BCoin:', err);
            }
        } else if (offerType === '4') {
            setIsGiftCard(true);
            setShowCouponModal(true);
        }
    }, [cartSummary, getCartSummary]);

    const onRejectOffer = useCallback(async (offerType: string) => {
        try {
            if (offerType === '2') {
                await removeCouponApi(cartSummary?.cartVersion);
                setAppliedCouponCode(null);
            } else if (offerType === '3') {
                await removeBCoinApi(cartSummary?.cartVersion);
            } else if (offerType === '4') {
                await removeGiftCardApi(cartSummary?.cartVersion);
                setAppliedGiftCardCode(null);
            }
            await getCartSummary();
        } catch (err) {
            console.error('Error removing offer:', err);
        }
    }, [cartSummary, getCartSummary]);

    const handleApplyCoupon = useCallback(async (code: string) => {
        try {
            if (isGiftCard) {
                await applyGiftCardApi(code, cartSummary?.cartVersion, selectedAddress?.pincodeAreaId);
                setAppliedGiftCardCode(code);
            } else {
                await applyCouponApi(code, cartSummary?.cartVersion, selectedAddress?.pincodeAreaId);
                setAppliedCouponCode(code);
            }
            await getCartSummary();
            setShowCouponModal(false);
        } catch (err) {
            console.error('Error applying coupon/giftcard:', err);
        }
    }, [isGiftCard, cartSummary, getCartSummary, selectedAddress]);

    const handleCouponClick = useCallback((coupon: any) => {
        handleApplyCoupon(coupon.code || coupon.couponCode);
    }, [handleApplyCoupon]);

    return {
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
    };
};
