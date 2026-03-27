import React, { useState, useContext, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, FlatList, ImageBackground, ActivityIndicator } from 'react-native';
import { styles } from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../assets/theme/colours';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppIcons } from '../../assets/icons';
import { Rating } from 'react-native-ratings';
import FilterModal from './FilterModal';
import { getCategoriesApi } from '../../api/services/categoryService';
import { searchProductsApi } from '../../api/services/productService';
import { LoaderContext } from '../../context/loaderContext';
import { useDebounce } from '../../hooks/useDebounce';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONFIG from '../../globals/config';
import { addToWishlistApi, removeFromWishlistApi } from '../../api/services/wishlistService';
import { useWishlist } from '../../context/WishlistContext';
import { SORT_OPTIONS } from './dummyData';
import FloatingCartButton from '../../components/FloatingCartButton/FloatingCartButton';

const CategoryScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const { catId } = (route.params as any) || {};
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

    // API State Map: Sidebar -> Categories, Top Filter -> Sub Categories, Grid -> Products 
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(catId?.toString() || null);
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string | null>(null);
    const [categoriesList, setCategoriesList] = useState<any[]>([]);
    const [subCategoriesList, setSubCategoriesList] = useState<any[]>([]);
    const [productsList, setProductsList] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [pincodeAreaId, setPincodeAreaId] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const { showLoader } = useContext(LoaderContext) || { showLoader: () => { } };
    const { toggleWishlist, isInWishlist } = useWishlist();

    const [filters, setFilters] = useState({
        sortBy: 'relevance',
        priceMin: 0,
        priceMax: 5000
    });

    const debouncedSearchText = useDebounce(searchText, 500);

    const getImageUrl = (imagePath: string) => {
        if (!imagePath) return require("../../assets/images/category/men.jpg");
        if (imagePath.startsWith('http')) return { uri: imagePath };
        //console.log("Image URL ---->", `${CONFIG.image_base_url}/${imagePath}`.replace(/([^:]\/)\/+/g, "$1"))
        return { uri: `${CONFIG.image_base_url}/${imagePath}`.replace(/([^:]\/)\/+/g, "$1") };
    };

    useEffect(() => {
        const initializeLocationAndSettings = async () => {
            try {
                const storedPincodeAreaId = await AsyncStorage.getItem('pincodeAreaId');
                setPincodeAreaId(storedPincodeAreaId ? parseInt(storedPincodeAreaId) : null);
            } catch (error) {
                console.error("Error in initializeLocationAndSettings:", error);
            }
        };

        initializeLocationAndSettings();
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategoryId) {
            fetchSubCategories(selectedCategoryId);
        }

    }, [selectedCategoryId]);

    useEffect(() => {
        const catIdToFetch = selectedSubCategoryId || selectedCategoryId;
        if (catIdToFetch) {
            fetchProducts(catIdToFetch);
        }
    }, [selectedSubCategoryId, selectedCategoryId, debouncedSearchText, filters]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            showLoader(true);
            const response = await getCategoriesApi('1'); // Fetch root categories
            console.log("Category response---->", JSON.stringify(response, null, 2))
            if (response && response.success && response.data && response.data.items) {
                setCategoriesList(response.data.items);

                let targetCatId = catId?.toString();
                if (!targetCatId && response.data.items.length > 0) {
                    targetCatId = response.data.items[0].catId.toString();
                }

                if (targetCatId) {
                    setSelectedCategoryId(targetCatId);
                }
            } else {
                setCategoriesList([]);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
            showLoader(false);
        }
    };

    const fetchSubCategories = async (parentId: string) => {
        try {
            showLoader(true);
            const response = await getCategoriesApi('10');
            console.log("Subcategory response---->", JSON.stringify(response, null, 2))
            if (response && response.success && response.data && response.data.items) {
                setSubCategoriesList(response.data.items);
                setSelectedSubCategoryId(null);
            } else {
                setSubCategoriesList([]);
            }
        } catch (error) {
            console.error('Error fetching subcategories:', error);
            setSubCategoriesList([]);
        } finally {
            showLoader(false);
        }
    };


    const addToWishlist = async (productId: string) => {
        try {
            setProductsList(prev => prev.map(p => (p.productId || p.id) === productId ? { ...p, isWishlist: true, isWishlisted: true } : p));
            showLoader(true);
            const response = await addToWishlistApi(productId);
            console.log("addToWishlist response---->", JSON.stringify(response, null, 2))

        } catch (error) {
            console.error('Error adding to wishlist:', error);
            setProductsList(prev => prev.map(p => (p.productId || p.id) === productId ? { ...p, isWishlist: false, isWishlisted: false } : p));
        } finally {
            showLoader(false);
        }
    };

    const removeFromWishlist = async (productId: string) => {
        try {
            setProductsList(prev => prev.map(p => (p.productId || p.id) === productId ? { ...p, isWishlist: false, isWishlisted: false } : p));
            showLoader(true);
            const response = await removeFromWishlistApi(productId);
            console.log("removeFromWishlist response---->", JSON.stringify(response, null, 2))

        } catch (error) {
            console.error('Error removing from wishlist:', error);
            setProductsList(prev => prev.map(p => (p.productId || p.id) === productId ? { ...p, isWishlist: true, isWishlisted: true } : p));
        } finally {
            showLoader(false);
        }
    };

    const fetchProducts = async (categoryId: string) => {
        try {
            showLoader(true);
            const payload = {
                //pincodeAreaId: pincodeAreaId,
                pincodeAreaId: pincodeAreaId,
                prName: debouncedSearchText,
                catId: parseInt(categoryId),
                priceMin: filters.priceMin,
                priceMax: filters.priceMax,
                filterValues: null,
                sortBy: filters.sortBy,
                pageNumber: 1,
                pageSize: pageSize
            };
            console.log("payload for product--->", payload);
            const response = await searchProductsApi(payload);
            console.log('Products Response --->:', JSON.stringify(response, null, 2));
            if (response && response.success && response.data && response.data.items) {
                setProductsList(response.data.items);
                setPageNumber(1);
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

    const imageSource = (item: any) => {
        // console.log("Item image url--->", item)
        const img = item?.imageUrl || item?.featuredImage;
        if (!img) {
            return require('../../assets/images/bill_icon.png');
        }
        if (typeof img === 'string') {
            if (img.startsWith('http')) return { uri: img };
            return { uri: `${CONFIG.image_base_url}/${img}`.replace(/([^:]\/)\/+/g, "$1") };
        }
        return img;
    };

    const renderProduct = ({ item }: { item: any }) => (

        <TouchableOpacity style={styles.exploreItemCard} onPress={() => { navigation.navigate('ProductDetailsScreen', { productId: item?.productId, product: item }) }}>
            <View style={styles.exploreTopBadgesRow}>
                <View style={[styles.discountCircle, { opacity: item.discountPercent ? 1 : 0 }]}>
                    <Text style={[styles.discountCircleText]}>
                        {
                            item.discountPercent
                                ? `${parseFloat(item.discountPercent).toFixed(1)}%`
                                : item.discount
                        }
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

            <Image source={imageSource(item)} style={styles.exploreItemImage} resizeMode="contain" />

            <View style={{ padding: 8, flex: 1, justifyContent: 'space-between' }}>
                <View>
                    <Text style={[styles.caption]} numberOfLines={3}>{item.prName || item.title || item.name}</Text>
                </View>

                <View>
                    {/* <Rating
                        type='custom'
                        readonly
                        startingValue={item.rating || 1}
                        ratingCount={5}
                        imageSize={12}
                        ratingColor={colors.starYellow}
                        ratingBackgroundColor={colors.lightGrey}
                        tintColor={colors.themeWhite}
                        style={{ alignSelf: 'flex-start', marginVertical: 6 }}
                    /> */}
                    <View style={{ height: 20 }} />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, gap: 4 }}>
                        <View style={styles.pricePill}>
                            <Text style={styles.pricePillText}>{item.specialPrice?.toString().startsWith('₹') ? item.specialPrice : `₹${item.specialPrice || 0.00}`}</Text>
                        </View>
                        {item.unitPrice ? (
                            <Text style={styles.originalPriceText}>
                                {(item.unitPrice)?.toString().includes('MRP') ? item.unitPrice : `MRP ₹${item.unitPrice || item.price}`}
                            </Text>
                        ) : null}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    const categoryName = categoriesList.find(c => c.catId?.toString() === selectedCategoryId)?.catName || 'Categories';

    return (
        <View style={styles.container}>
            {/* Banner Section */}
            {categoriesList.map((cat: any, index: number) => {
                const isActive = selectedCategoryId === cat.catId?.toString();
                return (
                    isActive && (
                        <View key={cat.catId?.toString() || index} style={styles.bannerContainer}>
                            <ImageBackground
                                //source={require('../../assets/images/category/men.jpg')}
                                source={getImageUrl(cat.mobBannerImgUrl)}
                                style={styles.bannerBg}
                                resizeMode="cover"
                            >
                                <View style={styles.bannerHeader}>
                                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                                        <Ionicons name="arrow-back" size={28} color={colors.themeBlack} />
                                        <Text style={styles.bannerTitle}>{categoryName || 'Fashion'}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Ionicons name="search-outline" size={28} color={colors.themeBlack} />
                                    </TouchableOpacity>
                                </View>
                            </ImageBackground>
                        </View>
                    )
                )
            })}

            {/* Top Filters / Subcategories */}
            <View style={styles.topFilterContainer}>
                <TouchableOpacity style={styles.optionsIconContainer} onPress={() => setIsFilterModalVisible(true)}>
                    <View style={styles.optionsBadge}>
                        <Text style={styles.optionsBadgeText}>1</Text>
                    </View>
                    <AppIcons.FilterIcon size={20} color={colors.themeBlack} />
                </TouchableOpacity>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.topFilterList}>
                    {subCategoriesList.map((sub: any, index: number) => {
                        const isActive = selectedSubCategoryId === sub.catId?.toString();
                        return (
                            <TouchableOpacity
                                key={sub.catId?.toString() || index}
                                style={styles.filterItemContainer}
                                onPress={() => setSelectedSubCategoryId(isActive ? null : sub.catId?.toString())}
                            >
                                <View style={styles.filterContent}>
                                    <Image source={getImageUrl(sub.imageUrl)} style={styles.filterImage} />
                                    <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                                        {sub.catName}
                                    </Text>
                                </View>
                                {isActive && <View style={styles.activeIndicator} />}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Main Content */}
            <View style={styles.mainContent}>
                {/* Left Sidebar / Categories */}
                <View style={styles.sidebarContainer}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {categoriesList.map((cat: any, index: number) => {
                            const isActive = selectedCategoryId === cat.catId?.toString();
                            return (
                                <TouchableOpacity
                                    key={cat.catId?.toString() + index}
                                    style={styles.sidebarItem}
                                    onPress={() => setSelectedCategoryId(cat.catId?.toString())}
                                >
                                    <View style={isActive ? styles.sidebarIconActiveBg : styles.sidebarIconInactiveBg}>
                                        <View style={[styles.sidebarIconWrapper, isActive && styles.sidebarIconWrapperActive]}>
                                            <Image
                                                source={getImageUrl(cat.imageUrl)}
                                                style={styles.sidebarIconImage}
                                            />
                                        </View>
                                    </View>
                                    <Text style={[styles.sidebarItemText, isActive && styles.sidebarItemTextActive]}>
                                        {cat.catName}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Products Grid */}
                <View style={styles.productsGrid}>
                    <FlatList
                        data={productsList}
                        keyExtractor={(item, index) => (item.productId || item.id || index).toString()}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        renderItem={renderProduct}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        ListEmptyComponent={
                            !loading ? (
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 50 }}>
                                    <Text style={{ fontFamily: 'Outfit-Regular', color: '#999' }}>No products found</Text>
                                </View>
                            ) : null
                        }
                    />
                </View>
            </View>

            {/* Filter Modal */}
            <FilterModal
                visible={isFilterModalVisible}
                onClose={() => setIsFilterModalVisible(false)}
                onApply={(appliedFilters: Record<string, string[]>) => {
                    let min = 0, max = 50000;
                    let sortBy = 'relevance';

                    if (appliedFilters['Prize'] && appliedFilters['Prize'].length > 0) {
                        const priceOpt = appliedFilters['Prize'][0];
                        if (priceOpt === 'Below ₹500') { max = 500; }
                        else if (priceOpt === '₹500 - ₹1000') { min = 500; max = 1000; }
                        else if (priceOpt === '₹1000 - ₹2000') { min = 1000; max = 2000; }
                        else if (priceOpt === 'Above ₹2000') { min = 2000; max = 50000; }
                    }

                    if (appliedFilters['Sort by'] && appliedFilters['Sort by'].length > 0) {
                        sortBy = appliedFilters['Sort by'][0];
                    }

                    setIsFilterModalVisible(false);

                    // Delay setting filters so Modal has time to dismiss. Prevents iOS freeze when overlapping Modals.
                    setTimeout(() => {
                        setFilters({ sortBy, priceMin: min, priceMax: max });
                    }, 400);
                }}
                categoryName={categoryName}
                categoryImage={categoriesList.find(c => c.catId?.toString() === selectedCategoryId)?.imageUrl}
            />
            <FloatingCartButton />
        </View>
    );
};

export default CategoryScreen;
