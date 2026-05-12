// import React, { useState, useEffect, useRef, useContext } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   Image,
//   TouchableOpacity,
//   FlatList,
//   Dimensions,
//   StyleSheet,
//   ImageBackground,
//   Animated,
//   PanResponder,
//   RefreshControl,
// } from 'react-native';
// import {
//   NavigationProp,
//   useNavigation,
//   useFocusEffect,
// } from '@react-navigation/native';
// import { useCommonStyles } from '../../assets/styles';
// import { colors } from '../../assets/theme/colours';
// import { RootStackParamList } from '../../types/types';
// import ProductCard from '../../components/ProductCard';
// import ExploreItem from '../../components/ExploreItem/ExploreItem';
// import HomeSearchBar from '../../components/HomeSearchBar/HomeSearchBar';
// import ClickForMoreButton from '../../components/ClickForMoreButton/ClickForMoreButton';
// import { AppIcons } from '../../assets/icons';
// import { Rating } from 'react-native-ratings';
// import LinearGradient from 'react-native-linear-gradient';
// import FloatingCartButton from '../../components/FloatingCartButton/FloatingCartButton';
// import { LoaderContext } from '../../context/loaderContext';
// import { useUser } from '../../context/UserContext';
// import { useWishlist } from '../../context/WishlistContext';
// import { getHomepageData } from '../../api/services/homeService';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import CONFIG from '../../globals/config';
// import FallbackImage from '../../components/FallbackImage';

// const { width } = Dimensions.get('window');

// const HomeScreen: React.FC = () => {
//   const styles = useCommonStyles();
//   const navigation = useNavigation<any>();

//   const { showLoader } = useContext(LoaderContext) || { showLoader: () => {} };
//   const { profile } = useUser();
//   const { toggleWishlist, isInWishlist } = useWishlist();
//   const [pincodeAreaId, setPincodeAreaId] = useState<number | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [homeData, setHomeData] = useState<any>(null);
//   const blockSize = 100;

//   const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
//   const slideRef = useRef<FlatList>(null);
//   const [superSaleIndex, setSuperSaleIndex] = useState(0);
//   const superSaleRef = useRef<FlatList>(null);

//   // Fetch dynamic data from the API endpoint
//   const activeSliderImages =
//     homeData?.banners?.filter(
//       (b: any) => b.placementKey === 'app_home_top_banner',
//     ) || [];
//   const activeGoatDeals =
//     homeData?.banners?.filter(
//       (b: any) => b.placementKey === 'app_home_cat_top_sidebyside_four',
//     ) || [];
//   console.log('activeGoatDeals--->', activeGoatDeals);
//   const unwrapBlock = (block: any): any => {
//     if (!block) return null;
//     let current = block;
//     // Attempt to parse if string, up to 3 times (in case of deep stringification)
//     for (let i = 0; i < 3; i++) {
//       if (typeof current === 'string' && current.trim().startsWith('{')) {
//         try {
//           current = JSON.parse(current);
//         } catch (e) {
//           break;
//         }
//       } else {
//         break;
//       }
//     }

//     // Handle nested data structures
//     if (current && typeof current === 'object') {
//       // If it's the wrapper object { firstProductBlock: { ... } }
//       if (current.firstProductBlock) current = current.firstProductBlock;
//       else if (current.FirstProductBlock) current = current.FirstProductBlock;
//       else if (current.secondProductBlock) current = current.secondProductBlock;
//       else if (current.SecondProductBlock) current = current.SecondProductBlock;
//       else if (current.data && !current.items && !current.Items)
//         current = current.data;

//       // If it's a string again after unwrapping (some APIs do this)
//       if (typeof current === 'string' && current.trim().startsWith('{')) {
//         try {
//           current = JSON.parse(current);
//         } catch (e) {}
//       }
//     }

//     return current;
//   };

//   const parsedFirstBlock = unwrapBlock(
//     homeData?.firstProductBlock || homeData?.firstproductblock,
//   );
//   const parsedSecondBlock = unwrapBlock(
//     homeData?.secondProductBlock || homeData?.secondproductblock,
//   );

//   console.log(
//     'DEBUG parsedFirstBlock ->',
//     typeof parsedFirstBlock,
//     parsedFirstBlock ? Object.keys(parsedFirstBlock) : 'null',
//   );
//   if (parsedFirstBlock && !parsedFirstBlock.items) {
//     console.log(
//       'DEBUG raw homeData.firstProductBlock ->',
//       typeof homeData?.firstProductBlock,
//       homeData?.firstProductBlock,
//     );
//   }

//   const getItems = (block: any) => {
//     if (!block) return [];
//     if (Array.isArray(block)) return block;
//     if (block.items && Array.isArray(block.items)) return block.items;
//     if (block.Items && Array.isArray(block.Items)) return block.Items;
//     if (block.data && Array.isArray(block.data)) return block.data;
//     return [];
//   };

//   const activeFirstProducts = getItems(parsedFirstBlock).filter(
//     (i: any) => i && (i.productId || i.id),
//   );
//   console.log('activeFirstProducts', activeFirstProducts);
//   const activeSecondProducts = getItems(parsedSecondBlock).filter(
//     (i: any) => i && (i.productId || i.id),
//   );
//   console.log('activeSecondProducts', activeSecondProducts);

//   const activeBestSelling = homeData?.showcaseSlider || [];
//   console.log(
//     'The best selling products',
//     JSON.stringify(activeBestSelling, null, 2),
//   );
//   const activeTopBrands =
//     homeData?.banners?.filter(
//       (b: any) => b.placementKey === 'app_top_brands',
//     ) || [];

//   const gShockMainBanner = homeData?.banners?.find(
//     (b: any) => b.placementKey === 'app_home_bottom_showcase_banner_image',
//   );
//   const activeGShockItems =
//     homeData?.banners?.filter(
//       (b: any) => b.placementKey === 'app_home_bottom_showcase_product_image',
//     ) || [];

//   const activeSuperSaleBanners =
//     homeData?.banners?.filter(
//       (b: any) => b.placementKey === 'app_home_mid_banner',
//     ) || [];
//   console.log(
//     'activeSuperSaleBanners---->',
//     JSON.stringify(activeSuperSaleBanners, null, 2),
//   );
//   const activeFlashSaleBanner = homeData?.banners?.find(
//     (b: any) => b.placementKey === 'app_flahs_sale',
//   );

//   // === DEBUG: Find any unhandled banner groups ===
//   const handledPlacementKeys = [
//     'app_home_top_banner',
//     'app_home_cat_top_sidebyside_four',
//     'app_top_brands',
//     'app_home_bottom_showcase_banner_image',
//     'app_home_bottom_showcase_product_image',
//     'app_home_mid_banner',
//     'app_flahs_sale',
//   ];
//   const unhandledBannerGroups: Record<string, any[]> = {};
//   (homeData?.banners || []).forEach((b: any) => {
//     if (b.placementKey && !handledPlacementKeys.includes(b.placementKey)) {
//       if (!unhandledBannerGroups[b.placementKey])
//         unhandledBannerGroups[b.placementKey] = [];
//       unhandledBannerGroups[b.placementKey].push(b);
//     }
//   });
//   if (Object.keys(unhandledBannerGroups).length > 0) {
//     console.warn(
//       '⚠️ [HOME] UNHANDLED banner sections:',
//       Object.keys(unhandledBannerGroups),
//     );
//   }
//   if (homeData) {
//     console.log('📋 [HOME] All homeData keys:', Object.keys(homeData));
//     console.log('📋 [HOME] All placementKeys:', [
//       ...new Set((homeData.banners || []).map((b: any) => b.placementKey)),
//     ]);
//   }
//   console.log(
//     'firstProductBlock raw ----->',
//     homeData?.firstProductBlock || homeData?.firstproductblock,
//   );
//   console.log(
//     'secondProductBlock raw ----->',
//     homeData?.secondProductBlock || homeData?.secondproductblock,
//   );

//   // Best Selling Carousel
//   const [bestSellingIndex, setBestSellingIndex] = useState(0);
//   const bestSellingIndexRef = useRef(0); // avoid stale closure in PanResponder
//   const swipeAnim = useRef(new Animated.Value(0)).current; // tracks drag delta
//   const centerScale = useRef(new Animated.Value(1)).current; // center item scale
//   const centerTranslateX = useRef(new Animated.Value(0)).current; // center item slide

//   // direction: 1 = going forward (next), -1 = going backward (prev)
//   const goToIndex = (nextIdx: number, direction: 1 | -1 = 1) => {
//     const slideOut = direction * -width * 0.7; // exit direction  (next→leave left, prev→leave right)
//     const slideIn = direction * width * 0.7; // entry start pos (next→enter from right, prev→enter from left)

