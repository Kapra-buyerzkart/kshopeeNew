import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../../assets/theme/colours';
import { searchProductsApi } from '../../../api/services/productService';
import { getCategoryProducts } from '../../../api/services/homeService';
import { LoaderContext } from '../../../context/loaderContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONFIG from '../../../globals/config';
import { styles } from './styles';
import { AppIcons } from '../../../assets/icons';
import { useWishlist } from '../../../context/WishlistContext';
import { addToWishlistApi, removeFromWishlistApi } from '../../../api/services/wishlistService';

const ProductCategoryDetail = () => {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const { catId, title, products: initialProducts } = (route.params as any) || {};

    const [productsList, setProductsList] = useState<any[]>(initialProducts || []);
    const [pincodeAreaId, setPincodeAreaId] = useState<number | null>(null);
    const { showLoader } = useContext(LoaderContext) || { showLoader: () => { } };
    const { toggleWishlist, isInWishlist } = useWishlist();

    useEffect(() => {
        const init = async () => {
            try {
                const storedPincodeAreaId = await AsyncStorage.getItem('pincodeAreaId');
                const pId = storedPincodeAreaId ? parseInt(storedPincodeAreaId) : null;
                setPincodeAreaId(pId);
                
                // If we don't have products passed in, and we have a category ID, fetch them
                if ((!initialProducts || initialProducts.length === 0) && catId) {
                    fetchProducts(catId, pId);
                }
            } catch (error) {
                console.error("Error in init:", error);
            }
        };
        init();
    }, [catId]);

    const fetchProducts = async (categoryId: string, pId: number | null) => {
        try {
            showLoader(true);
            let response = await getCategoryProducts(categoryId, pId);
            
            if (!response || !response.success || !response.data?.items?.length) {
                response = await searchProductsApi({
                    catId: parseInt(categoryId),
                    pincodeAreaId: pId,
                    pageNumber: 1,
                    pageSize: 50
                });
            }

            if (response && response.success && response.data && response.data.items) {
                setProductsList(response.data.items);
            } else {
                setProductsList([]);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setProductsList([]);
        } finally {
            showLoader(false);
        }
    };

    const addToWishlist = async (productId: string) => {
        try {
            setProductsList(prev => prev.map(p => (p.productId || p.id) === productId ? { ...p, isWishlist: true, isWishlisted: true } : p));
            await addToWishlistApi(productId);
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            setProductsList(prev => prev.map(p => (p.productId || p.id) === productId ? { ...p, isWishlist: false, isWishlisted: false } : p));
        }
    };

    const removeFromWishlist = async (productId: string) => {
        try {
            setProductsList(prev => prev.map(p => (p.productId || p.id) === productId ? { ...p, isWishlist: false, isWishlisted: false } : p));
            await removeFromWishlistApi(productId);
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            setProductsList(prev => prev.map(p => (p.productId || p.id) === productId ? { ...p, isWishlist: true, isWishlisted: true } : p));
        }
    };

    const imageSource = (item: any) => {
        const img = item?.imageUrl || item?.featuredImage;
        if (!img) return require('../../../assets/images/bill_icon.png');
        if (typeof img === 'string') {
            if (img.startsWith('http')) return { uri: img };
            return { uri: `${CONFIG.image_base_url}/${img}`.replace(/([^:]\/)\/+/g, "$1") };
        }
        return img;
    };

    const renderProduct = ({ item }: { item: any }) => {
        const isOutOfStock = (item.stockQty <= 0 || item.stockAvailability === 'Out Of Stock');
        const hasDiscount = item.discountPercentage || item.discountPercent;
        
        return (
            <TouchableOpacity 
                style={styles.productCard} 
                onPress={() => navigation.navigate('ProductDetailsScreen', { productId: item.productId, product: item })}
                activeOpacity={0.7}
            >
                <View style={styles.topBadgesRow}>
                    <View style={[styles.discountCircle, { opacity: hasDiscount ? 1 : 0 }]}>
                        <Text style={styles.discountCircleText}>
                            {Math.round(hasDiscount || 0)}%
                        </Text>
                    </View>
                    {(item.isWishlist || item.isWishlisted) ? (
                        <TouchableOpacity onPress={() => removeFromWishlist(item.productId || item.id)}>
                            <AppIcons.BookmarkFilled color={colors.tealIconFont} size={24} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => addToWishlist(item.productId || item.id)}>
                            <AppIcons.BookmarkOutline color={colors.tealIconFont} size={24} />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={{ position: 'relative' }}>
                    <Image 
                        source={imageSource(item)} 
                        style={styles.productImage} 
                        resizeMode="contain" 
                    />
                    {isOutOfStock && (
                        <View style={styles.outOfStockOverlay}>
                            <Text style={styles.outOfStockText}>OUT OF STOCK</Text>
                        </View>
                    )}
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.productName} numberOfLines={2}>{item.prName || item.title || item.name}</Text>
                    <View style={{ height: 16 }} />
                    <View style={styles.priceRow}>
                        <View style={styles.pricePill}>
                            <Text style={styles.pricePillText}>₹{item.specialPrice || item.unitPrice || 0}</Text>
                        </View>
                        {item.unitPrice > item.specialPrice && (
                            <Text style={styles.unitPrice}>MRP ₹{item.unitPrice}</Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <AppIcons.ArrowBack size={28} color={colors.themeBlack} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{title || 'Products'}</Text>
            </View>
            <FlatList
                data={productsList}
                renderItem={renderProduct}
                keyExtractor={(item, index) => (item.productId || item.id || index).toString()}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 }}>
                        <Text style={{ fontFamily: 'Gilroy-Medium', color: '#999' }}>No products found</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default ProductCategoryDetail;
