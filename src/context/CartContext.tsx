import React, { createContext, useContext, useState, useMemo, ReactNode, useCallback, useEffect } from 'react';
import { getCartApi, getCartSummaryApi, clearCartApi } from '../api/services/cartService';
import CONFIG from '../globals/config';

export interface CartItem {
    cartItemId: number;
    productId: number;
    productName: string;
    productImage: string;
    quantity: number;
    unitPrice: number;
    specialPrice?: number;
    mrp?: number;
    totalBtokens?: number;
    [key: string]: any;
}

interface CartContextType {
    cartItems: CartItem[];
    cartSummary: any | null;
    cartCount: number;
    cartTotal: number;
    error: string | null;
    loadCart: () => Promise<any>;
    getCartSummary: (deliveryMode?: string, deliverySlotId?: any, cartVersion?: any, couponCode?: any, pincodeAreaId?: any) => Promise<any>;
    clearCart: () => Promise<void>;
    addresses: any[];
    fetchAddresses: () => Promise<void>;
    // ... add other necessary fields for CartScreen
    [key: string]: any;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartSummary, setCartSummary] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [addresses, setAddresses] = useState<any[]>([]);

    const loadCart = useCallback(async () => {
        try {
            const response = await getCartApi();
            if (response && response.success && response.data) {
                const items = response.data.items || [];
                const mappedItems = items.map((item: any) => ({
                    ...item,
                    productName: item.prName || item.productName,
                    productImage: item.featuredImage ? `${CONFIG.image_base_url}${item.featuredImage}` : (item.productImage || ''),
                    quantity: item.addedQty || item.quantity || 0,
                }));
                setCartItems(mappedItems);

                // Keep cart version in summary state if available
                if (response.data.cart) {
                    setCartSummary((prev: any) => ({
                        ...(prev || {}),
                        cartVersion: response.data.cart.cartVersion,
                        cartId: response.data.cart.cartId
                    }));
                }
                return response.data;
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load cart');
        }
        return null;
    }, []);

    const getCartSummary = useCallback(async (deliveryMode = 'express', deliverySlotId = null, cartVersion = null, couponCode = null, pincodeAreaId = null) => {
        const versionToUse = cartVersion || cartSummary?.cartVersion;
        try {
            const response = await getCartSummaryApi(deliveryMode, deliverySlotId, versionToUse, couponCode, pincodeAreaId);
            if (response && response.success) {
                setCartSummary(response.data);
                return response;
            } else {
                setError(response?.message || 'Failed to get cart summary');
            }
        } catch (err: any) {
            setError(err.message || 'Error occurred while fetching summary');
        }
        return null;
    }, [cartSummary?.cartVersion]);

    const clearCart = useCallback(async () => {
        try {
            await clearCartApi(cartSummary?.cartVersion);
            setCartItems([]);
            setCartSummary(null);
        } catch (err: any) {
            setError(err.message || 'Failed to clear cart');
        }
    }, [cartSummary]);

    const fetchAddresses = useCallback(async () => {
        // This will be handled by useAddresses hook mostly, but keeping it here for compat
    }, []);

    useEffect(() => {
        loadCart();
    }, [loadCart]);

    const cartCount = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [cartItems]);
    const cartTotal = useMemo(() => cartSummary?.grandTotal || 0, [cartSummary]);

    return (
        <CartContext.Provider value={{
            cartItems,
            cartSummary,
            cartCount,
            cartTotal,
            error,
            loadCart,
            getCartSummary,
            clearCart,
            addresses,
            fetchAddresses,
            refreshCart: loadCart,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