//     // 1️⃣ Slide current item OUT (shrink + translate)
//     Animated.parallel([
//       Animated.timing(centerTranslateX, {
//         toValue: slideOut,
//         duration: 220,
//         useNativeDriver: true,
//       }),
//       Animated.timing(centerScale, {
//         toValue: 0.78,
//         duration: 220,
//         useNativeDriver: true,
//       }),
//     ]).start(() => {
//       // 2️⃣ Snap new item to entry side, invisible size, then flip state
//       centerTranslateX.setValue(slideIn);
//       centerScale.setValue(0.78);
//       bestSellingIndexRef.current = nextIdx;
//       setBestSellingIndex(nextIdx);

//       // 3️⃣ Spring new item INTO center
//       Animated.parallel([
//         Animated.spring(centerTranslateX, {
//           toValue: 0,
//           useNativeDriver: true,
//           friction: 7,
//           tension: 80,
//         }),
//         Animated.spring(centerScale, {
//           toValue: 1,
//           useNativeDriver: true,
//           friction: 7,
//           tension: 80,
//         }),
//       ]).start();
//     });
//   };
//   //getHomepageData

//   useEffect(() => {
//     const initializeLocationAndSettings = async () => {
//       try {
//         const storedPincodeAreaId = await AsyncStorage.getItem('pincodeAreaId');
//         const parsedPincodeAreaId = storedPincodeAreaId
//           ? parseInt(storedPincodeAreaId)
//           : null;
//         setPincodeAreaId(parsedPincodeAreaId);
//         fetchHomeData(parsedPincodeAreaId);
//       } catch (error) {
//         console.error('Error in initializeLocationAndSettings:', error);
//         fetchHomeData(pincodeAreaId);
//       }
//     };

//     initializeLocationAndSettings();
//   }, []);

//   const onRefresh = React.useCallback(() => {
//     setRefreshing(true);
//     fetchHomeData().finally(() => setRefreshing(false));
//   }, [pincodeAreaId]);

//   useFocusEffect(
//     React.useCallback(() => {
//       const refreshData = async () => {
//         const storedPincodeAreaId = await AsyncStorage.getItem('pincodeAreaId');
//         const parsedPincodeAreaId = storedPincodeAreaId
//           ? parseInt(storedPincodeAreaId)
//           : null;
//         setPincodeAreaId(parsedPincodeAreaId);
//         fetchHomeData(parsedPincodeAreaId);
//       };
//       refreshData();
//     }, []),
//   );

//   const fetchHomeData = async (
//     currentPincodeAreaId: number | null = pincodeAreaId,
//   ) => {
//     const isInitial = !homeData;
//     try {
//       console.log(
//         'fetchHomeData called. isInitial:',
//         isInitial,
//         'pincodeAreaId:',
//         currentPincodeAreaId,
//       );
//       setLoading(true);
//       if (isInitial) {
//         console.log('Showing global loader for initial Home fetch');
//         showLoader(true);
//       }

//       const response = await getHomepageData(currentPincodeAreaId, blockSize);
//       console.log('getHomepageData response success:', response?.success);
//       if (response && response.success && response.data) {
//         setHomeData(response.data);
//         const bestSelling = response.data.showcaseSlider || [];
//         if (bestSelling.length > 2) {
//           setBestSellingIndex(1);
//           bestSellingIndexRef.current = 1;
//         } else if (bestSelling.length > 0) {
//           setBestSellingIndex(0);
//           bestSellingIndexRef.current = 0;
//         } else {
//           setBestSellingIndex(0);
//           bestSellingIndexRef.current = 0;
//         }
//       } else {
//         setHomeData(null);
//         setBestSellingIndex(0);
//         bestSellingIndexRef.current = 0;
//       }
//     } catch (error) {
//       console.error('Error fetching fetchHomeData:', error);
//       setHomeData(null);
//     } finally {
//       setLoading(false);
//       if (isInitial) showLoader(false);
//     }
//   };

//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => false,
//       onMoveShouldSetPanResponder: (_, g) =>
//         Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy),
//       onPanResponderMove: (_, g) => {
//         swipeAnim.setValue(g.dx);
//         const t = Math.abs(g.dx) / 120;
//         centerScale.setValue(Math.max(0.88, 1 - t * 0.12));
//       },
//       onPanResponderRelease: (_, g) => {
//         const cur = bestSellingIndexRef.current;
//         if (g.dx < -50 && cur < activeBestSelling.length - 1) {
//           goToIndex(cur + 1, 1);
//         } else if (g.dx > 50 && cur > 0) {
//           goToIndex(cur - 1, -1);
//         } else {
//           Animated.parallel([
//             Animated.spring(swipeAnim, { toValue: 0, useNativeDriver: true }),
//             Animated.spring(centerScale, { toValue: 1, useNativeDriver: true }),
//           ]).start();
//         }
//       },
//     }),
//   ).current;

//   useEffect(() => {
//     if (activeSliderImages.length <= 1) return;

//     const slideInterval = setInterval(() => {
//       setCurrentSlideIndex(prev => {
//         const nextIndex = prev + 1 >= activeSliderImages.length ? 0 : prev + 1;
//         slideRef.current?.scrollToIndex({ index: nextIndex, animated: true });
//         return nextIndex;
//       });
//     }, 4000);
//     return () => clearInterval(slideInterval);
//   }, [activeSliderImages.length]);

//   const handleBannerPress = (item: any) => {
//     const type = item.targetType || item.linkType;
//     const value = item.targetId || item.linkValue;

//     if (type && value) {
//       if (type.toLowerCase() === 'product') {
//         navigation.navigate('ProductDetailsScreen', { productId: value });
//       } else if (type.toLowerCase() === 'category') {
//         navigation.navigate('ProductCategoryDetail', {
//           catId: value.toString(),
//           title: 'Category',
//         });
//       }
//     } else if (item.productId) {
//       navigation.navigate('ProductDetailsScreen', {
//         productId: item.productId,
//         product: item,
//       });
//     }
//   };

//   const renderSliderItem = ({ item }: { item: any }) => (
//     <TouchableOpacity
//       activeOpacity={0.9}
//       onPress={() => handleBannerPress(item)}
//     >
//       <Image
//         source={
//           item.imageUrl
//             ? { uri: CONFIG.image_base_url + item.imageUrl }
//             : item.image
//         }
//         style={styles.headerSectionImageBackground}
//         resizeMode="cover"
//       />
//     </TouchableOpacity>
//   );

//   const renderGoatDeal = ({ item }: { item: any }) => (
//     <TouchableOpacity
//       style={styles.goatDealCard}
//       onPress={() => handleBannerPress(item)}
//     >
//       <Image
//         source={{ uri: CONFIG.image_base_url + item.imageUrl }}
//         style={styles.goatDealBg}
//         resizeMode="cover"
//       />
//     </TouchableOpacity>
//   );

//   const renderBrandItem = ({ item }: { item: any }) => (
//     <TouchableOpacity
//       style={[styles.brandItemCard, { backgroundColor: 'transparent' }]}
//       onPress={() => handleBannerPress(item)}
//     >
//       <Image
//         source={item.logo || { uri: CONFIG.image_base_url + item.imageUrl }}
//         style={[styles.brandLogo, { zIndex: 2 }]}
//         resizeMode="contain"
//       />
//       <FallbackImage
//         source={
//           item.imageUrl
//             ? { uri: CONFIG.image_base_url + item.imageUrl }
//             : item.image
//         }
//         style={localStyle.brandProductImage}
//         resizeMode="contain"
//       />
//     </TouchableOpacity>
//   );

//   const renderGShockCard = ({ item }: { item: any }) => {
//     return (
//       <TouchableOpacity
//         style={[
//           styles.gShockSmallCard,
//           { backgroundColor: 'transparent', borderRadius: 20 },
//         ]}
//         onPress={() => handleBannerPress(item)}
//       >
//         <Image
//           source={
//             item.imageUrl
//               ? { uri: CONFIG.image_base_url + item.imageUrl }
//               : item.image
//           }
//           style={styles.gShockSmallImage}
//           resizeMode="cover"
//         />
//       </TouchableOpacity>
//     );
//   };

//   const renderFlashSaleItem = ({ item }: { item: any }) => (
//     <TouchableOpacity
//       style={styles.flashSaleItemCard}
//       onPress={() => handleBannerPress(item)}
//     >
//       <Image
//         source={item.image || { uri: CONFIG.image_base_url + item.imageUrl }}
//         style={styles.flashSaleImage}
//       />
//     </TouchableOpacity>
//   );

//   const showCaseSliderFunc = () => {
//     if (!activeBestSelling || activeBestSelling.length === 0) return null;

//     return (
//       <View style={styles.sectionContainer}>
//         <Text style={[styles.sectionTitle, localStyle.sectionTitleAlignment]}>
//           IN THE SPOTLIGHT
//         </Text>

//         {/* Single card — prev/next images peek inside at 50% opacity */}
//         <View style={localStyle.bestSellingCard} {...panResponder.panHandlers}>
//           {/* Prev item — left side, 50% opacity */}
//           {bestSellingIndex > 0 && (
//             <Image
//               source={
//                 activeBestSelling[bestSellingIndex - 1].imageUrl ||
//                 activeBestSelling[bestSellingIndex - 1].image
//                   ? {
//                       uri:
//                         CONFIG.image_base_url +
//                         (activeBestSelling[bestSellingIndex - 1].imageUrl ||
//                           activeBestSelling[bestSellingIndex - 1].image),
//                     }
//                   : activeBestSelling[bestSellingIndex - 1].image
//               }
//               style={[localStyle.sideImage, localStyle.sideImageLeft]}
//               resizeMode="contain"
//             />
//           )}

