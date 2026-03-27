import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, SafeAreaView, ActivityIndicator } from 'react-native';
import { styles } from './styles';
import { AppIcons } from '../../assets/icons';
import ProductCard from '../../components/ProductCard';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors } from '../../assets/theme/colours';
import { wp } from '../../utils/responsive';
import LinearGradient from 'react-native-linear-gradient';

import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { addToCartApi, removeFromCartApi } from '../../api/services/cartService';
import FloatingCartButton from '../../components/FloatingCartButton/FloatingCartButton';
import { Alert } from 'react-native';
import ConfirmationModal from '../../components/ConfirmationModal';

const WishlistScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const { wishlistItems, loadWishlist, isLoading, toggleWishlist } = useWishlist();
    const { cartItems, cartSummary, loadCart } = useCart();
    const [itemToRemove, setItemToRemove] = useState<any>(null);

    const handleCartToggle = async (item: any) => {
        const productId = item.productId || item.id;
        const existingCartItem = cartItems.find(c => c.productId === productId);

        try {
            if (existingCartItem) {
                // Item is already in cart, remove it
                await removeFromCartApi(
                    existingCartItem.cartItemId,
                    cartSummary?.cartVersion,
                    productId
                );
            } else {
                // Item is not in cart, add it
                await addToCartApi(productId, 1);
            }
            await loadCart();
        } catch (error) {
            console.error('Error toggling cart item:', error);
            Alert.alert('Error', 'Failed to update cart. Please try again.');
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadWishlist(true);
        }, [loadWishlist])
    );

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AppIcons.ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Wishlist</Text>
            </View>
            <View style={styles.headerRight}>
                <TouchableOpacity style={styles.headerIcon}>
                    <AppIcons.Search size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.cartIconContainer}
                    onPress={() => navigation.navigate('Cart')}>
                    <AppIcons.ShoppingCart size={18} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderFooter = () => (
        <View style={styles.footerContainer}>
            {wishlistItems.length > 0 && (
                <Image source={require('../../assets/images/nomorewishlist.png')} style={{ width: 140, height: 140 }} resizeMode='contain' />
            )}
        </View>
    );

    if (isLoading && wishlistItems.length === 0) {
        return (
            <SafeAreaView style={styles.mainContainer}>
                {renderHeader()}
                <View style={[styles.emptyContainer, { justifyContent: 'center' }]}>
                    <ActivityIndicator size="large" color={colors.themeBg} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            {renderHeader()}

            {wishlistItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Image
                        source={require('../../assets/images/nowishlist.png')}
                        style={styles.emptyImage}
                    />
                    <Text style={styles.emptyText}> Oops! No wishlist</Text>
                </View>
            ) : (
                <View style={{ backgroundColor: colors.wishlistbg, flex: 1 }}>
                    <FlatList
                        data={wishlistItems}
                        renderItem={({ item }) => (
                            <ProductCard
                                item={item}
                                isWishlisted={true}
                                isInCart={cartItems.some(c => c.productId === (item.productId || item.id))}
                                onAddToCart={() => handleCartToggle(item)}
                                onWishlistPress={() => setItemToRemove(item)}
                            />
                        )}
                        keyExtractor={(item) => (item.productId || item.id).toString()}
                        numColumns={2}
                        contentContainerStyle={styles.listContent}
                        ListFooterComponent={renderFooter}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            )}
            <FloatingCartButton />
            <ConfirmationModal
                visible={!!itemToRemove}
                onClose={() => setItemToRemove(null)}
                onConfirm={() => {
                    if (itemToRemove) {
                        toggleWishlist(itemToRemove);
                        setItemToRemove(null);
                    }
                }}
                title="Remove Item"
                message="Are you sure you want to remove this item from your wishlist?"
                confirmText="Remove"
                themeColor={colors.themeTeal}
            />
        </SafeAreaView>
    );
};

export default WishlistScreen;
