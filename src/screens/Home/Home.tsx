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
import { useUser } from '../../context/UserContext';
import { getHomepageData } from '../../api/services/homeService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONFIG from '../../globals/config';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const styles = useCommonStyles();
  const navigation = useNavigation<any>();

  const { showLoader } = useContext(LoaderContext) || { showLoader: () => { } };
  const { profile } = useUser();
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
  console.log("activeGoatDeals--->", activeGoatDeals)
  const unwrapBlock = (block: any): any => {
    let current = block;
    // Attempt to parse if string, up to 2 times (in case of double-stringify)
    for (let i = 0; i < 2; i++) {
      if (typeof current === 'string') {
        try { current = JSON.parse(current); }
        catch (e) { break; }
      }
    }
    // Attempt to unwrap if nested: { firstProductBlock: { ... } }
    if (typeof current === 'object' && current !== null) {
      if (current.firstProductBlock) return current.firstProductBlock;
      if (current.secondProductBlock) return current.secondProductBlock;
      return current;
    }
    return current;
  };

  const parsedFirstBlock = unwrapBlock(homeData?.firstProductBlock);
  const parsedSecondBlock = unwrapBlock(homeData?.secondProductBlock);

  console.log("DEBUG parsedFirstBlock ->", typeof parsedFirstBlock, parsedFirstBlock ? Object.keys(parsedFirstBlock) : 'null');
  if (parsedFirstBlock && !parsedFirstBlock.items) {
    console.log("DEBUG raw homeData.firstProductBlock ->", typeof homeData?.firstProductBlock, homeData?.firstProductBlock);
  }

  const activeFirstProducts = parsedFirstBlock?.items || [];
  console.log("activeFirstProducts", activeFirstProducts);
  const activeSecondProducts = parsedSecondBlock?.items || [];
  console.log("activeSecondProducts", activeSecondProducts);

  const activeBestSelling = homeData?.showcaseSlider || [];
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
        const bestSelling = response.data.showcaseSlider || [];
        if (bestSelling.length > 2) {
          setBestSellingIndex(1);
          bestSellingIndexRef.current = 1;
        } else {
          setBestSellingIndex(0);
          bestSellingIndexRef.current = 0;
        }
      } else {
        setHomeData(null);
        setBestSellingIndex(0);
        bestSellingIndexRef.current = 0;
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

  const handleBannerPress = (item: any) => {
    const type = item.targetType || item.linkType;
    const value = item.targetId || item.linkValue;

    if (type && value) {
      if (type.toLowerCase() === 'product') {
        navigation.navigate('ProductDetailsScreen', { productId: value });
      } else if (type.toLowerCase() === 'category') {
        navigation.navigate('ProductCategoryDetail', { 
          catId: value.toString(),
          title: "Category"
        });
      }
    } else if (item.productId) {
      navigation.navigate('ProductDetailsScreen', { productId: item.productId, product: item });
    }
  };

  const renderSliderItem = ({ item }: { item: any }) => (
    <TouchableOpacity activeOpacity={0.9} onPress={() => handleBannerPress(item)}>
      <Image source={item.imageUrl ? { uri: CONFIG.image_base_url + item.imageUrl } : item.image} style={styles.headerSectionImageBackground} resizeMode="cover" />
    </TouchableOpacity>
  );

  const renderGoatDeal = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.goatDealCard} onPress={() => handleBannerPress(item)}>
      <Image
        source={{ uri: CONFIG.image_base_url + item.imageUrl }}
        style={styles.goatDealBg}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderExploreItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.exploreItemCard} 
      onPress={() => handleBannerPress(item)}
    >
      <View style={styles.exploreTopBadgesRow}>
        <View style={styles.discountCircle}>
          <Text style={[styles.discountCircleText]}>
            {item.discountPercent ? `-${Math.round(item.discountPercent)}%` : item.discountBadge}
          </Text>
        </View>
        <AppIcons.BookmarkOutline color={colors.tealIconFont} size={24} />
      </View>

      <View style={{ position: 'relative' }}>
        <Image 
          source={item.featuredImage ? { uri: CONFIG.image_base_url + item.featuredImage } : item.image} 
          style={styles.exploreItemImage} 
          resizeMode="contain" 
        />
        {(item.stockQty <= 0 || item.stockAvailability === 'Out Of Stock') && (
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255,255,255,0.6)',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 15
          }}>
            <Text style={{
              color: colors.black,
              fontFamily: 'Gilroy-Bold',
              fontSize: 12,
              backgroundColor: 'rgba(255,255,255,0.9)',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
              overflow: 'hidden'
            }}>OUT OF STOCK</Text>
          </View>
        )}
      </View>

      <View style={{ padding: 10, flex: 1, justifyContent: 'space-between' }}>
        <Text style={[styles.caption]} numberOfLines={3}>{item.prName || item.title}</Text>

        <View>
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
    <TouchableOpacity 
      style={[styles.brandItemCard, { backgroundColor: 'transparent' }]}
      onPress={() => handleBannerPress(item)}
    >
      <Image 
        source={item.logo || { uri: CONFIG.image_base_url + item.imageUrl }} 
        style={[styles.brandLogo, { zIndex: 2 }]} 
        resizeMode="contain" 
      />
      <Image
        source={item.imageUrl ? { uri: CONFIG.image_base_url + item.imageUrl } : item.image}
        style={localStyle.brandProductImage}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  const renderGShockCard = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity 
        style={[styles.gShockSmallCard, { backgroundColor: 'transparent', borderRadius: 20 }]}
        onPress={() => handleBannerPress(item)}
      >
        <Image source={item.imageUrl ? { uri: CONFIG.image_base_url + item.imageUrl } : item.image} style={styles.gShockSmallImage} resizeMode="cover" />
      </TouchableOpacity>
    );
  };

  const renderFlashSaleItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.flashSaleItemCard}
      onPress={() => handleBannerPress(item)}
    >
      <Image source={item.image || { uri: CONFIG.image_base_url + item.imageUrl }} style={styles.flashSaleImage} />
    </TouchableOpacity>
  );

  const showCaseSliderFunc = () => {
    if (!activeBestSelling || activeBestSelling.length === 0) return null;

      return (
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, localStyle.sectionTitleAlignment]}>IN THE SPOTLIGHT</Text>

        {/* Single card — prev/next images peek inside at 50% opacity */}
        <View style={localStyle.bestSellingCard} {...panResponder.panHandlers}>

          {/* Prev item — left side, 50% opacity */}
          {bestSellingIndex > 0 && (
            <Image
              source={(activeBestSelling[bestSellingIndex - 1].imageUrl || activeBestSelling[bestSellingIndex - 1].image) ? { uri: CONFIG.image_base_url + (activeBestSelling[bestSellingIndex - 1].imageUrl || activeBestSelling[bestSellingIndex - 1].image) } : activeBestSelling[bestSellingIndex - 1].image}
              style={[localStyle.sideImage, localStyle.sideImageLeft]}
              resizeMode="contain"
            />
          )}

          {/* Next item — right side, 50% opacity */}
          {bestSellingIndex < activeBestSelling?.length - 1 && (
            <Image
              source={(activeBestSelling[bestSellingIndex + 1].imageUrl || activeBestSelling[bestSellingIndex + 1].image) ? { uri: CONFIG.image_base_url + (activeBestSelling[bestSellingIndex + 1].imageUrl || activeBestSelling[bestSellingIndex + 1].image) } : activeBestSelling[bestSellingIndex + 1].image}
              style={[localStyle.sideImage, localStyle.sideImageRight]}
              resizeMode="contain"
            />
          )}

          {/* Center (active) image with slide + scale animation */}
          <TouchableOpacity activeOpacity={0.9} onPress={() => handleBannerPress(activeBestSelling[bestSellingIndex])}>
            <Animated.Image
              source={activeBestSelling[bestSellingIndex]?.featuredImage ? { uri: CONFIG.image_base_url + activeBestSelling[bestSellingIndex].featuredImage } : activeBestSelling[bestSellingIndex].image}
              style={[localStyle.centerImage, { transform: [{ translateX: centerTranslateX }, { scale: centerScale }] }]}
              resizeMode="contain"
            />
          </TouchableOpacity>

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
          <ClickForMoreButton 
            onPress={() => {
              navigation.navigate('ProductCategoryDetail', { title: 'Category', products: activeBestSelling });
            }} 
            title="Click for more offers" 
          />
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
                  <View style={styles.profileImageReal}>
                    <AppIcons.User size={20} color={colors.themeTeal} />
                  </View>
                  <Text style={styles.userName}>
                  {profile?.custName
                    ? (profile.custName.length > 15 ? `${profile.custName.substring(0, 15)}...` : profile.custName)
                    : "Guest User"}
                  </Text>
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
                {activeSliderImages.map((_: any, index: number) => (
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
            activeFirstProducts.length > 0 &&
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, localStyle.sectionTitleAlignment]}>{parsedFirstBlock?.title}</Text>
              <FlatList
                data={activeFirstProducts}
                renderItem={renderExploreItem}
                keyExtractor={(item, index) => item.productId?.toString() || item.id?.toString() || index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScrollPadding}
              />
              <View style={{ marginTop: 16 }}>
                <ClickForMoreButton 
                  onPress={() => {
                    const id = parsedFirstBlock?.catId || parsedFirstBlock?.id || parsedFirstBlock?.categoryId || parsedFirstBlock?.CategoryId;
                    navigation.navigate('ProductCategoryDetail', { 
                        catId: id?.toString(),
                        title: "Category",
                        products: activeFirstProducts
                    });
                  }} 
                  title="Click for more" 
                />
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
                <View style={{ paddingHorizontal: 16, position: 'absolute', bottom: 20, left: 0, right: 0 }}>
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
            <View style={{ marginVertical: 10, alignItems: 'center' }}>
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
                  <TouchableOpacity activeOpacity={0.9} onPress={() => handleBannerPress(item)}>
                    <Image source={{ uri: CONFIG.image_base_url + item.imageUrl }} style={styles.superSaleBannerImage} resizeMode="cover" />
                  </TouchableOpacity>
                )}
              />
              {/* Dots */}
              <View style={styles.superSaleDotsContainer}>
                {activeSuperSaleBanners.map((_: any, index: number) => (
                  <View key={index} style={[styles.superSalePill, superSaleIndex === index && { backgroundColor: colors.outlineTeal }]} />
                ))}
              </View>
            </View>
          )}

          {/* FLASH SALE */}
          {activeFlashSaleBanner && (
            <View style={styles.flashSaleContainer}>
              {/* <Text style={styles.hugeFlashText}>FLASH</Text> */}
              <TouchableOpacity activeOpacity={0.9} onPress={() => handleBannerPress(activeFlashSaleBanner)}>
                <Image source={{ uri: CONFIG.image_base_url + activeFlashSaleBanner.imageUrl }} style={styles.podiumImageBackground} resizeMode="cover" />
              </TouchableOpacity>

              {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, marginTop: -90 }}>
              {flashSaleItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  {renderFlashSaleItem({ item })}
                </React.Fragment>
              ))}
            </ScrollView> */}
              <View style={{ marginTop: -60, position: 'relative' }}>
                <ClickForMoreButton 
                  onPress={() => {
                    const id = activeFlashSaleBanner?.targetId || activeFlashSaleBanner?.linkValue || activeFlashSaleBanner?.id || activeFlashSaleBanner?.catId;
                    if (id) {
                      navigation.navigate('ProductCategoryDetail', { 
                        catId: id.toString(),
                        title: "Category"
                      });
                    }
                  }} 
                  title="View all Flash Deals" 
                />
              </View>

            </View>
          )}

          {/* EXPLORE */}
          {
            activeSecondProducts.length > 0 &&
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, localStyle.sectionTitleAlignment]}>{parsedSecondBlock?.title}</Text>
              <FlatList
                data={activeSecondProducts}
                renderItem={renderExploreItem}
                keyExtractor={(item, index) => item.productId?.toString() || item.id?.toString() || index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScrollPadding}
              />
              <View style={{ marginTop: 16 }}>
                <ClickForMoreButton 
                  onPress={() => {
                    const id = parsedSecondBlock?.catId || parsedSecondBlock?.id || parsedSecondBlock?.categoryId || parsedSecondBlock?.CategoryId;
                    navigation.navigate('ProductCategoryDetail', { 
                        catId: id?.toString(),
                        title: "Category",
                        products: activeSecondProducts
                    });
                  }} 
                  title="Click for more" 
                />
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
      shadowOffset: {width: 0, height: 2 },
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
