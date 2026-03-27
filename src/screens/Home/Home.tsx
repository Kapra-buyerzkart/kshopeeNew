import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, FlatList, Dimensions, StyleSheet, ImageBackground, Animated, PanResponder } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useCommonStyles } from '../../assets/styles';
import { colors } from '../../assets/theme/colours';
import { RootStackParamList } from '../../types/types';
import HomeSearchBar from '../../components/HomeSearchBar/HomeSearchBar';
import ClickForMoreButton from '../../components/ClickForMoreButton/ClickForMoreButton';
import { AppIcons } from '../../assets/icons';
import { Rating } from 'react-native-ratings';
import LinearGradient from 'react-native-linear-gradient';
import FloatingCartButton from '../../components/FloatingCartButton/FloatingCartButton';
import { LoaderContext } from '../../context/loaderContext';
import { getHomepageData } from '../../api/services/homeService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONFIG from '../../globals/config';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const styles = useCommonStyles();
  const navigation = useNavigation<any>();

  const { showLoader } = useContext(LoaderContext) || { showLoader: () => { } };
  const [pincodeAreaId, setPincodeAreaId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [homeData, setHomeData] = useState<any>(null);
  const blockSize = 100;

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slideRef = useRef<FlatList>(null);
  const [superSaleIndex, setSuperSaleIndex] = useState(0);
  const superSaleRef = useRef<FlatList>(null);

  // Fetch dynamic data from the API endpoint
  const activeSliderImages = homeData?.banners?.filter((b: any) => b.placementKey === 'app_home_top_banner') || [];
  const activeGoatDeals = homeData?.banners?.filter((b: any) => b.placementKey === 'app_home_cat_top_sidebyside_four') || [];
  const activeFirstProducts = homeData?.firstProductBlock?.items || [];
  const activeSecondProducts = homeData?.secondProductBlock?.items || [];
  const activeBestSelling = homeData?.secondProductBlock?.items || [];
  const activeTopBrands = homeData?.banners?.filter((b: any) => b.placementKey === 'app_top_brands') || [];

  const gShockMainBanner = homeData?.banners?.find((b: any) => b.placementKey === 'app_home_bottom_showcase_banner_image');
  const activeGShockItems = homeData?.banners?.filter((b: any) => b.placementKey === 'app_home_bottom_showcase_product_image') || [];

  const activeSuperSaleBanners = homeData?.banners?.filter((b: any) => b.placementKey === 'app_home_mid_banner') || [];
  console.log("activeSuperSaleBanners---->", JSON.stringify(activeSuperSaleBanners, null, 2))
  const activeFlashSaleBanner = homeData?.banners?.find((b: any) => b.placementKey === 'app_flahs_sale');

  // Best Selling Carousel
  const [bestSellingIndex, setBestSellingIndex] = useState(0);
  const bestSellingIndexRef = useRef(0); // avoid stale closure in PanResponder
  const swipeAnim = useRef(new Animated.Value(0)).current;        // tracks drag delta
  const centerScale = useRef(new Animated.Value(1)).current;      // center item scale
  const centerTranslateX = useRef(new Animated.Value(0)).current; // center item slide

  // direction: 1 = going forward (next), -1 = going backward (prev)
  const goToIndex = (nextIdx: number, direction: 1 | -1 = 1) => {
    const slideOut = direction * -width * 0.7;  // exit direction  (next→leave left, prev→leave right)
    const slideIn = direction * width * 0.7;  // entry start pos (next→enter from right, prev→enter from left)

    // 1️⃣ Slide current item OUT (shrink + translate)
    Animated.parallel([
      Animated.timing(centerTranslateX, {
        toValue: slideOut,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(centerScale, {
        toValue: 0.78,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 2️⃣ Snap new item to entry side, invisible size, then flip state
      centerTranslateX.setValue(slideIn);
      centerScale.setValue(0.78);
      bestSellingIndexRef.current = nextIdx;
      setBestSellingIndex(nextIdx);

      // 3️⃣ Spring new item INTO center
      Animated.parallel([
        Animated.spring(centerTranslateX, {
          toValue: 0,
          useNativeDriver: true,
          friction: 7,
          tension: 80,
        }),
        Animated.spring(centerScale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 7,
          tension: 80,
        }),
      ]).start();
    });
  };
  //getHomepageData

  useEffect(() => {
    const initializeLocationAndSettings = async () => {
      try {
        const storedPincodeAreaId = await AsyncStorage.getItem('pincodeAreaId');
        const parsedPincodeAreaId = storedPincodeAreaId ? parseInt(storedPincodeAreaId) : null;
        setPincodeAreaId(parsedPincodeAreaId);
        fetchHomeData(parsedPincodeAreaId);
      } catch (error) {
        console.error("Error in initializeLocationAndSettings:", error);
        fetchHomeData(pincodeAreaId);
      }
    };

    initializeLocationAndSettings();
  }, []);

  const fetchHomeData = async (currentPincodeAreaId: number | null = pincodeAreaId) => {
    try {
      setLoading(true);
      showLoader(true);
      console.log('Initial load pincodeAreaId---->', currentPincodeAreaId)

      const response = await getHomepageData(currentPincodeAreaId, blockSize); // Fetch root categories
      console.log("fetchHomeData response---->", JSON.stringify(response, null, 2))
      if (response && response.success && response.data) {
        setHomeData(response.data);
      } else {
        setHomeData(null);
      }
    } catch (error) {
      console.error('Error fetching fetchHomeData:', error);
      setHomeData(null);
    } finally {
      setLoading(false);
      showLoader(false);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderMove: (_, g) => {
        swipeAnim.setValue(g.dx);
        const t = Math.abs(g.dx) / 120;
        centerScale.setValue(Math.max(0.88, 1 - t * 0.12));
      },
      onPanResponderRelease: (_, g) => {
        const cur = bestSellingIndexRef.current;
        if (g.dx < -50 && cur < activeBestSelling.length - 1) {
          goToIndex(cur + 1, 1);
        } else if (g.dx > 50 && cur > 0) {
          goToIndex(cur - 1, -1);
        } else {
          Animated.parallel([
            Animated.spring(swipeAnim, { toValue: 0, useNativeDriver: true }),
            Animated.spring(centerScale, { toValue: 1, useNativeDriver: true }),
          ]).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    const slideInterval = setInterval(() => {
      let nextIndex = currentSlideIndex + 1;
      if (nextIndex >= activeSliderImages.length) nextIndex = 0;
      slideRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentSlideIndex(nextIndex);
    }, 3000);
    return () => clearInterval(slideInterval);
  }, [currentSlideIndex, activeSliderImages.length]);

  const renderSliderItem = ({ item }: { item: any }) => (
    <Image source={item.imageUrl ? { uri: CONFIG.image_base_url + item.imageUrl } : item.image} style={styles.headerSectionImageBackground} resizeMode="cover" />
  );

  const renderGoatDeal = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.goatDealCard}>
      <Image
        source={item.imageUrl ? { uri: CONFIG.image_base_url + item.imageUrl } : item.image}
        style={styles.goatDealBg}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderExploreItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.exploreItemCard}>
      <View style={styles.exploreTopBadgesRow}>
        <View style={styles.discountCircle}>
          <Text style={[styles.discountCircleText]}>{item.discountPercent ? `-${Math.round(item.discountPercent)}%` : item.discountBadge}</Text>
        </View>
        <AppIcons.BookmarkOutline color={colors.tealIconFont} size={24} />
      </View>

      <Image source={item.featuredImage ? { uri: CONFIG.image_base_url + item.featuredImage } : item.image} style={styles.exploreItemImage} resizeMode="contain" />

      <View style={{ padding: 10, flex: 1, justifyContent: 'space-between' }}>
        <Text style={[styles.caption]} numberOfLines={3}>{item.prName || item.title}</Text>

        <View>
          <Rating
            type='custom'
            readonly
            startingValue={item.rating || 4}
            ratingCount={5}
            imageSize={12}
            ratingColor={colors.starYellow}
            ratingBackgroundColor={colors.lightGrey}
            tintColor={colors.white}
            style={{ alignSelf: 'flex-start', marginVertical: 6 }}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, gap: 2 }}>
            <View style={styles.pricePill}>
              <Text style={styles.pricePillText}>₹{item.specialPrice || item.currentPrice}</Text>
            </View>
            <Text style={styles.originalPriceText}>MRP₹{item.unitPrice || item.originalPrice}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderBrandItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={[styles.brandItemCard, { backgroundColor: 'transparent' }]}>
      <Image source={item.logo || { uri: CONFIG.image_base_url + item.imageUrl }} style={[styles.brandLogo, { zIndex: 2 }]} resizeMode="contain" />
      {/* <LinearGradient
        colors={[colors.outlineTeal, colors.white]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={localStyle.brandGradient}
      >
        <ImageBackground
          source={require('../../assets/images/logo_02.png')}
          style={styles.brandImageArea}
          imageStyle={{ opacity: 0.25 }}
        />

        <Image source={item.logo || { uri: CONFIG.image_base_url + item.imageUrl }} style={[styles.brandLogo, { zIndex: 2 }]} resizeMode="contain" />

        <Image
          source={item.imageUrl ? { uri: CONFIG.image_base_url + item.imageUrl } : item.image}
          style={localStyle.brandProductImage}
          resizeMode="contain"
        />
      </LinearGradient> */}
    </TouchableOpacity>
  );

  const renderGShockCard = ({ item }: { item: any }) => {
    const isDark = item.theme === 'dark' || item.displayOrder % 2 === 0;
    return (
      <TouchableOpacity style={[styles.gShockSmallCard, { backgroundColor: 'transparent', borderRadius: 20 }]}>
        <Image source={item.imageUrl ? { uri: CONFIG.image_base_url + item.imageUrl } : item.image} style={styles.gShockSmallImage} resizeMode="cover" />
      </TouchableOpacity>
    );
  };

  const renderFlashSaleItem = ({ item }: { item: any }) => (
    <View style={styles.flashSaleItemCard}>
      <Image source={item.image} style={styles.flashSaleImage} />
      {/* <View style={styles.flashBadgeDark}>
        <Text style={styles.flashBadgeTextDark}>Off 50%</Text>
      </View>
      <Text style={styles.flashSalePrice}>{item.price}</Text> */}
    </View>
  );

  const showCaseSliderFunc = () => {
    if (!activeBestSelling || activeBestSelling.length === 0) return null;

    return (
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, localStyle.sectionTitleAlignment]}>BEST SELLING</Text>

        {/* Single card — prev/next images peek inside at 50% opacity */}
        <View style={localStyle.bestSellingCard} {...panResponder.panHandlers}>

          {/* Prev item — left side, 50% opacity */}
          {bestSellingIndex > 0 && (
            <Image
              source={activeBestSelling[bestSellingIndex - 1].featuredImage ? { uri: CONFIG.image_base_url + activeBestSelling[bestSellingIndex - 1].featuredImage } : activeBestSelling[bestSellingIndex - 1].image}
              style={[localStyle.sideImage, localStyle.sideImageLeft]}
              resizeMode="contain"
            />
          )}

          {/* Next item — right side, 50% opacity */}
          {bestSellingIndex < activeBestSelling?.length - 1 && (
            <Image
              source={activeBestSelling[bestSellingIndex + 1].featuredImage ? { uri: CONFIG.image_base_url + activeBestSelling[bestSellingIndex + 1].featuredImage } : activeBestSelling[bestSellingIndex + 1].image}
              style={[localStyle.sideImage, localStyle.sideImageRight]}
              resizeMode="contain"
            />
          )}

          {/* Center (active) image with slide + scale animation */}
          <Animated.Image
            source={activeBestSelling[bestSellingIndex]?.featuredImage ? { uri: CONFIG.image_base_url + activeBestSelling[bestSellingIndex].featuredImage } : activeBestSelling[bestSellingIndex].image}
            style={[localStyle.centerImage, { transform: [{ translateX: centerTranslateX }, { scale: centerScale }] }]}
            resizeMode="contain"
          />

          {/* Left Arrow */}
          {bestSellingIndex > 0 && (
            <TouchableOpacity
              style={[styles.carouselArrowLeft, localStyle.arrowOverlay]}
              onPress={() => goToIndex(bestSellingIndex - 1, -1)}
            >
              <AppIcons.RightArrow color={colors.outlineTeal} size={20} style={{ transform: [{ scaleX: -1 }] }} />
            </TouchableOpacity>
          )}

          {/* Right Arrow */}
          {bestSellingIndex < activeBestSelling.length - 1 && (
            <TouchableOpacity
              style={[styles.carouselArrowRight, localStyle.arrowOverlay]}
              onPress={() => goToIndex(bestSellingIndex + 1, 1)}
            >
              <AppIcons.RightArrow color={colors.outlineTeal} size={20} />
            </TouchableOpacity>
          )}

          {/* Text row at the bottom */}
          <View style={[styles.bestSellingTextRow, { zIndex: 3, bottom: 20 }]}>
            <Text style={styles.bestSellingTitle}>{activeBestSelling[bestSellingIndex].brand || activeBestSelling[bestSellingIndex].prName}</Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.bestSellingOriginalPrice}>₹{activeBestSelling[bestSellingIndex].unitPrice || activeBestSelling[bestSellingIndex].originalPrice}</Text>
              <Text style={styles.bestSellingCurrentPrice}>₹{activeBestSelling[bestSellingIndex].specialPrice || activeBestSelling[bestSellingIndex].price}</Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 16 }}>
          <ClickForMoreButton onPress={() => { }} title="Click for more offers" />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80, backgroundColor: colors.homeScreenBackground }}>

        {/* Header Section from Screenshot 1 & 5 */}
        <View style={styles.headerSectionWrapper}>
          <FlatList
            ref={slideRef}
            data={activeSliderImages}
            renderItem={renderSliderItem}
            keyExtractor={(item, index) => item.bannerId?.toString() || item.id?.toString() || index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
          />
          <View style={[StyleSheet.absoluteFillObject, { paddingTop: 50 }]}>
            <View style={styles.topBar}>
              <TouchableOpacity style={styles.profileArea} onPress={() => navigation.navigate('KebraScreen')}>
                <Image source={{ uri: 'https://picsum.photos/seed/user/100/100' }} style={styles.profileImageReal} />
                <Text style={styles.userName}>Rahul KR</Text>
              </TouchableOpacity>

              <View style={styles.actionsPill}>
                <TouchableOpacity
                  style={styles.actionIcon}
                  onPress={() => navigation.navigate('Cart')}
                >
                  <AppIcons.Bag color={colors.black} size={20} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionIcon}>
                  {/* <View style={styles.notificationDot} /> */}
                  <AppIcons.Bell color={colors.black} size={20} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ paddingHorizontal: 16 }}>
              <HomeSearchBar placeholder="Search product" />
            </View>

            <View style={styles.headerDotsContainer}>
              {activeSliderImages.map((_, index) => (
                <View key={index} style={[styles.headerDot, currentSlideIndex === index && { backgroundColor: colors.outlineTeal }]} />
              ))}
            </View>
          </View>
        </View>

        {/* GOAT DEALS */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, localStyle.sectionTitleAlignment]}>GOAT DEALS</Text>
          <View style={styles.horizontalScrollPadding}>
            <FlatList
              data={activeGoatDeals}
              renderItem={renderGoatDeal}
              keyExtractor={(item, index) => item.bannerId?.toString() || item.id?.toString() || index.toString()}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              scrollEnabled={false}
            />
          </View>
        </View>

        {/* EXPLORE */}
        {
          homeData?.firstProductBlock?.items?.length > 0 &&
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, localStyle.sectionTitleAlignment]}>{homeData?.firstProductBlock?.title}</Text>
            <FlatList
              data={activeFirstProducts}
              renderItem={renderExploreItem}
              keyExtractor={(item, index) => item.productId?.toString() || item.id?.toString() || index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollPadding}
            />
            <View style={{ marginTop: 16 }}>
              <ClickForMoreButton onPress={() => { }} title="Click for more" />
            </View>
          </View>
        }

        {/* BEST SELLING */}
        {showCaseSliderFunc()}

        {/* TOP BRANDS */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, localStyle.sectionTitleAlignment]}>TOP BRANDS</Text>
          <FlatList
            data={activeTopBrands}
            renderItem={renderBrandItem}
            keyExtractor={(item, index) => item.bannerId?.toString() || item.id?.toString() || index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollPadding}
          />
        </View>

        {/* G-SHOCK Black Section */}
        {activeGShockItems?.length > 0 && gShockMainBanner && (
          <View style={styles.gShockSectionWrapper}>
            <ImageBackground source={{ uri: CONFIG.image_base_url + gShockMainBanner.imageUrl }} style={styles.gShockTopBanner} resizeMode="cover">
              <View style={{ paddingHorizontal: 16, position: 'absolute', bottom: -12, left: 0, right: 0 }}>
                <FlatList
                  data={activeGShockItems}
                  renderItem={renderGShockCard}
                  keyExtractor={(item, index) => item.bannerId?.toString() || item.id?.toString() || index.toString()}
                  numColumns={2}
                  columnWrapperStyle={{ justifyContent: 'space-between' }}
                  scrollEnabled={false}
                />
              </View>
            </ImageBackground>
          </View>
        )}

        {/* 11.11 SUPER SALE Banner */}
        {activeSuperSaleBanners?.length > 0 && (
          <View style={{ marginVertical: 20, alignItems: 'center' }}>
            <FlatList
              ref={superSaleRef}
              data={activeSuperSaleBanners}
              keyExtractor={(item, index) => item.bannerId?.toString() || item.id?.toString() || index.toString()}
              horizontal
              snapToInterval={width - 12}
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 6 }}
              onMomentumScrollEnd={(e) => {
                const idx = Math.round(e.nativeEvent.contentOffset.x / (width - 12));
                setSuperSaleIndex(Math.max(0, Math.min(idx, activeSuperSaleBanners.length - 1)));
              }}
              renderItem={({ item }) => (
                <Image source={{ uri: CONFIG.image_base_url + item.imageUrl }} style={styles.superSaleBannerImage} resizeMode="cover" />
              )}
            />
            {/* Dots */}
            <View style={styles.superSaleDotsContainer}>
              {activeSuperSaleBanners.map((_, index) => (
                <View key={index} style={[styles.superSalePill, superSaleIndex === index && { backgroundColor: colors.outlineTeal }]} />
              ))}
            </View>
          </View>
        )}

        {/* FLASH SALE */}
        {activeFlashSaleBanner && (
          <View style={styles.flashSaleContainer}>
            {/* <Text style={styles.hugeFlashText}>FLASH</Text> */}
            <Image source={{ uri: CONFIG.image_base_url + activeFlashSaleBanner.imageUrl }} style={styles.podiumImageBackground} resizeMode="cover" />

            {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, marginTop: -90 }}>
              {flashSaleItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  {renderFlashSaleItem({ item })}
                </React.Fragment>
              ))}
            </ScrollView> */}
            <ClickForMoreButton onPress={() => { }} title="View all Flash Deals" />
          </View>
        )}

        {/* EXPLORE */}
        {
          homeData?.secondProductBlock?.items?.length > 0 &&
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, localStyle.sectionTitleAlignment]}>{homeData?.secondProductBlock?.title}</Text>
            <FlatList
              data={activeSecondProducts}
              renderItem={renderExploreItem}
              keyExtractor={(item, index) => item.productId?.toString() || item.id?.toString() || index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollPadding}
            />
            <View style={{ marginTop: 16 }}>
              <ClickForMoreButton onPress={() => { }} title="Click for more" />
            </View>
          </View>
        }

      </ScrollView>
      <FloatingCartButton />
    </View>
  );
};