//           {/* Next item — right side, 50% opacity */}
//           {bestSellingIndex < activeBestSelling?.length - 1 && (
//             <Image
//               source={
//                 activeBestSelling[bestSellingIndex + 1].imageUrl ||
//                 activeBestSelling[bestSellingIndex + 1].image
//                   ? {
//                       uri:
//                         CONFIG.image_base_url +
//                         (activeBestSelling[bestSellingIndex + 1].imageUrl ||
//                           activeBestSelling[bestSellingIndex + 1].image),
//                     }
//                   : activeBestSelling[bestSellingIndex + 1].image
//               }
//               style={[localStyle.sideImage, localStyle.sideImageRight]}
//               resizeMode="contain"
//             />
//           )}

//           {/* Center (active) image with slide + scale animation */}
//           <Animated.View
//             style={[
//               localStyle.centerImage,
//               {
//                 transform: [
//                   { translateX: centerTranslateX },
//                   { scale: centerScale },
//                 ],
//               },
//             ]}
//           >
//             <TouchableOpacity
//               activeOpacity={0.9}
//               style={{ width: '100%', height: '100%' }}
//               onPress={() =>
//                 navigation.navigate('ProductDetailsScreen', {
//                   productId: activeBestSelling[bestSellingIndex]?.productId,
//                   product: activeBestSelling[bestSellingIndex],
//                 })
//               }
//             >
//               <Image
//                 source={
//                   activeBestSelling[bestSellingIndex]?.imageUrl ||
//                   activeBestSelling[bestSellingIndex]?.image
//                     ? {
//                         uri:
//                           CONFIG.image_base_url +
//                           (activeBestSelling[bestSellingIndex]?.imageUrl ||
//                             activeBestSelling[bestSellingIndex]?.image),
//                       }
//                     : activeBestSelling[bestSellingIndex]?.image
//                 }
//                 style={{ width: '100%', height: '100%' }}
//                 resizeMode="contain"
//               />
//             </TouchableOpacity>
//           </Animated.View>

//           {/* Left Arrow */}
//           {bestSellingIndex > 0 && (
//             <TouchableOpacity
//               style={[styles.carouselArrowLeft, localStyle.arrowOverlay]}
//               onPress={() => goToIndex(bestSellingIndex - 1, -1)}
//             >
//               <AppIcons.RightArrow
//                 color={colors.outlineTeal}
//                 size={20}
//                 style={{ transform: [{ scaleX: -1 }] }}
//               />
//             </TouchableOpacity>
//           )}

//           {/* Right Arrow */}
//           {bestSellingIndex < activeBestSelling.length - 1 && (
//             <TouchableOpacity
//               style={[styles.carouselArrowRight, localStyle.arrowOverlay]}
//               onPress={() => goToIndex(bestSellingIndex + 1, 1)}
//             >
//               <AppIcons.RightArrow color={colors.outlineTeal} size={20} />
//             </TouchableOpacity>
//           )}

//           {/* Wishlist Overlay */}
//           <TouchableOpacity
//             style={[localStyle.wishlistOverlay]}
//             onPress={() => toggleWishlist(activeBestSelling[bestSellingIndex])}
//           >
//             {isInWishlist(
//               activeBestSelling[bestSellingIndex]?.productId ||
//                 activeBestSelling[bestSellingIndex]?.id,
//             ) ? (
//               <AppIcons.BookmarkFilled color={colors.white} size={26} />
//             ) : (
//               <AppIcons.BookmarkOutline color={colors.white} size={26} />
//             )}
//           </TouchableOpacity>

//           {/* Text row at the bottom */}
//           <View style={[styles.bestSellingTextRow, { zIndex: 3, bottom: 20 }]}>
//             <Text style={styles.bestSellingTitle}>
//               {activeBestSelling[bestSellingIndex].brand ||
//                 activeBestSelling[bestSellingIndex].prName}
//             </Text>
//             <View style={{ alignItems: 'flex-end' }}>
//               <Text style={styles.bestSellingOriginalPrice}>
//                 ₹
//                 {activeBestSelling[bestSellingIndex].unitPrice ||
//                   activeBestSelling[bestSellingIndex].originalPrice}
//               </Text>
//               <Text style={styles.bestSellingCurrentPrice}>
//                 ₹
//                 {activeBestSelling[bestSellingIndex].specialPrice ||
//                   activeBestSelling[bestSellingIndex].price}
//               </Text>
//             </View>
//           </View>
//         </View>

//         <View style={{ marginTop: 16 }}>
//           <ClickForMoreButton
//             onPress={() => {
//               navigation.navigate('ProductCategoryDetail', {
//                 title: 'Category',
//                 products: activeBestSelling,
//               });
//             }}
//             title="Click for more offers"
//           />
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         contentContainerStyle={{
//           paddingBottom: 80,
//           backgroundColor: colors.homeScreenBackground,
//         }}
//       >
//         {/* Header Section from Screenshot 1 & 5 */}
//         <View style={styles.headerSectionWrapper}>
//           <FlatList
//             ref={slideRef}
//             data={activeSliderImages}
//             renderItem={renderSliderItem}
//             keyExtractor={(item, index) =>
//               item.bannerId?.toString() ||
//               item.id?.toString() ||
//               index.toString()
//             }
//             horizontal
//             pagingEnabled
//             showsHorizontalScrollIndicator={false}
//             scrollEnabled={false}
//           />
//           <View style={[StyleSheet.absoluteFillObject, { paddingTop: 50 }]}>
//             <View style={styles.topBar}>
//               <TouchableOpacity
//                 style={styles.profileArea}
//                 onPress={() => navigation.navigate('KebraScreen')}
//               >
//                 <View style={styles.profileImageReal}>
//                   <AppIcons.User size={20} color={colors.themeTeal} />
//                 </View>
//                 <Text style={styles.userName}>
//                   {profile?.custName
//                     ? profile.custName.length > 15
//                       ? `${profile.custName.substring(0, 15)}...`
//                       : profile.custName
//                     : 'Guest User'}
//                 </Text>
//               </TouchableOpacity>

//               <View style={styles.actionsPill}>
//                 <TouchableOpacity
//                   style={styles.actionIcon}
//                   onPress={() => navigation.navigate('Cart')}
//                 >
//                   <AppIcons.Bag color={colors.black} size={20} />
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.actionIcon}>
//                   {/* <View style={styles.notificationDot} /> */}
//                   <AppIcons.Bell color={colors.black} size={20} />
//                 </TouchableOpacity>
//               </View>
//             </View>

//             <View style={{ paddingHorizontal: 16 }}>
//               <HomeSearchBar placeholder="Search product" />
//             </View>

//             <View style={styles.headerDotsContainer}>
//               {activeSliderImages.map((_: any, index: number) => (
//                 <View
//                   key={index}
//                   style={[
//                     styles.headerDot,
//                     currentSlideIndex === index && {
//                       backgroundColor: colors.outlineTeal,
//                     },
//                   ]}
//                 />
//               ))}
//             </View>
//           </View>
//         </View>

//         {/* GOAT DEALS */}
//         <View style={styles.sectionContainer}>
//           <Text style={[styles.sectionTitle, localStyle.sectionTitleAlignment]}>
//             GOAT DEALS
//           </Text>
//           <View style={styles.horizontalScrollPadding}>
//             <FlatList
//               data={activeGoatDeals}
//               renderItem={renderGoatDeal}
//               keyExtractor={(item, index) =>
//                 item.bannerId?.toString() ||
//                 item.id?.toString() ||
//                 index.toString()
//               }
//               numColumns={2}
//               columnWrapperStyle={{ justifyContent: 'space-between' }}
//               scrollEnabled={false}
//             />
//           </View>
//         </View>

//         {/* EXPLORE */}
//         {activeFirstProducts.length > 0 && (
//           <View style={styles.sectionContainer}>
//             <Text
//               style={[styles.sectionTitle, localStyle.sectionTitleAlignment]}
//             >
//               {parsedFirstBlock?.title || parsedFirstBlock?.Title}
//             </Text>
//             <FlatList
//               data={activeFirstProducts}
//               renderItem={({ item }) => (
//                 <ExploreItem
//                   item={item}
//                   onPress={handleBannerPress}
//                   toggleWishlist={toggleWishlist}
//                   isInWishlist={id => isInWishlist(id)}
//                 />
//               )}
//               keyExtractor={(item, index) =>
//                 item.productId?.toString() ||
//                 item.id?.toString() ||
//                 index.toString()
//               }
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={styles.horizontalScrollPadding}
//             />
//             <View style={{ marginTop: 16 }}>
//               <ClickForMoreButton
//                 onPress={() => {
//                   const id =
//                     parsedFirstBlock?.catId ||
//                     parsedFirstBlock?.CatId ||
//                     parsedFirstBlock?.id ||
//                     parsedFirstBlock?.Id ||
//                     parsedFirstBlock?.categoryId ||
//                     parsedFirstBlock?.CategoryId;
//                   navigation.navigate('ProductCategoryDetail', {
//                     catId: id?.toString(),
//                     title:
//                       parsedFirstBlock?.title ||
//                       parsedFirstBlock?.Title ||
//                       'Category',
//                     products: activeFirstProducts,
//                   });
//                 }}
//                 title="Click for more"
//               />
//             </View>
//           </View>
//         )}

//         {/* BEST SELLING */}
//         {showCaseSliderFunc()}

//         {/* TOP BRANDS */}
//         <View style={styles.sectionContainer}>
//           <Text style={[styles.sectionTitle, localStyle.sectionTitleAlignment]}>
//             TOP BRANDS
//           </Text>
//           <FlatList
//             data={activeTopBrands}
//             renderItem={renderBrandItem}
//             keyExtractor={(item, index) =>
//               item.bannerId?.toString() ||
//               item.id?.toString() ||
//               index.toString()
//             }
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.horizontalScrollPadding}
//           />
//         </View>

