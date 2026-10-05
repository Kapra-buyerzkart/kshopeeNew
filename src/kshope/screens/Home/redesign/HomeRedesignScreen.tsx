import React, { useCallback, useMemo } from 'react';
import { RefreshControl, StatusBar, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getTabBarClearance } from '../../../../animations/tabBarVisibility';
import { useWishlist } from '../../../context/WishlistContext';
import { ProductTile, Tile, OccasionTile } from './content';
import { useHomeData } from './data/useHomeData';
import { resolveCatId, resolveCatName } from './data/blocks';
import HomeSkeleton from '../HomeSkeleton';
import { useCartPillScrollTracker } from '../../../components/cartPillScroll';

// New Kapra Gold & Diamonds components
import KapraHeader from './components/KapraHeader';
import CategoryCirclesRow from './components/CategoryCirclesRow';
import QuickActionCards from './components/QuickActionCards';
import JewelryProductRail from './components/JewelryProductRail';
import ShopByOccasion from './components/ShopByOccasion';
import {
  HeroBanner,
  EverydayDiamondsBanner,
  HangingJhumkaBanner,
  SideBySidePromos,
} from './components/PromoBanners';
import MarqueeTicker from './components/MarqueeTicker';
import ShowroomCard from './components/ShowroomCard';
import { HOME_COLORS, SPACE } from './theme';

type Linkable = { raw?: any };

const HomeStatusBar: React.FC = () => {
  const isFocused = useIsFocused();
  if (!isFocused) return null;

  return (
    <StatusBar
      translucent
      backgroundColor="transparent"
      barStyle="dark-content"
    />
  );
};

const isGifBanner = (b: any): boolean => {
  if (!b) return false;
  const rawUrl =
    b?.imageUrl || b?.ImageUrl || b?.image || b?.uri?.uri || b?.uri || '';
  const url = typeof rawUrl === 'string' ? rawUrl.toLowerCase().trim() : '';
  return url.includes('.gif');
};

const HomeRedesignScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { loading, refreshing, onRefresh, sections, homeData } = useHomeData();

  const scrollY = useSharedValue(0);
  const trackCartPill = useCartPillScrollTracker();
  const onScroll = useAnimatedScrollHandler({
    onScroll: e => {
      scrollY.value = e.contentOffset.y;
      trackCartPill(e);
    },
  });

  const wishlisted = useMemo(
    () =>
      [...sections.featured, ...sections.secondStrip, ...sections.thirdStrip]
        .filter(item => isInWishlist((item as any).raw?.productId ?? item.id))
        .map(item => item.id),
    [
      sections.featured,
      sections.secondStrip,
      sections.thirdStrip,
      isInWishlist,
    ],
  );

  /* ──────── Navigation Handlers ──────── */

  const openSearch = useCallback(
    (params?: object) => navigation.navigate('KshopeSearch', params),
    [navigation],
  );

  const openProfile = useCallback(
    () => navigation.navigate('KshopeProfile'),
    [navigation],
  );

  const openWishlist = useCallback(
    () => navigation.navigate('WishlistScreen'),
    [navigation],
  );

  const openAddress = useCallback(
    () => navigation.navigate('KshopeSavedAddress'),
    [navigation],
  );

  const openCategoryTab = useCallback(
    () => navigation.navigate('CategoryScreen'),
    [navigation],
  );

  const openProduct = useCallback(
    (item: ProductTile & Linkable) => {
      const product = item.raw;
      if (!product) return;
      navigation.navigate('KshopeProductDetails', {
        productId: product.productId ?? product.id,
        product,
      });
    },
    [navigation],
  );

  const openCategory = useCallback(
    (item: any) => {
      const cat = item?.raw || item;
      const rawId = cat ? resolveCatId(cat) : undefined;
      const catName = resolveCatName(
        cat,
        item.label || item.name || 'Category',
      );
      const isNumericId =
        rawId !== undefined &&
        rawId !== null &&
        rawId !== '' &&
        !isNaN(Number(rawId));
      const numericCatId = isNumericId ? Number(rawId) : undefined;

      if (!numericCatId) {
        openSearch({ query: item.label || catName, catName });
        return;
      }
      openSearch({ catId: numericCatId, catName });
    },
    [openSearch],
  );

  const openOccasion = useCallback(
    (occasion: OccasionTile) => {
      const raw = occasion.raw || occasion;
      const linkType = (raw?.linkType || raw?.LinkType || '').toLowerCase();
      const linkValue = raw?.linkValue || raw?.LinkValue;

      if (linkType === 'product' && linkValue) {
        navigation.navigate('KshopeProductDetails', { productId: linkValue });
        return;
      }
      if (linkType === 'category' && linkValue) {
        openSearch({ catId: Number(linkValue), catName: occasion.label });
        return;
      }
      const rawCatId = resolveCatId(raw);
      if (rawCatId) {
        openSearch({ catId: Number(rawCatId), catName: occasion.label });
        return;
      }
      openSearch({
        query: occasion.query || occasion.label,
        catName: occasion.label,
      });
    },
    [navigation, openSearch],
  );

  const openBanner = useCallback(
    (banner: any) => {
      if (!banner) {
        openSearch({ query: 'Jewellery' });
        return;
      }
      const linkType = (
        banner?.linkType ||
        banner?.LinkType ||
        ''
      ).toLowerCase();
      const linkValue = banner?.linkValue || banner?.LinkValue;
      if (linkType === 'product') {
        navigation.navigate('KshopeProductDetails', { productId: linkValue });
      } else if (linkType === 'category') {
        openSearch({ catId: linkValue, catName: 'Category' });
      } else {
        openSearch({ query: banner?.title || banner?.Title || 'Collection' });
      }
    },
    [navigation, openSearch],
  );

  const onToggleWishlist = useCallback(
    (item: ProductTile & Linkable) => {
      if (item.raw) {
        toggleWishlist(item.raw);
      }
    },
    [toggleWishlist],
  );

  // 1. Hero Promotional Banner (app_main_banner)
  const heroBanner = useMemo(() => {
    const list =
      sections.banners.main?.length > 0
        ? sections.banners.main
        : sections.banners.top || [];
    return list[0] || null;
  }, [sections.banners]);

  // 2. Top 3 Quick Action Banners (app_top_3_in_a_row)
  const top3Banners = useMemo(() => {
    return sections.banners.top3InARow || [];
  }, [sections.banners]);

  // 3. Middle Promotional Banner: "Everyday Diamonds" (app_mid_banner)
  const midBanner = useMemo(() => {
    const list = sections.banners.mid || [];
    return list[0] || null;
  }, [sections.banners]);

  // 4. Middle Bottom Banner: "Hanging Jhumka Animation" (app_mid_bottom_banner / app_home_bottom)
  const featureBanner = useMemo(() => {
    const list =
      sections.banners.midBottom?.length > 0
        ? sections.banners.midBottom
        : sections.banners.bottom?.length > 0
        ? sections.banners.bottom
        : [];
    return list[0] || null;
  }, [sections.banners]);

  // 5. Bottom 2-in-a-row Promos: "Diamond Dreams" & "The Gold Edit" (app_bottom_2_in_a_row)
  const sideBySideLeft = useMemo(() => {
    const list =
      sections.banners.bottom2InARow?.length > 0
        ? sections.banners.bottom2InARow
        : sections.banners.sideBySide || [];
    return list[0] || null;
  }, [sections.banners]);

  const sideBySideRight = useMemo(() => {
    const list =
      sections.banners.bottom2InARow?.length > 0
        ? sections.banners.bottom2InARow
        : sections.banners.sideBySide || [];
    return list[1] || null;
  }, [sections.banners]);

  const categoriesList = useMemo(
    () => homeData?.featuredCategories || homeData?.FeaturedCategories || [],
    [homeData?.featuredCategories, homeData?.FeaturedCategories],
  );

  const onHeroBannerPress = useCallback(() => {
    openBanner(heroBanner);
  }, [openBanner, heroBanner]);

  const onMidBannerPress = useCallback(() => {
    openBanner(midBanner);
  }, [openBanner, midBanner]);

  const onFeatureBannerPress = useCallback(() => {
    openBanner(featureBanner);
  }, [openBanner, featureBanner]);

  const onSideBySideLeftPress = useCallback(() => {
    openBanner(sideBySideLeft);
  }, [openBanner, sideBySideLeft]);

  const onSideBySideRightPress = useCallback(() => {
    openBanner(sideBySideRight);
  }, [openBanner, sideBySideRight]);

  const onGoldRatePress = useCallback(() => {
    openSearch({ query: 'Gold Rate' });
  }, [openSearch]);

  const onGoldCoinsPress = useCallback(() => {
    openSearch({ query: 'Gold Coins', catName: 'Gold Coins' });
  }, [openSearch]);

  const onCuratedViewAll = useCallback(() => {
    openSearch({ query: 'Curated' });
  }, [openSearch]);

  const onOccasionViewAll = useCallback(() => {
    openSearch({ query: 'Jewellery' });
  }, [openSearch]);

  const onTrendingViewAll = useCallback(() => {
    openSearch({ query: 'Trending' });
  }, [openSearch]);

  const onRecentlyViewedViewAll = useCallback(() => {
    openSearch({ query: 'Recently Viewed' });
  }, [openSearch]);

  if (loading) {
    return <HomeSkeleton />;
  }

  return (
    <View style={styles.root}>
      <HomeStatusBar />

      {/* Top Kapra Header */}
      <KapraHeader
        address={sections.header.address}
        onSearchPress={openSearch}
        onWishlistPress={openWishlist}
        onProfilePress={openProfile}
        onAddressPress={openAddress}
      />

      {/* Main Scroll Content */}
      <Animated.ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom:
              getTabBarClearance(insets.bottom) + SPACE.xxl * 2 + SPACE.xxl * 2,
          },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={HOME_COLORS.darkEmerald}
            colors={[HOME_COLORS.darkEmerald]}
          />
        }
      >
        {/* 1. Category Circles Row */}
        <CategoryCirclesRow
          categories={categoriesList}
          onSelectCategory={openCategory}
          onViewAllPress={openCategoryTab}
        />

        {/* 2. Hero Promotional Banner: "Crafted for every chapter" or non-GIF API banner */}
        <HeroBanner
          banner={heroBanner}
          onPress={onHeroBannerPress}
        />

        {/* 3. Three Quick Action Cards (app_top_3_in_a_row) */}
        <QuickActionCards
          banners={top3Banners}
          onBannerPress={openBanner}
          onGoldRatePress={onGoldRatePress}
          onGoldCoinsPress={onGoldCoinsPress}
          onFindStorePress={openAddress}
        />

        {/* 4. "Curated for you" Product Rail (from API firstProductBlock) */}
        <JewelryProductRail
          title="Curated for you"
          items={sections.featured}
          wishlisted={wishlisted}
          onPressProduct={openProduct}
          onToggleWishlist={onToggleWishlist}
          onViewAll={onCuratedViewAll}
        />

        {/* 5. "EVERYDAY DIAMONDS" Mid Banner from API (app_mid_banner) */}
        <EverydayDiamondsBanner
          banner={midBanner}
          onPress={onMidBannerPress}
        />

        {/* 6. "Shop by occasion" from API */}
        {sections.occasions && sections.occasions.length > 0 && (
          <ShopByOccasion
            title="Shop by occasion"
            occasions={sections.occasions}
            onSelectOccasion={openOccasion}
            onViewAll={onOccasionViewAll}
          />
        )}

        {/* 7. Full-width Hanging Jhumka Feature Banner from API (app_mid_bottom_banner animation) */}
        <HangingJhumkaBanner
          banner={featureBanner}
          onPress={onFeatureBannerPress}
        />

        {/* 8. "Trending Now" Product Rail (from API secondProductBlock) */}
        <JewelryProductRail
          title="Trending Now"
          items={sections.secondStrip}
          wishlisted={wishlisted}
          onPressProduct={openProduct}
          onToggleWishlist={onToggleWishlist}
          onViewAll={onTrendingViewAll}
        />

        {/* 9. Side-by-Side Promo Tiles from API (app_bottom_2_in_a_row) */}
        <SideBySidePromos
          leftBanner={sideBySideLeft}
          rightBanner={sideBySideRight}
          onPressLeft={onSideBySideLeftPress}
          onPressRight={onSideBySideRightPress}
        />

        {sections.thirdStrip?.length > 0 && (
          <JewelryProductRail
            title="Recently Viewed"
            items={sections.thirdStrip}
            wishlisted={wishlisted}
            onPressProduct={openProduct}
            onToggleWishlist={onToggleWishlist}
            onViewAll={onRecentlyViewedViewAll}
          />
        )}

        {/* 11. Marquee Ticker: Continuous Gold Brand Assurances */}
        <MarqueeTicker />

        {/* 12. Visit Our Showroom Card
        <ShowroomCard
          locationName="Kochi"
          onSelectLocation={openAddress}
          onFindStorePress={openAddress}
        /> */}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  content: {
    backgroundColor: '#FFFFFF',
  },
});

export default HomeRedesignScreen;