export default HomeScreen;

const localStyle = StyleSheet.create({
  sectionTitleAlignment: {
    textAlign: 'center',
    marginBottom: 20,
  },
  bestSellingCard: {
    marginHorizontal: 16,
    backgroundColor: '#8ED2C9',
    borderRadius: 24,
    height: 390,
    justifyContent: 'flex-end',
    padding: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  // Center (active) image — large, in the middle
  centerImage: {
    position: 'absolute',
    alignSelf: 'center',
    width: '65%',
    height: '75%',
    top: 20,
    zIndex: 2,
  },
  // Adjacent item images peeking from left/right at 50% opacity
  sideImage: {
    position: 'absolute',
    width: '42%',
    height: '62%',
    top: 46,
    opacity: 0.5,
    zIndex: 1,
  },
  sideImageLeft: {
    left: -30,
  },
  sideImageRight: {
    right: -30,
  },
  arrowOverlay: {
    position: 'absolute',
    top: '42%',
    zIndex: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  brandGradient: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingTop: 14,
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 20
  },
  // Watermark background: pinned to top, 70% height, full width
  brandImageArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '70%',
  },
  // Product image: pinned to bottom, 70% height
  brandProductImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '80%',
    zIndex: 1,
  },
  brandGradientLogo: {
    marginBottom: 6,
  },
  superSaleCard: {
    width: width - 20,
    height: 200,
    marginHorizontal: 10,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'flex-end',
  },
  superSaleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 10,
  },
  superSaleBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Gilroy-Bold',
    fontWeight: '700',
  },
  superSaleTitle: {
    color: '#fff',
    fontSize: 28,
    fontFamily: 'Gilroy-ExtraBold',
    fontWeight: '800',
    letterSpacing: 1,
  },
  superSaleSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontFamily: 'Gilroy-Medium',
    marginTop: 4,
  },
})