//         {/* G-SHOCK Black Section */}
//         {activeGShockItems?.length > 0 && gShockMainBanner && (
//           <View style={styles.gShockSectionWrapper}>
//             <ImageBackground
//               source={{
//                 uri: CONFIG.image_base_url + gShockMainBanner.imageUrl,
//               }}
//               style={styles.gShockTopBanner}
//               resizeMode="cover"
//             >
//               <View
//                 style={{
//                   paddingHorizontal: 16,
//                   position: 'absolute',
//                   bottom: 20,
//                   left: 0,
//                   right: 0,
//                 }}
//               >
//                 <FlatList
//                   data={activeGShockItems}
//                   renderItem={renderGShockCard}
//                   keyExtractor={(item, index) =>
//                     item.bannerId?.toString() ||
//                     item.id?.toString() ||
//                     index.toString()
//                   }
//                   numColumns={2}
//                   columnWrapperStyle={{ justifyContent: 'space-between' }}
//                   scrollEnabled={false}
//                 />
//               </View>
//             </ImageBackground>
//           </View>
//         )}

//         {/* 11.11 SUPER SALE Banner */}
//         {activeSuperSaleBanners?.length > 0 && (
//           <View style={{ marginVertical: 10, alignItems: 'center' }}>
//             <FlatList
//               ref={superSaleRef}
//               data={activeSuperSaleBanners}
//               keyExtractor={(item, index) =>
//                 item.bannerId?.toString() ||
//                 item.id?.toString() ||
//                 index.toString()
//               }
//               horizontal
//               snapToInterval={width - 12}
//               decelerationRate="fast"
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={{ paddingHorizontal: 6 }}
//               onMomentumScrollEnd={e => {
//                 const idx = Math.round(
//                   e.nativeEvent.contentOffset.x / (width - 12),
//                 );
//                 setSuperSaleIndex(
//                   Math.max(0, Math.min(idx, activeSuperSaleBanners.length - 1)),
//                 );
//               }}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   activeOpacity={0.9}
//                   onPress={() => {
//                     const id =
//                       item.linkValue ||
//                       item.targetId ||
//                       item.catId ||
//                       item.bannerId ||
//                       item.id;
//                     navigation.navigate('ProductCategoryDetail', {
//                       catId: id?.toString(),
//                       title: item.title || 'Category',
//                     });
//                   }}
//                 >
//                   <FallbackImage
//                     source={
//                       item.imageUrl
//                         ? { uri: CONFIG.image_base_url + item.imageUrl }
//                         : require('../../assets/images/logos/noimage.png')
//                     }
//                     style={styles.superSaleBannerImage}
//                     resizeMode="cover"
//                   />
//                 </TouchableOpacity>
//               )}
//             />
//             {/* Dots */}
//             <View style={styles.superSaleDotsContainer}>
//               {activeSuperSaleBanners.map((_: any, index: number) => (
//                 <View
//                   key={index}
//                   style={[
//                     styles.superSalePill,
//                     superSaleIndex === index && {
//                       backgroundColor: colors.outlineTeal,
//                     },
//                   ]}
//                 />
//               ))}
//             </View>
//           </View>
//         )}

//         {/* FLASH SALE */}
//         {activeFlashSaleBanner && (
//           <View style={styles.flashSaleContainer}>
//             {/* <Text style={styles.hugeFlashText}>FLASH</Text> */}
//             <TouchableOpacity
//               activeOpacity={0.9}
//               onPress={() => handleBannerPress(activeFlashSaleBanner)}
//             >
//               <Image
//                 source={{
//                   uri: CONFIG.image_base_url + activeFlashSaleBanner.imageUrl,
//                 }}
//                 style={styles.podiumImageBackground}
//                 resizeMode="cover"
//               />
//             </TouchableOpacity>

//             {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, marginTop: -90 }}>
//               {flashSaleItems.map((item, index) => (
//                 <React.Fragment key={item.id}>
//                   {renderFlashSaleItem({ item })}
//                 </React.Fragment>
//               ))}
//             </ScrollView> */}
//             <View style={{ marginTop: -60, position: 'relative' }}>
//               <ClickForMoreButton
//                 onPress={() => {
//                   const id =
//                     activeFlashSaleBanner?.targetId ||
//                     activeFlashSaleBanner?.linkValue ||
//                     activeFlashSaleBanner?.id ||
//                     activeFlashSaleBanner?.catId;
//                   if (id) {
//                     navigation.navigate('ProductCategoryDetail', {
//                       catId: id.toString(),
//                       title: 'Category',
//                     });
//                   }
//                 }}
//                 title="View all Flash Deals"
//               />
//             </View>
//           </View>
//         )}

//         {/* EXPLORE */}
//         {activeSecondProducts.length > 0 && (
//           <View style={styles.sectionContainer}>
//             <Text
//               style={[styles.sectionTitle, localStyle.sectionTitleAlignment]}
//             >
//               {parsedSecondBlock?.title || parsedSecondBlock?.Title}
//             </Text>
//             <FlatList
//               data={activeSecondProducts}
//               renderItem={({ item }) => (
//                 <ExploreItem
//                   item={item}
//                   onPress={handleBannerPress}
//                   toggleWishlist={toggleWishlist}
//                   isInWishlist={id => isInWishlist(id)}
//                 />
//               )}
//               keyExtractor={(item, index) =>
//                 item.productId?.toString() ||
//                 item.id?.toString() ||
//                 index.toString()
//               }
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={styles.horizontalScrollPadding}
//             />
//             <View style={{ marginTop: 16 }}>
//               <ClickForMoreButton
//                 onPress={() => {
//                   const id =
//                     parsedSecondBlock?.catId ||
//                     parsedSecondBlock?.CatId ||
//                     parsedSecondBlock?.id ||
//                     parsedSecondBlock?.Id ||
//                     parsedSecondBlock?.categoryId ||
//                     parsedSecondBlock?.CategoryId;
//                   navigation.navigate('ProductCategoryDetail', {
//                     catId: id?.toString(),
//                     title:
//                       parsedSecondBlock?.title ||
//                       parsedSecondBlock?.Title ||
//                       'Category',
//                     products: activeSecondProducts,
//                   });
//                 }}
//                 title="Click for more"
//               />
//             </View>
//           </View>
//         )}
//       </ScrollView>
//       <FloatingCartButton />
//     </View>
//   );
// };

// export default HomeScreen;

