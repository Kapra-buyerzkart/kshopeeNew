import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';

// --- Types ---
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    categoryId: string;
}

export interface SpecialItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    categoryId: string;
}

export interface Category {
    id: string;
    name: string;
}

interface CartContextType {
    cart: { [key: string]: number };
    addToCart: (productId: string, price: number) => void;
    removeFromCart: (productId: string) => void;
    cartTotal: { count: number; price: number };
    categories: Category[];
    specialItems: SpecialItem[];
    addSpecialItem: (product: SpecialItem) => void;
    removeSpecialItem: (productId: string) => void;
    activeOrderId: string | null;
    setActiveOrderId: (id: string | null) => void;
    clearCart: () => void;
}

// --- Context ---
const CartContext = createContext<CartContextType | undefined>(undefined);

// --- Categories Data (shared across screens) ---
const CATEGORIES: Category[] = [
    { id: 'all', name: 'All products' },
    { id: 'appetizer', name: 'Appetizers' },
    { id: 'main', name: 'Main Course' },
    { id: 'dessert', name: 'Desserts' },
    { id: 'drink', name: 'Drinks' },
];

// --- Provider ---
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<{ [key: string]: number }>({});
    const [cartPrices, setCartPrices] = useState<{ [key: string]: number }>({});
    const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
    const [specialItems, setSpecialItems] = useState<SpecialItem[]>([
        {
            id: 'sp1',
            name: 'Salad Egg',
            description: '',
            price: 370.67,
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60',
            categoryId: 'special',
        },
        {
            id: 'sp2',
            name: 'Salad Tuna',
            description: '(Must choose level)',
            price: 500.67,
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60',
            categoryId: 'special',
        },
    ]);

    const addToCart = (productId: string, price: number) => {
        setCart(prev => ({
            ...prev,
            [productId]: (prev[productId] || 0) + 1,
        }));
        setCartPrices(prev => ({ ...prev, [productId]: price }));
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => {
            const current = prev[productId] || 0;
            if (current <= 1) {
                const { [productId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [productId]: current - 1 };
        });
    };

    const addSpecialItem = (product: SpecialItem) => {
        setSpecialItems(prev => [...prev, product]);
    };

    const removeSpecialItem = (productId: string) => {
        setSpecialItems(prev => prev.filter(item => item.id !== productId));
    };

    const clearCart = () => {
        setCart({});
        setCartPrices({});
        setActiveOrderId(null);
    };

    const cartTotal = useMemo(() => {
        let count = 0;
        let price = 0;
        Object.entries(cart).forEach(([id, quantity]) => {
            // Check in special items first, then use stored price for DB products
            const specialItem = specialItems.find(p => p.id === id);
            if (specialItem) {
                count += quantity;
                price += specialItem.price * quantity;
            } else if (cartPrices[id]) {
                count += quantity;
                price += cartPrices[id] * quantity;
            }
        });
        return { count, price };
    }, [cart, cartPrices, specialItems]);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                clearCart,
                cartTotal,
                categories: CATEGORIES,
                specialItems,
                addSpecialItem,
                removeSpecialItem,
                activeOrderId,
                setActiveOrderId,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// --- Custom Hook ---
export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
