import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { useCommonStyles } from '../../assets/styles';
import { AppIcons } from '../../assets/icons';
import { colors } from '../../assets/theme/colours';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Rating } from 'react-native-ratings';
import LinearGradient from 'react-native-linear-gradient';
import ClickForMoreButton from '../../components/ClickForMoreButton/ClickForMoreButton';

const ProductDetails = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const homeStyles = useCommonStyles();

    // Retrieve item from params or provide fallback
    const { item } = (route.params as any) || { item: {} };

    const [selectedColor, setSelectedColor] = useState(0);
    const [selectedSize, setSelectedSize] = useState('M');
    const [detailsExpanded, setDetailsExpanded] = useState(false);
    const [selectedReviewFilter, setSelectedReviewFilter] = useState('All');
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const scrollViewRef = useRef<ScrollView>(null);
    const windowWidth = Dimensions.get('window').width;
    const imageWidth = windowWidth - 24; // 12 margin applied to imageContainer from both sides

    // Mock arrays
    const productImagesByColor: Record<number, any[]> = {
        0: [
            item.image || require('../../assets/images/category/nike.png'),
            require('../../assets/images/category/casual.png'),
            require('../../assets/images/category/shirt.png')
        ],
        1: [
            require('../../assets/images/category/casual.png'),
            item.image || require('../../assets/images/category/nike.png'),
            require('../../assets/images/category/shirt.png')
        ],
        2: [
            require('../../assets/images/category/shirt.png'),
            require('../../assets/images/category/casual.png'),
            item.image || require('../../assets/images/category/nike.png')
        ]
    };

    const currentImages = productImagesByColor[selectedColor] || productImagesByColor[0];

    const sizes = ['S', 'M', 'L', 'XL'];
    const dummyReviews = [
        { id: '1', name: 'Kopilu YladRo', rating: 3, text: "Saddle slightly firm finding light hiking rough light lifestyle fitting...  Saddle slightly firm finding light hiking rough light lifestyle...", time: '1 min ago' },
        { id: '2', name: 'Kopilu YladRo', rating: 3, text: "Saddle slightly firm finding light hiking rough light lifestyle fitting...  Saddle slightly firm finding light hiking rough light lifestyle...", time: '1 min ago' },
    ];

    const productInfoDetails = [
        {
            label: 'Disclaimer',
            value: 'All images are for representative purposes only. It is advised that you read the labels and manufacturing details for more information. Health and nutritional claims...',
        },
        {
            label: 'Customer Care details',
            value: 'For queries, please contact us at care@kshopee.com or support@kshopee.com',
        },
    ];

    // Mock similar products
    const similarProducts = [
        {
            id: '1',
            title: 'Lorem Ipsum is simply dummy textLorem Ipsum is simply dummy',
            image: require('../../assets/images/home/explore.png'),
            originalPrice: 'MRP ₹394.00',
            currentPrice: '₹324.00',
            discountBadge: '-17%',
            rating: 1
        },
        {
            id: '2',
            title: 'Lorem Ipsum is simply dummy textLorem Ipsum is simply dummy',
            image: require('../../assets/images/home/explore.png'),
            originalPrice: 'MRP ₹394.00',
            currentPrice: '₹324.00',
            discountBadge: '-17%',
            rating: 1
        },
        {
            id: '3',
            title: 'Lorem Ipsum is simply dummy textLorem Ipsum is simply dummy',
            image: require('../../assets/images/home/explore.png'),
            originalPrice: 'MRP ₹394.00',
            currentPrice: '₹324.00',
            discountBadge: '-17%',
            rating: 1
        },
    ];

    const ProductTitle = item.title || "Men's Sneakers AeroStep";
    const ProductDesc = "Lightweight and stylish sneakers for everyday wear, Available in three colors: white, red, and black.";

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIconBg}>
                <AppIcons.ArrowLeft size={26} color={colors.themeBlack} />
            </TouchableOpacity>
            <View style={styles.headerRightIcons}>
                <TouchableOpacity style={styles.headerIconBg}>
                    <AppIcons.HeartOutline size={24} color={colors.themeBlack} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerIconBg}>
                    <Ionicons name="share-social-outline" size={24} color={colors.themeBlack} />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderImageSection = () => {
        {/* Image Section */ }
        return (
            <View style={styles.imageContainer}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={(e) => {
                        const slideSize = e.nativeEvent.layoutMeasurement.width;
                        const index = Math.round(e.nativeEvent.contentOffset.x / slideSize);
                        if (index !== activeImageIndex && index >= 0 && index < currentImages.length) {
                            setActiveImageIndex(index);
                        }
                    }}
                    scrollEventThrottle={16}
                >
                    {currentImages.map((img, idx) => (
                        <Image
                            key={idx}
                            source={img}
                            style={[styles.productImage, { width: imageWidth }]}
                        />
                    ))}
                </ScrollView>
                <View style={styles.paginationContainer}>
                    {currentImages.map((_, idx) => (
                        <View
                            key={idx}
                            style={idx === activeImageIndex ? styles.paginationDotActive : styles.paginationDotInactive}
                        />
                    ))}
                </View>
            </View>
        )
    }

    const deliveryAndService = () => {
        return (
            <View>
                <Text style={[styles.sectionTitle, { marginHorizontal: 16, marginTop: 8 }]}>Delivery and Service</Text>

                <View style={styles.deliveryFeaturesRow}>
                    <View style={styles.deliveryFeatureItem}>
                        <View style={styles.deliveryFeatureIcon}>
                            <AppIcons.Cash size={20} color={colors.themeTeal} />
                        </View>
                        <Text style={styles.deliveryFeatureText}>Cash On{'\n'}Delivery</Text>
                    </View>
                    <View style={styles.deliveryFeatureItem}>
                        <View style={styles.deliveryFeatureIcon}>
                            <AppIcons.Reload size={20} color={colors.themeTeal} />
                        </View>
                        <Text style={styles.deliveryFeatureText}>7 Days{'\n'}Returnable</Text>
                    </View>
                    <View style={styles.deliveryFeatureItem}>
                        <View style={styles.deliveryFeatureIcon}>
                            <AppIcons.Lock size={20} color={colors.themeTeal} />
                        </View>
                        <Text style={styles.deliveryFeatureText}>Secure{'\n'}Transaction</Text>
                    </View>
                </View>

                <View style={styles.locationCard}>
                    <View style={styles.locationHeader}>
                        <View style={styles.locationLeftRow}>
                            <AppIcons.Location size={20} color={colors.black} />
                            <Text style={styles.locationTitleText}>Delivering to : Home</Text>
                        </View>
                        <Text style={styles.locationChangeText}>Change</Text>
                    </View>
                    <Text style={styles.addressText}>
                        Nishamanzil(h),Vennala Chakkaraparambu Road ,ernakulam district 654443
                    </Text>
                </View>

                <View style={styles.deliveryDateRow}>
                    <View style={styles.calendarIconBg}>
                        <Ionicons name="calendar-outline" size={20} color={colors.themeTeal} />
                    </View>
                    <Text style={styles.deliveryDatePrefix}>Delivery by :</Text>
                    <Text style={styles.deliveryDateValue}>26 Jan 2026</Text>
                </View>
            </View>
        )
    }

    const renderSimilarProduct = ({ item: simItem }: any) => {
        // Fallback image in case the require fails or is missing
        const simImg = simItem.image || require('../../assets/images/home/dress.png');

        return (
            <TouchableOpacity style={styles.similarProductCard}>
                <View style={styles.similarDiscountBadge}>
                    <Text style={styles.similarDiscountText}>{simItem.discount}</Text>
                </View>
                <TouchableOpacity style={styles.similarBookmarkBtn}>
                    <AppIcons.BookmarkOutline size={16} color={colors.themeTeal} />
                </TouchableOpacity>
                <Image source={simImg} style={styles.similarProductImage} />
                <Text style={styles.similarTitle} numberOfLines={2}>{simItem.title}</Text>

                <Rating
                    type='custom'
                    readonly
                    startingValue={4}
                    ratingCount={5}
                    imageSize={10}
                    ratingColor={colors.starYellow}
                    ratingBackgroundColor={colors.themeLightGray}
                    tintColor={colors.themeWhite}
                    style={{ alignSelf: 'flex-start', marginVertical: 4 }}
                />

                <View style={styles.similarPriceRow}>
                    <Text style={styles.similarPrice}>{simItem.price}</Text>
                    <Text style={styles.similarOldPrice}>{simItem.oldPrice}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderExploreItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={homeStyles.exploreItemCard}>
            <View style={homeStyles.exploreTopBadgesRow}>
                <View style={homeStyles.discountCircle}>
                    <Text style={[homeStyles.discountCircleText]}>{item.discountBadge}</Text>
                </View>
                {/* <Text style={{ color: colors.figmaTeal, fontFamily: 'Gilroy-Bold', fontSize: 20 }}>W</Text> */}
                <AppIcons.BookmarkOutline color={colors.tealIconFont} size={24} />
            </View>

            <Image source={item.image} style={homeStyles.exploreItemImage} />

            <View style={{ padding: 10 }}>
                <Text style={[homeStyles.caption]} numberOfLines={3}>{item.title}</Text>

                {/* react-native-ratings stars */}
                <Rating
                    type='custom'
                    readonly
                    startingValue={item.rating || 1}
                    ratingCount={5}
                    imageSize={12}
                    ratingColor={colors.starYellow}
                    ratingBackgroundColor={colors.lightGrey}
                    tintColor={colors.white}
                    style={{ alignSelf: 'flex-start', marginVertical: 6 }}
                />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, gap: 2 }}>
                    <View style={homeStyles.pricePill}>
                        <Text style={homeStyles.pricePillText}>{item.currentPrice}</Text>
                    </View>
                    <Text style={homeStyles.originalPriceText}>{item.originalPrice}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

            {renderHeader()}

            <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>

                {/* Image Section */}
                {renderImageSection()}

                {/* Main Content Info */}
                <View style={styles.contentPadding}>
                    <Text style={styles.title}>{ProductTitle}</Text>
                    <Text style={styles.description}>{ProductDesc}</Text>

                    {/* Select Color */}
                    <Text style={styles.sectionTitle}>Select Color</Text>
                    <View style={styles.colorRow}>
                        {[0, 1, 2].map((index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.colorThumbnail, selectedColor === index && styles.colorThumbnailActive]}
                                onPress={() => {
                                    setSelectedColor(index);
                                    setActiveImageIndex(0);
                                    scrollViewRef.current?.scrollTo({ x: 0, animated: false });
                                }}
                            >
                                <Image source={productImagesByColor[index][0]} style={styles.colorImage} />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Select Size */}
                    <Text style={styles.sectionTitle}>Select Size</Text>
                    <View style={styles.sizeRow}>
                        {sizes.map((s, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.sizeCircle, selectedSize === s && styles.sizeCircleActive]}
                                onPress={() => setSelectedSize(s)}
                            >
                                <Text style={[styles.sizeText, selectedSize === s && styles.sizeTextActive]}>{s}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Product Details Accordion */}
                    <TouchableOpacity
                        style={styles.accordionHeader}
                        onPress={() => setDetailsExpanded(!detailsExpanded)}
                    >
                        <Text style={styles.accordionTitle}>Product Details</Text>
                        <Ionicons
                            name={detailsExpanded ? "chevron-up" : "chevron-down"}
                            size={20}
                            color={colors.themeDarkGray}
                        />
                    </TouchableOpacity>

                    <View style={{ overflow: 'hidden' }}>
                        {productInfoDetails.map((info, idx) => (
                            <View key={idx} style={[styles.detailsRow, idx > 0 && { marginTop: 12 }]}>
                                <View style={{ width: windowWidth / 2.9 }}>
                                    <Text style={styles.detailsLabel}>{info.label}</Text>
                                </View>
                                {typeof info.value === 'string' ? (
                                    <Text style={styles.detailsValue}>{info.value}</Text>
                                ) : (
                                    info.value
                                )}
                            </View>
                        ))}

                        {!detailsExpanded && (
                            <LinearGradient
                                colors={['rgba(255,255,255,0)', 'rgba(255, 255, 255, 0.5)', colors.themeTeal]}
                                style={styles.viewMoreOverlay}
                            >
                                <TouchableOpacity style={styles.viewMoreButton} onPress={() => setDetailsExpanded(true)}>
                                    <Ionicons name="arrow-down-circle" size={18} color={colors.black} />
                                    <Text style={styles.viewMoreText}>View more</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        )}
                    </View>
                </View>

                {/* Delivery and Service */}
                {deliveryAndService()}

                {/* Ratings & Reviews */}
                <TouchableOpacity style={[styles.accordionHeader, { paddingHorizontal: 16, marginTop: 24 }]}>
                    <Text style={styles.accordionTitle}>Rating & Reviews :</Text>
                    <Ionicons name="chevron-down" size={20} color={colors.themeDarkGray} />
                </TouchableOpacity>

                <View style={styles.ratingOverviewRow}>
                    <View style={styles.bigRatingBadge}>
                        <Text style={styles.bigRatingText}>2.5</Text>
                        <AppIcons.Star size={18} color={colors.starYellow} />
                    </View>

                    <View style={styles.ratingOverviewStats}>
                        <Text style={styles.ratingStatsText}>25 Rating</Text>
                        <View style={styles.ratingStatsDivider} />
                        <Text style={styles.ratingStatsText}>25 Reviews</Text>
                    </View>
                </View>

                {/* Filters */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.reviewFiltersScroll}>
                    {['All', 'Latest', 'Positive', 'Negative Rating'].map((filter, index) => {
                        const isActive = selectedReviewFilter === filter;
                        if (isActive) {
                            return (

                                <LinearGradient
                                    colors={[colors.themeTeal, colors.themeDarkTeal]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.reviewFilterPillActiveGradient}
                                >
                                    <TouchableOpacity key={index} onPress={() => setSelectedReviewFilter(filter)}>
                                        <Text style={[styles.reviewFilterText, styles.reviewFilterTextActive]}>{filter}</Text>
                                    </TouchableOpacity>
                                </LinearGradient>

                            );
                        }
                        return (
                            <TouchableOpacity
                                key={index}
                                style={styles.reviewFilterPill}
                                onPress={() => setSelectedReviewFilter(filter)}
                            >
                                <Text style={styles.reviewFilterText}>{filter}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* Review List */}
                {dummyReviews.map((review, index) => (
                    <View key={index} style={styles.reviewItem}>
                        <View style={styles.reviewerHeader}>
                            <Text style={styles.reviewerName}>{review.name}</Text>
                            <Rating
                                type='custom'
                                readonly
                                startingValue={review.rating}
                                ratingCount={5}
                                imageSize={12}
                                ratingColor={colors.starYellow}
                                ratingBackgroundColor={colors.themeLightGray}
                                tintColor={colors.themeWhite}
                            />
                        </View>
                        <Text style={styles.reviewText}>{review.text}</Text>
                        <Text style={styles.reviewTime}>{review.time}</Text>
                    </View>
                ))}

                <TouchableOpacity style={styles.viewAllReviewsButton}>
                    <Text style={styles.viewAllReviewsText}>View all</Text>
                </TouchableOpacity>

                {/* Similar Products */}
                <View style={styles.similarProductsContainer}>
                    <Text style={[styles.accordionTitle, { marginBottom: 4 }]}>Similar Products</Text>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.similarProductsScroll}
                    >
                        {similarProducts.map((sim, _index) => renderExploreItem({ item: sim }))}
                    </ScrollView>

                    <View style={{ marginVertical: 10 }}>
                        <ClickForMoreButton onPress={() => { }} title='Click for more' />
                    </View>

                </View>

            </ScrollView>

            {/* Sticky Footer */}
            <View style={styles.stickyFooter}>
                <View style={styles.footerPriceCol}>
                    <Text style={styles.footerPriceText}>{item.price}</Text>
                    <Text style={styles.footerOldPriceText}>{item.oldPrice}</Text>
                </View>

                <View style={styles.footerActionsRow}>
                    <TouchableOpacity style={styles.footerBagIcon}>
                        <AppIcons.Bag size={22} color={colors.themeTeal} />
                    </TouchableOpacity>

                    <LinearGradient
                        colors={[colors.themeTeal, colors.themeDarkTeal]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.reviewFilterPillActiveGradient, { borderRadius: 50 }]}
                    >
                        <TouchableOpacity onPress={() => { }} style={{ padding: 10 }} >
                            <Text style={[styles.reviewFilterText, styles.reviewFilterTextActive]}>Buy Now</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </View>

        </View >
    );
};

export default ProductDetails;