// const localStyle = StyleSheet.create({
//   sectionTitleAlignment: {
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   bestSellingCard: {
//     marginHorizontal: 16,
//     backgroundColor: '#8ED2C9',
//     borderRadius: 24,
//     height: 390,
//     justifyContent: 'flex-end',
//     padding: 16,
//     overflow: 'hidden',
//     position: 'relative',
//   },
//   // Center (active) image — large, in the middle
//   centerImage: {
//     position: 'absolute',
//     alignSelf: 'center',
//     width: '65%',
//     height: '75%',
//     top: 20,
//     zIndex: 2,
//   },
//   // Adjacent item images peeking from left/right at 50% opacity
//   sideImage: {
//     position: 'absolute',
//     width: '42%',
//     height: '62%',
//     top: 46,
//     opacity: 0.5,
//     zIndex: 1,
//   },
//   sideImageLeft: {
//     left: -30,
//   },
//   sideImageRight: {
//     right: -30,
//   },
//   arrowOverlay: {
//     position: 'absolute',
//     top: '42%',
//     zIndex: 4,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.15,
//     shadowRadius: 4,
//   },
//   brandGradient: {
//     flex: 1,
//     width: '100%',
//     alignItems: 'center',
//     paddingTop: 14,
//     overflow: 'hidden',
//     position: 'relative',
//     borderRadius: 20,
//   },
//   // Watermark background: pinned to top, 70% height, full width
//   brandImageArea: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     width: '100%',
//     height: '70%',
//   },
//   // Product image: pinned to bottom, 70% height
//   brandProductImage: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     width: '100%',
//     height: '80%',
//     zIndex: 1,
//   },
//   brandGradientLogo: {
//     marginBottom: 6,
//   },
//   superSaleCard: {
//     width: width - 20,
//     height: 200,
//     marginHorizontal: 10,
//     borderRadius: 20,
//     padding: 20,
//     justifyContent: 'flex-end',
//   },
//   superSaleBadge: {
//     alignSelf: 'flex-start',
//     backgroundColor: 'rgba(255,255,255,0.3)',
//     borderRadius: 20,
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     marginBottom: 10,
//   },
//   superSaleBadgeText: {
//     color: '#fff',
//     fontSize: 12,
//     fontFamily: 'Gilroy-Bold',
//     fontWeight: '700',
//   },
//   superSaleTitle: {
//     color: '#fff',
//     fontSize: 28,
//     fontFamily: 'Gilroy-ExtraBold',
//     fontWeight: '800',
//     letterSpacing: 1,
//   },
//   superSaleSubtitle: {
//     color: 'rgba(255,255,255,0.85)',
//     fontSize: 13,
//     fontFamily: 'Gilroy-Medium',
//     marginTop: 4,
//   },
//   wishlistOverlay: {
//     position: 'absolute',
//     top: 20,
//     right: 20,
//     zIndex: 5,
//     backgroundColor: 'rgba(0,0,0,0.2)',
//     padding: 8,
//     borderRadius: 20,
//   },
// });

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  FlatList,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { CircleUserRound } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';
import { useWishlist } from '../../context/WishlistContext';
import { getHomepageData } from '../../api/services/homeService';
import { AppIcons } from '../../assets/icons';
import CONFIG from '../../globals/config';
import ProductCard from '../../components/ProductCard';
import ExploreItem from '../../components/ExploreItem/ExploreItem';
import ClickForMoreButton from '../../components/ClickForMoreButton/ClickForMoreButton';
import * as DummyData from './dummyData';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fonts } from '../../assets/theme/fonts';
import { colors } from '../../assets/theme/colours';
import HomeSearchBar from '../../components/HomeSearchBar/HomeSearchBar';
import FloatingCartButton from '../../components/FloatingCartButton/FloatingCartButton';

const { width, height } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { profile } = useUser();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [refreshing, setRefreshing] = useState(false);
  const [homeData, setHomeData] = useState<any>(null);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [midBannerIndex, setMidBannerIndex] = useState(0);
  const [bestSellingIndex, setBestSellingIndex] = useState(1);
  const [selectedAccessorize, setSelectedAccessorize] = useState<string | null>(
    null,
  );
  const bannerRef = useRef<FlatList>(null);

  const userName =
    profile?.custName || profile?.name || profile?.firstName || 'Guest';

  const fetchData = async () => {
    try {
      const storedPincodeAreaId = await AsyncStorage.getItem('pincodeAreaId');
      const areaId = storedPincodeAreaId
        ? parseInt(storedPincodeAreaId)
        : profile?.pincode || null;

      const data = await getHomepageData(areaId, 100);
      setHomeData(data?.data || data);
    } catch (e) {
      console.error('Error fetching home data for K-shope', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  const topBanner =
    (
      homeData?.banners?.filter(
        (b: any) =>
          b.placementKey === 'app_home_top_banner' ||
          b.PlacementKey === 'app_home_top_banner',
      ) || []
    ).length > 0
      ? homeData.banners.filter(
          (b: any) =>
            b.placementKey === 'app_home_top_banner' ||
            b.PlacementKey === 'app_home_top_banner',
        )
      : DummyData.sliderImages;

  const midBanner =
    (
      homeData?.banners?.filter(
        (b: any) =>
          b.placementKey === 'app_home_mid_banner' ||
          b.PlacementKey === 'app_home_mid_banner',
      ) || []
    ).length > 0
      ? homeData.banners.filter(
          (b: any) =>
            b.placementKey === 'app_home_mid_banner' ||
            b.PlacementKey === 'app_home_mid_banner',
        )
      : DummyData.superSaleBanners;

  const bottomBanner =
    homeData?.banners?.filter(
      (b: any) =>
        b.placementKey === 'app_home_bottom' ||
        b.PlacementKey === 'app_home_bottom',
    ) || [];

  const topBrands =
    homeData?.brands && homeData.brands.length > 0
      ? homeData.brands
      : homeData?.topBrands && homeData.topBrands.length > 0
      ? homeData.topBrands
      : (
          homeData?.banners?.filter(
            (b: any) =>
              b.placementKey === 'app_top_brands' ||
              b.PlacementKey === 'app_top_brands',
          ) || []
        ).length > 0
      ? homeData.banners.filter(
          (b: any) =>
            b.placementKey === 'app_top_brands' ||
            b.PlacementKey === 'app_top_brands',
        )
      : DummyData.topBrands;

  const gShockMainBanner = homeData?.banners?.find(
    (b: any) =>
      b.placementKey === 'app_home_bottom_showcase_banner_image' ||
      b.PlacementKey === 'app_home_bottom_showcase_banner_image',
  );
  const activeGShockItems =
    homeData?.banners?.filter(
      (b: any) =>
        b.placementKey === 'app_home_bottom_showcase_product_image' ||
        b.PlacementKey === 'app_home_bottom_showcase_product_image',
    ) || [];

  const bestSelling =
    (homeData?.showcaseSlider || []).length > 0
      ? homeData.showcaseSlider
      : DummyData.bestSellingItems;

  const categories =
    homeData?.featuredCategories || homeData?.FeaturedCategories || [];

  const unwrapBlock = (block: any): any => {
    if (!block) return null;
    let current = block;
    for (let i = 0; i < 3; i++) {
      if (
        typeof current === 'string' &&
        (current.trim().startsWith('{') || current.trim().startsWith('['))
      ) {
        try {
          current = JSON.parse(current);
        } catch (e) {
          break;
        }
      } else {
        break;
      }
    }
    if (current && typeof current === 'object') {
      if (current.firstProductBlock) current = current.firstProductBlock;
      else if (current.FirstProductBlock) current = current.FirstProductBlock;
      else if (current.secondProductBlock) current = current.secondProductBlock;
      else if (current.SecondProductBlock) current = current.SecondProductBlock;
      else if (current.data && !current.items && !current.Items)
        current = current.data;
      if (
        typeof current === 'string' &&
        (current.trim().startsWith('{') || current.trim().startsWith('['))
      ) {
        try {
          current = JSON.parse(current);
        } catch (e) {}
      }
    }
    return current;
  };

  const getItems = (block: any) => {
    if (!block) return [];
    if (Array.isArray(block)) return block;
    if (block.items && Array.isArray(block.items)) return block.items;
    if (block.Items && Array.isArray(block.Items)) return block.Items;
    if (block.data && Array.isArray(block.data)) return block.data;
    return [];
  };

  const parsedFirstBlock = unwrapBlock(
    homeData?.firstProductBlock || homeData?.firstproductblock,
  );
  const parsedSecondBlock = unwrapBlock(
    homeData?.secondProductBlock || homeData?.secondproductblock,
  );

  const activeGoatDeals =
    (
      homeData?.banners?.filter(
        (b: any) => b.placementKey === 'app_home_cat_top_sidebyside_four',
      ) || []
    ).length > 0
      ? homeData.banners.filter(
          (b: any) => b.placementKey === 'app_home_cat_top_sidebyside_four',
        )
      : DummyData.goatDeals;

  const activeFirstProducts = getItems(parsedFirstBlock).filter(
    (i: any) => i && (i.productId || i.id),
  );
  const activeSecondProducts = getItems(parsedSecondBlock).filter(
    (i: any) => i && (i.productId || i.id),
  );

  const getSectionTitle = (sectionKey: string, fallback: string) => {
    const titles = homeData?.titles || homeData?.Titles || [];
    const found = titles.find(
      (t: any) =>
        (t.section || t.id || t.key || '').toLowerCase() ===
        sectionKey.toLowerCase(),
    );
    return found?.title || found?.Title || fallback;
  };

  // Auto-scroll banners
  useEffect(() => {
    if (!topBanner || topBanner.length <= 1) return;
    const timer = setInterval(() => {
      setBannerIndex(prev => {
        const next = (prev + 1) % topBanner.length;
        bannerRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [topBanner]);

  const getImageSource = (imgPath: any) => {
    if (!imgPath) return require('../../assets/images/logo.png'); // fallback
    if (typeof imgPath === 'object' && imgPath.uri) return imgPath;
    if (typeof imgPath === 'string') {
      const trimmedPath = imgPath.trim();
      if (trimmedPath.startsWith('http')) return { uri: trimmedPath };
      const base = CONFIG.image_base_url.replace(/\/$/, '');
      const path = trimmedPath.startsWith('/')
        ? trimmedPath
        : `/${trimmedPath}`;
      return { uri: `${base}${path}` };
    }
    return imgPath;
  };

  const handleBannerPress = (banner: any) => {
    if (!banner) return;
    const linkType = (banner.linkType || banner.LinkType || '').toLowerCase();
    const linkValue = banner.linkValue || banner.LinkValue;
    if (linkType === 'product') {
      navigation.navigate('ProductDetailsScreen', { productId: linkValue });
    } else if (linkType === 'category') {
      navigation.navigate('SearchScreen', {
        catId: linkValue,
        catName: 'Category',
      });
    }
  };

  const handleCategoryPress = (cat: any) => {
    navigation.navigate('SearchScreen', {
      catId: cat.catId || cat.id,
      catName: cat.catName || cat.name,
    });
  };

  const displayCategories = categories.slice(0, 8);
  let rawTabShowcase =
    homeData?.categoryTabShowcase ||
    homeData?.CategoryTabShowcase ||
    homeData?.categorytabshowcase;

  if (!rawTabShowcase && homeData?.data) {
    rawTabShowcase =
      homeData.data.categoryTabShowcase ||
      homeData.data.CategoryTabShowcase ||
      homeData.data.categorytabshowcase;
  }

  let parsedTabShowcase = unwrapBlock(rawTabShowcase);

  if (parsedTabShowcase && !Array.isArray(parsedTabShowcase)) {
    parsedTabShowcase =
      parsedTabShowcase.categoryTabShowcase ||
      parsedTabShowcase.CategoryTabShowcase ||
      parsedTabShowcase.categorytabshowcase ||
      parsedTabShowcase.data ||
      parsedTabShowcase.items ||
      parsedTabShowcase.Items ||
      parsedTabShowcase;
    parsedTabShowcase = unwrapBlock(parsedTabShowcase); // Unwrap again in case of double-stringified payload
  }

  const accessorizeCategories = Array.isArray(parsedTabShowcase)
    ? parsedTabShowcase
    : [];

  useEffect(() => {
    if (accessorizeCategories.length > 0) {
      const exists = accessorizeCategories.some((t: any) => {
        const tId = t.tabId || t.TabId || t.catId || t.CatId || t.id || t.Id;
        return String(tId) === String(selectedAccessorize);
      });
      if (!exists || !selectedAccessorize) {
        const firstItem = accessorizeCategories[0];
        const firstId =
          firstItem.tabId ||
          firstItem.TabId ||
          firstItem.catId ||
          firstItem.CatId ||
          firstItem.id ||
          firstItem.Id;
        setSelectedAccessorize(firstId);
      }
    }
  }, [accessorizeCategories]);

  const renderBannerItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => handleBannerPress(item)}
      style={styles.bannerSlide}
    >
      <Image
        source={getImageSource(item.imageUrl || item.ImageUrl || item.image)}
        style={styles.bannerImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }: { item: any }) => {
    const imgSrc =
      item.image || item.imageUrl
        ? getImageSource(item.imageUrl || item.image)
        : require('../../assets/images/logo.png');
    return (
      <TouchableOpacity
        style={styles.categoryItem}
        onPress={() => handleCategoryPress(item)}
      >
        <LinearGradient
          colors={['#00A7B3', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.categoryCircle}
        >
          <Image
            source={imgSrc}
            style={styles.categoryImage}
            resizeMode="contain"
          />
        </LinearGradient>
        <Text style={styles.categoryLabel} numberOfLines={2}>
          {item.catName || item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderAccessorizeItem = ({ item }: { item: any }) => {
    const tabImage =
      item.tabImageUrl ||
      item.TabImageUrl ||
      item.imageUrl ||
      item.ImageUrl ||
      item.image ||
      item.Image;
    const imgSrc = tabImage
      ? getImageSource(tabImage)
      : require('../../assets/images/logo.png');

    const itemId =
      item.tabId ||
      item.TabId ||
      item.catId ||
      item.CatId ||
      item.id ||
      item.Id;
    const isSelected = String(selectedAccessorize) === String(itemId);
    const title =
      item.tabName ||
      item.TabName ||
      item.catName ||
      item.CatName ||
      item.name ||
      item.Name;

    return (
      <TouchableOpacity
        style={[
          styles.accessorizeCard,
          isSelected && styles.accessorizeCardActive,
        ]}
        onPress={() => setSelectedAccessorize(itemId)}
      >
        <View style={styles.accessorizeImageContainer}>
          <Image
            source={imgSrc}
            style={styles.accessorizeImage}
            resizeMode="cover"
          />
        </View>
        <Text
          style={[
            styles.accessorizeLabel,
            isSelected && { color: colors.themeWhite },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderMidBanner = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => handleBannerPress(item)}
      style={styles.midBannerCard}
    >
      <Image
        source={getImageSource(item.imageUrl || item.ImageUrl || item.image)}
        style={styles.midBannerImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderBrandItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.brandCard}
      onPress={() => {
        if (item.attrValueId !== undefined && item.attrValueId !== null) {
          navigation.navigate('SearchScreen', {
            attrValueId: item.attrValueId,
            catName: item.brandName || 'Brand',
          });
        } else {
          handleBannerPress(item);
        }
      }}
    >
      <Image
        source={getImageSource(
          item.brandImage ||
            item.imageUrl ||
            item.ImageUrl ||
            item.image ||
            item.logo,
        )}
        style={styles.brandImage}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  const renderGShockCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.gShockCard}
      onPress={() => handleBannerPress(item)}
    >
      <Image
        source={getImageSource(item.imageUrl || item.ImageUrl || item.image)}
        style={styles.gShockCardImage}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  const renderGoatDeal = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.goatDealCard}
      onPress={() => handleBannerPress(item)}
    >
      <Image
        source={getImageSource(item.imageUrl || item.ImageUrl || item.image)}
        style={styles.goatDealBg}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#00BCD4"
          />
        }
        contentContainerStyle={{ paddingBottom: hp('12%') }}
      >
        <View style={styles.headerSectionWrapper}>
          {topBanner && topBanner.length > 0 && (
            <FlatList
              ref={bannerRef}
              data={topBanner}
              renderItem={renderBannerItem}
              keyExtractor={(_, i) => i.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={e => {
                const idx = Math.round(e.nativeEvent.contentOffset.x / width);
                setBannerIndex(idx);
              }}
            />
          )}

          <View style={[StyleSheet.absoluteFillObject, { paddingTop: 15 }]}>
            <View style={styles.topBar}>
              <TouchableOpacity
                style={styles.profileArea}
                onPress={() => navigation.navigate('KebraScreen')}
              >
                <CircleUserRound size={24} color="#000" strokeWidth={1.5} />
                <Text style={styles.userName}>
                  {profile?.custName
                    ? profile.custName.length > 15
                      ? `${profile.custName.substring(0, 15)}...`
                      : profile.custName
                    : 'Guest User'}
                </Text>
              </TouchableOpacity>

              <View style={styles.topIconsRow}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => navigation.navigate('Cart')}
                >
                  <Image
                    source={require('../../assets/images/home/carthome.png')}
                    style={{ width: 20, height: 20 }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <Image
                    source={require('../../assets/images/logos/notify.png')}
                    style={{ width: 20, height: 20 }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ paddingHorizontal: 16 }}>
              <HomeSearchBar placeholder="Search Products" />
            </View>
          </View>

          {topBanner && topBanner.length > 1 && (
            <View style={styles.headerDotsContainer}>
              {topBanner.map((_: any, index: number) => (
                <View
                  key={index}
                  style={[
                    styles.headerDot,
                    bannerIndex === index && {
                      backgroundColor: colors.outlineTeal,
                    },
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* OUR CATEGORIES */}
        {displayCategories.length > 0 && (
          <View style={styles.section}>
            {/* <Text style={styles.sectionTitle}>
              {getSectionTitle('ourcategories', 'OUR CATEGORIES')}
            </Text> */}
            <FlatList
              data={displayCategories}
              renderItem={renderCategoryItem}
              keyExtractor={(item, i) => (item.catId || i).toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesGrid}
            />
          </View>
        )}

        {/* ACCESSORIZE */}
        {accessorizeCategories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {getSectionTitle('category_tabs_images', 'ACCESSORIZE')}
            </Text>
            <FlatList
              data={accessorizeCategories}
              renderItem={renderAccessorizeItem}
              keyExtractor={(item, i) => `acc_${item.catId || i}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: wp('4%') }}
            />
            {/* Dynamic accessorize banner below the list */}
            {(() => {
              const activeTab = accessorizeCategories.find((t: any) => {
                const tId =
                  t.tabId || t.TabId || t.catId || t.CatId || t.id || t.Id;
                return String(tId) === String(selectedAccessorize);
              });
              const activeTabItems = activeTab?.items || activeTab?.Items || [];
              if (activeTabItems.length === 0) return null;

              return (
                <LinearGradient
                  colors={['#00A7B3', '#FFFFFF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.dummyAccessorizeContainer}
                >
                  <FlatList
                    data={activeTabItems}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: wp('4%') }}
                    keyExtractor={(item, idx) => `tabItem_${item.catId || idx}`}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.accessorizeBannerCard}
                        onPress={() => {
                          navigation.navigate('SearchScreen', {
                            catId: item.catId || item.categoryId || item.id,
                            catName:
                              item.displayTitle || item.name || 'Category',
                          });
                        }}
                      >
                        <Image
                          source={getImageSource(
                            item.imageUrl ||
                              item.ImageUrl ||
                              item.image ||
                              item.Image,
                          )}
                          style={styles.dummyAccessorizeImage}
                          resizeMode="contain"
                        />
                        {/* <View style={styles.bannerTextOverlay}>
                          <Text style={styles.bannerTitleText}>
                            {item.displayTitle || item.catName || item.name}
                          </Text>
                        </View> */}
                      </TouchableOpacity>
                    )}
                  />
                </LinearGradient>
              );
            })()}
          </View>
        )}

        {/* TOP BRANDS */}
        {topBrands && topBrands.length > 0 && (
          <View style={[styles.section, { marginTop: -hp('1%') }]}>
            <Text style={styles.sectionTitle}>
              {getSectionTitle('top_brands', 'TOP BRANDS')}
            </Text>
            <FlatList
              data={topBrands}
              renderItem={renderBrandItem}
              keyExtractor={(_, i) => `brand_${i}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: wp('3%') }}
            />
          </View>
        )}

        {/* G-SHOCK SHOWCASE */}
        {activeGShockItems?.length > 0 && gShockMainBanner && (
          <View style={styles.section}>
            <ImageBackground
              source={{
                uri: CONFIG.image_base_url + gShockMainBanner.imageUrl,
              }}
              style={styles.gShockTopBanner}
              resizeMode="cover"
            >
              <View
                style={{
                  paddingHorizontal: 16,
                  position: 'absolute',
                  bottom: 40,
                  left: 0,
                  right: 0,
                }}
              >
                <FlatList
                  data={activeGShockItems}
                  renderItem={renderGShockCard}
                  keyExtractor={(item, index) =>
                    item.bannerId?.toString() ||
                    item.id?.toString() ||
                    index.toString()
                  }
                  numColumns={2}
                  columnWrapperStyle={{
                    justifyContent: 'space-between',
                  }}
                  scrollEnabled={false}
                />
              </View>
            </ImageBackground>
          </View>
        )}

        {/* BEST SELLING */}
        {bestSelling && bestSelling.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {getSectionTitle('image_slides', 'BEST SELLING')}
            </Text>
            <View style={styles.bestSellingCard}>
              {/* Side peeking images */}
              {bestSellingIndex > 0 && (
                <Image
                  source={getImageSource(
                    bestSelling[bestSellingIndex - 1].imageUrl ||
                      bestSelling[bestSellingIndex - 1].image,
                  )}
                  style={[styles.sideImage, styles.sideImageLeft]}
                  resizeMode="contain"
                />
              )}
              {bestSellingIndex < bestSelling.length - 1 && (
                <Image
                  source={getImageSource(
                    bestSelling[bestSellingIndex + 1].imageUrl ||
                      bestSelling[bestSellingIndex + 1].image,
                  )}
                  style={[styles.sideImage, styles.sideImageRight]}
                  resizeMode="contain"
                />
              )}

              {/* Main active image */}
              <TouchableOpacity
                style={styles.centerImageContainer}
                activeOpacity={0.8}
                onPress={() => {
                  const item = bestSelling[bestSellingIndex];
                  navigation.navigate('ProductDetailsScreen', {
                    productId: item.productId || item.id,
                    product: item,
                  });
                }}
              >
                <Image
                  source={getImageSource(
                    bestSelling[bestSellingIndex].imageUrl ||
                      bestSelling[bestSellingIndex].image,
                  )}
                  style={styles.centerImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {/* Navigation Arrows */}
              <View style={styles.arrowRow}>
                {bestSellingIndex > 0 ? (
                  <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={() => setBestSellingIndex(prev => prev - 1)}
                  >
                    <Ionicons name="chevron-back" size={24} color="#FFF" />
                  </TouchableOpacity>
                ) : (
                  <View style={{ width: wp('10%') }} />
                )}
                <View style={{ flex: 1 }} />
                {bestSellingIndex < bestSelling.length - 1 ? (
                  <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={() => setBestSellingIndex(prev => prev + 1)}
                  >
                    <Ionicons name="chevron-forward" size={24} color="#FFF" />
                  </TouchableOpacity>
                ) : (
                  <View style={{ width: wp('10%') }} />
                )}
              </View>

              {/* Top Text Info */}
              <View style={styles.bestSellingTextOverlay}>
                <Text style={styles.bestSellingTitleText}>
                  {bestSelling[bestSellingIndex].brand ||
                    bestSelling[bestSellingIndex].prName ||
                    'Product'}
                </Text>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.bestSellingPriceText}>
                    ₹
                    {bestSelling[bestSellingIndex].specialPrice ||
                      bestSelling[bestSellingIndex].price ||
                      '0'}
                  </Text>
                  <Text style={styles.bestSellingMrpText}>
                    MRP ₹
                    {bestSelling[bestSellingIndex].unitPrice ||
                      bestSelling[bestSellingIndex].originalPrice ||
                      '0'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Footer Button */}
            {/* <View style={{ marginTop: 16 }}>
              <ClickForMoreButton
                onPress={() => {
                  navigation.navigate('ProductCategoryDetail', {
                    title: 'Best Selling',
                    products: bestSelling,
                  });
                }}
                title="Click for more offers"
              />
            </View> */}
          </View>
        )}

        {/* FIRST PRODUCT BLOCK */}
        {activeFirstProducts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {parsedFirstBlock?.title ||
                parsedFirstBlock?.Title ||
                'Top Deals'}
            </Text>
            <FlatList
              data={activeFirstProducts}
              renderItem={({ item }) => (
                <ExploreItem
                  item={item}
                  onPress={() =>
                    navigation.navigate('ProductDetailsScreen', {
                      productId: item.productId,
                      product: item,
                    })
                  }
                  toggleWishlist={toggleWishlist}
                  isInWishlist={id => isInWishlist(id)}
                />
              )}
              keyExtractor={(item, i) => `first_${item.productId || i}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: wp('4%') }}
            />
            <View style={{ marginTop: 16 }}>
              <ClickForMoreButton
                onPress={() => {
                  const id =
                    parsedFirstBlock?.catId ||
                    parsedFirstBlock?.CatId ||
                    parsedFirstBlock?.id ||
                    parsedFirstBlock?.Id ||
                    parsedFirstBlock?.categoryId ||
                    parsedFirstBlock?.CategoryId;
                  navigation.navigate('ProductCategoryDetail', {
                    catId: id?.toString(),
                    title: parsedFirstBlock?.title || 'Top Deals',
                    products: activeFirstProducts,
                  });
                }}
                title={`Click for more ${parsedFirstBlock?.title || 'Deals'}`}
              />
            </View>
          </View>
        )}

        {/* MID BANNERS */}
        {midBanner && midBanner.length > 0 && (
          <View style={styles.section}>
            <FlatList
              data={midBanner}
              renderItem={renderMidBanner}
              keyExtractor={(_, i) => `mid_${i}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={wp('93%')}
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: wp('4%') }}
              onMomentumScrollEnd={e => {
                const index = Math.round(
                  e.nativeEvent.contentOffset.x / wp('93%'),
                );
                setMidBannerIndex(index);
              }}
            />
            <View style={styles.indicatorContainer}>
              {midBanner.map((_: any, index: number) => (
                <View
                  key={index}
                  style={[
                    styles.indicatorPill,
                    midBannerIndex === index && styles.indicatorPillActive,
                  ]}
                />
              ))}
            </View>
          </View>
        )}
        {/* GOAT DEALS */}
        {activeGoatDeals && activeGoatDeals.length > 0 && (
          <View style={[styles.section, { marginHorizontal: 16 }]}>
            <Text style={styles.sectionTitle}>
              {getSectionTitle('4_image_in_2_rows', 'GOAT DEALS')}
            </Text>
            <FlatList
              data={activeGoatDeals}
              renderItem={renderGoatDeal}
              keyExtractor={(item, index) =>
                item.bannerId?.toString() ||
                item.id?.toString() ||
                index.toString()
              }
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              scrollEnabled={false}
            />
          </View>
        )}
        {/* SECOND PRODUCT BLOCK */}
        {activeSecondProducts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {parsedSecondBlock?.title ||
                parsedSecondBlock?.Title ||
                'Featured Products'}
            </Text>
            <FlatList
              data={activeSecondProducts}
              renderItem={({ item }) => (
                <ExploreItem
                  item={item}
                  onPress={() =>
                    navigation.navigate('ProductDetailsScreen', {
                      productId: item.productId,
                      product: item,
                    })
                  }
                  toggleWishlist={toggleWishlist}
                  isInWishlist={id => isInWishlist(id)}
                />
              )}
              keyExtractor={(item, i) => `second_${item.productId || i}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: wp('4%') }}
            />
            <View style={{ marginTop: 16 }}>
              <ClickForMoreButton
                onPress={() => {
                  const id =
                    parsedSecondBlock?.catId ||
                    parsedSecondBlock?.CatId ||
                    parsedSecondBlock?.id ||
                    parsedSecondBlock?.Id ||
                    parsedSecondBlock?.categoryId ||
                    parsedSecondBlock?.CategoryId;
                  navigation.navigate('ProductCategoryDetail', {
                    catId: id?.toString(),
                    title: parsedSecondBlock?.title || 'Featured Products',
                    products: activeSecondProducts,
                  });
                }}
                title={`Click for more ${
                  parsedSecondBlock?.title || 'Featured'
                }`}
              />
            </View>
          </View>
        )}

        {/* BOTTOM BANNERS */}
        {bottomBanner && bottomBanner.length > 0 && (
          <View style={styles.section}>
            <FlatList
              data={bottomBanner}
              renderItem={renderMidBanner}
              keyExtractor={(_, i) => `bottom_${i}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={wp('48%')}
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: wp('4%') }}
            />
          </View>
        )}
        {/* FOOTER LOGO */}
        <View style={styles.footerLogoContainer}>
          <Image
            source={require('../../assets/images/logos/homelogo.png')}
            style={styles.footerLogo}
            resizeMode="contain"
          />
        </View>
      </ScrollView>
      <FloatingCartButton />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    paddingTop: hp('1%'),
  },
  headerSectionWrapper: {
    height: hp('35%'),
    width: width,
    position: 'relative',
  },
  headerDotsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  headerDot: {
    width: 32,
    height: 8,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 3,
    top: hp('1%'),
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: hp('0.5%'),
  },
  profileArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userName: {
    fontFamily: Fonts.gilroyMedium,
    fontSize: 17,
    color: '#222222',
    fontWeight: '400',
    marginLeft: wp('4%'),
  },
  topIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 20,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('4%'),
  },
  headerIcon: {
    padding: wp('1%'),
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: wp('6%'),
    paddingHorizontal: wp('4%'),
    height: hp('5.5%'),
    marginTop: hp('0.5%'),
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: wp('2%'),
    fontSize: wp('3.5%'),
    color: '#999999',
  },
  bannerContainer: {
    marginTop: hp('0.5%'),
    backgroundColor: colors.themeDarkTeal,
  },
  bannerSlide: {
    width: width,
    height: hp('35%'),
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('1%'),
    marginBottom: hp('0.5%'),
  },
  dot: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
    backgroundColor: '#CCCCCC',
    marginHorizontal: wp('0.8%'),
  },
  activeDot: {
    backgroundColor: '#00BCD4',
    width: wp('2.5%'),
    height: wp('2.5%'),
  },
  section: {
    marginTop: hp('2%'),
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    color: '#222222',
    textAlign: 'center',
    marginBottom: hp('1.5%'),
    letterSpacing: 1,
    fontWeight: '600',
  },
  categoriesGrid: {
    paddingHorizontal: wp('4%'),
  },
  categoryItem: {
    width: (width - wp('6%')) / 4,
    alignItems: 'center',
  },
  categoryCircle: {
    width: wp('18%'),
    height: wp('18%'),
    borderRadius: wp('6%'),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  categoryImage: {
    width: wp('11%'),
    height: wp('11%'),
  },
  categoryLabel: {
    fontSize: wp('3%'),
    color: colors.black1,
    fontFamily: Fonts.gilroyBold,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: hp('0.5%'),
    width: wp('18%'),
  },
  accessorizeCard: {
    width: wp('22%'),
    // borderRadius: wp('4%'),
    // backgroundColor: '#F8F8F8',

    paddingVertical: hp('1.5%'),
    marginRight: wp('2%'),
    alignItems: 'center',
    // marginRight: wp('1%'),
    paddingTop: hp('1%'),
    paddingBottom: hp('1.5%'),
    borderTopLeftRadius: wp('3%'),
    borderTopRightRadius: wp('3%'),
  },
  accessorizeCardActive: {
    backgroundColor: '#00A7B3',
    borderColor: '#00A7B3',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  accessorizeImageContainer: {
    width: wp('16%'),
    height: wp('16%'),
    borderWidth: 0.5,
    borderColor: '#EEE',
    borderRadius: wp('3%'),
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('0.5%'),
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  accessorizeImage: {
    width: '100%',
    height: '100%',
  },
  accessorizeLabel: {
    fontSize: wp('2.8%'),
    color: '#8A8A8A', // Grey for inactive
    fontFamily: Fonts.gilroyBold,
    fontWeight: '600',
    textAlign: 'center',
    // marginTop: hp('0.5%'),
    paddingBottom: hp('1%'),
  },
  dummyAccessorizeContainer: {
    // paddingTop: hp('2%'),
    // paddingBottom: hp('2%'),
    marginTop: -hp('0%'),
    zIndex: -1,
  },
  accessorizeBannerCard: {
    width: wp('42%'),
    height: hp('32%'),
    marginRight: wp('4%'),
    borderRadius: wp('5%'),
    overflow: 'hidden',
    // backgroundColor: '#FFF',
    // elevation: 3,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
  },
  dummyAccessorizeImage: {
    width: '100%',
    height: '100%',
  },
  bannerTextOverlay: {
    position: 'absolute',
    top: hp('2%'),
    left: wp('4%'),
    right: wp('4%'),
  },
  bannerTitleText: {
    fontSize: wp('5%'),
    fontFamily: Fonts.gilroyBold,
    color: '#000',
    fontWeight: '800',
  },
  midBannerCard: {
    width: wp('90%'),
    height: hp('20%'),
    borderRadius: wp('2%'),
    overflow: 'hidden',
    marginRight: wp('3%'),
  },
  midBannerImage: {
    width: '100%',
    height: '100%',
  },
  brandCard: {
    width: wp('26%'),
    height: hp('10%'),
    borderRadius: wp('4%'),
    backgroundColor: '#F4F1EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
    borderWidth: 1,
    borderColor: '#EEE',
    // elevation: 2,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
  },
  brandImage: {
    width: '80%',
    height: '70%',
  },
  gShockSectionWrapper: {
    width: '100%',
    backgroundColor: 'red',
    overflow: 'hidden',
  },
  gShockTopBanner: {
    width: width,
    height: hp('60%'),
    alignSelf: 'center',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  gShockCard: {
    width: (width - 32 - 16) / 2,
    height: 90,
    borderRadius: 20,
    overflow: 'hidden',
    //backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  gShockCardImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('1.5%'),
  },
  indicatorPill: {
    width: wp('6%'),
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: wp('1%'),
  },
  indicatorPillActive: {
    backgroundColor: '#00A7B3',
    width: wp('10%'),
  },
  bestSellingCard: {
    marginHorizontal: wp('4%'),
    backgroundColor: '#E0F7F9',
    borderRadius: wp('8%'),
    height: hp('38%'),
    overflow: 'hidden',
    position: 'relative',
    padding: wp('4%'),
    borderWidth: 1,
    borderColor: '#B2EBF2',
  },
  sideImage: {
    position: 'absolute',
    width: wp('40%'),
    height: hp('28%'),
    top: hp('6%'),
    opacity: 0.25,
  },
  sideImageLeft: {
    left: -wp('18%'),
  },
  sideImageRight: {
    right: -wp('18%'),
  },
  centerImageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  centerImage: {
    width: '75%',
    height: '75%',
  },
  arrowRow: {
    position: 'absolute',
    left: wp('4%'),
    right: wp('4%'),
    top: '55%',
    flexDirection: 'row',
    zIndex: 10,
  },
  arrowButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: '#00A7B3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  bestSellingTextOverlay: {
    position: 'absolute',
    top: wp('5%'),
    left: wp('6%'),
    right: wp('6%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  bestSellingTitleText: {
    fontSize: wp('6%'),
    fontFamily: Fonts.gilroyBold,
    color: '#263238',
    fontWeight: '800',
    maxWidth: '50%',
  },
  bestSellingPriceText: {
    fontSize: wp('6%'),
    fontFamily: Fonts.gilroyBold,
    color: '#263238',
    fontWeight: '800',
  },
  bestSellingMrpText: {
    fontSize: wp('3.5%'),
    color: '#546E7A',
    textDecorationLine: 'line-through',
    fontFamily: Fonts.gilroyMedium,
  },
  goatDealCard: {
    width: (width - 32 - 32) / 2,
    // backgroundColor: 'red',
    borderRadius: 26,
    marginBottom: 10,

    // borderWidth: 0.8,
    // borderColor: colors.themeTeal,
    height: 140,
    overflow: 'hidden',
    // elevation: 3,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
  },
  goatDealBg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  footerLogoContainer: {
    width: '100%',
    alignItems: 'flex-start',
    paddingVertical: 30,
    backgroundColor: '#FFFFFF',
  },
  footerLogo: {
    width: wp('40%'),
    height: height / 8,
    alignSelf: 'flex-start',
    //marginLeft: wp('2%'),
  },
});

export default HomeScreen;
