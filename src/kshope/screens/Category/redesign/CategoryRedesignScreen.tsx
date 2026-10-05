import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getTabBarClearance } from '../../../../animations/tabBarVisibility';
import { useWishlist } from '../../../context/WishlistContext';
import { useCartPillScrollProps } from '../../../components/cartPillScroll';
import type { ProductTile } from '../../Home/redesign/content';
import { KAPRA_ART } from '../../Home/redesign/kapraAssets';
import {
  CARD_GAP,
  GUTTER,
  HOME_COLORS,
  HOME_FONTS,
  SPACE,
  fs,
  s,
} from '../../Home/redesign/theme';
import FilterSheet from './sections/FilterSheet';
import CategoryHeader from './sections/CategoryHeader';
import CategoryChipRow from './sections/CategoryChipRow';
import SubCategoryRow from './sections/SubCategoryRow';
import PromoBanner from './sections/PromoBanner';
import ProductCard from './sections/ProductCard';
import CategoryProductSkeleton from './sections/CategoryProductSkeleton';
import { useCategoryData } from './data/useCategoryData';
import type { Filters } from './data/useCategoryData';

const AnimatedFlatList = (Animated as any)?.FlatList ?? FlatList;

const CategoryStatusBar: React.FC = () => {
  const isFocused = useIsFocused();

  if (!isFocused) {
    return null;
  }

  return (
    <StatusBar
      translucent
      backgroundColor="transparent"
      barStyle="dark-content"
    />
  );
};

const CategoryRedesignScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { catId } = ((route.params as any) || {}) as { catId?: string };

  const { toggleWishlist, isInWishlist } = useWishlist();

  const [filterVisible, setFilterVisible] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const listRef = useRef<FlatList>(null);
  const cartPillScroll = useCartPillScrollProps();

  const {
    loading,
    isLoadingMore,
    categoryTiles,
    subCategoryTiles,
    productCards,
    categoryName,
    banner,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedSubCategoryId,
    selectSubCategory,
    searchText,
    setSearchText,
    clearSearch,
    activeSearchTerm,
    resultCount,
    filters,
    setFilters,
    filtersActive,
    loadMore,
  } = useCategoryData(catId);

  const openProduct = useCallback(
    (item: ProductTile) => {
      const product = item.raw;
      navigation.navigate('KshopeProductDetails', {
        productId: product?.productId ?? product?.id,
        product,
      });
    },
    [navigation],
  );

  const onSelectCategory = useCallback(
    (id: string) => {
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
      setSelectedCategoryId(id);
    },
    [setSelectedCategoryId],
  );

  const onSelectSubCategory = useCallback(
    (id: string) => {
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
      selectSubCategory(id);
    },
    [selectSubCategory],
  );

  const toggleSearch = useCallback(() => {
    setSearchOpen(open => {
      if (open) {
        clearSearch();
      }
      return !open;
    });
  }, [clearSearch]);

  const onSearchPress = useCallback(() => {
    navigation.navigate('KshopeSearch');
  }, [navigation]);

  const onWishlistPress = useCallback(() => {
    navigation.navigate('KshopeHome', { screen: 'WishlistScreen' });
  }, [navigation]);

  const onCartPress = useCallback(() => {
    navigation.navigate('KshopeCart');
  }, [navigation]);

  const applyFilters = useCallback(
    (applied: Filters) => {
      setFilterVisible(false);
      setFilters(applied);
    },
    [setFilters],
  );

  return (
    <View style={styles.container}>
      <CategoryStatusBar />

      <CategoryHeader
        searchOpen={searchOpen}
        searchText={searchText}
        onSearchPress={onSearchPress}
        onToggleSearch={toggleSearch}
        onChangeSearch={setSearchText}
        onClearSearch={clearSearch}
        onFilterPress={() => setFilterVisible(true)}
        filtersActive={filtersActive}
        onWishlistPress={onWishlistPress}
        onCartPress={onCartPress}
        onBack={
          catId && navigation.canGoBack?.()
            ? () => navigation.goBack()
            : undefined
        }
      />

      <AnimatedFlatList
        ref={listRef as any}
        data={productCards}
        keyExtractor={(item: ProductTile) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        {...cartPillScroll}
        columnWrapperStyle={styles.column}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingBottom: getTabBarClearance(insets.bottom) + s(60) + s(60),
          },
        ]}
        renderItem={({ item }: { item: ProductTile }) => (
          <ProductCard
            item={item}
            wishlisted={isInWishlist(item.raw?.productId ?? item.id)}
            onPress={openProduct}
            onToggleWishlist={product => toggleWishlist(product.raw)}
          />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            {/* Screen Title Block */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>Categories</Text>
              <Text style={styles.subtitle}>
                Discover jewellery for every story
              </Text>
            </View>

            {/* Promo Banner */}
            <PromoBanner source={banner} />

            {/* Top Category Circles Row */}
            {categoryTiles.length > 0 && (
              <CategoryChipRow
                items={categoryTiles}
                activeId={selectedCategoryId}
                onPress={onSelectCategory}
              />
            )}

            {/* Explore By Type / SubCategories */}
            {subCategoryTiles.length > 0 && (
              <SubCategoryRow
                key={selectedCategoryId ?? 'subcategories'}
                items={subCategoryTiles}
                activeId={selectedSubCategoryId}
                onPress={onSelectSubCategory}
              />
            )}

            {activeSearchTerm && resultCount > 0 ? (
              <Text style={styles.resultCount}>
                {`${resultCount} result${
                  resultCount === 1 ? '' : 's'
                } for "${activeSearchTerm}"`}
              </Text>
            ) : null}
          </View>
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoadingMore ? (
            <ActivityIndicator
              size="small"
              color={HOME_COLORS.darkEmerald}
              style={styles.footerLoader}
            />
          ) : null
        }
        ListEmptyComponent={
          loading ? (
            <CategoryProductSkeleton />
          ) : (
            <View style={styles.empty}>
              <Image
                source={KAPRA_ART.emptyBox}
                style={styles.emptyBoxImage}
                resizeMode="contain"
              />
              <Text style={styles.emptyTitle}>No products found</Text>
              <Text style={styles.emptyText}>
                {activeSearchTerm
                  ? `No products match "${activeSearchTerm}"`
                  : 'There are currently no products available in this category.'}
              </Text>
            </View>
          )
        }
      />

      <FilterSheet
        visible={filterVisible}
        filters={filters}
        categoryName={categoryName}
        onClose={() => setFilterVisible(false)}
        onApply={applyFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginHorizontal: -GUTTER,
  },
  titleSection: {
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.xs,
    paddingBottom: SPACE.sm,
  },
  title: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(28),
    lineHeight: fs(32),
    color: '#0C382E',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(12),
    color: '#767676',
    marginTop: s(2),
  },
  listContent: {
    paddingHorizontal: GUTTER,
    paddingBottom: SPACE.xxl * 2,
  },
  column: {
    justifyContent: 'space-between',
    gap: CARD_GAP,
  },
  footerLoader: {
    marginVertical: SPACE.xl,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACE.xxl,
    paddingHorizontal: GUTTER * 2,
  },
  emptyBoxImage: {
    width: s(130),
    height: s(130),
    marginBottom: SPACE.sm,
  },
  emptyTitle: {
    fontFamily: HOME_FONTS.bold,
    fontSize: fs(15),
    color: '#1A1A1A',
    marginBottom: s(4),
    textAlign: 'center',
  },
  resultCount: {
    marginTop: SPACE.md,
    paddingHorizontal: GUTTER,
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(11),
    color: '#767676',
  },
  emptyText: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(12),
    color: '#767676',
    textAlign: 'center',
    lineHeight: fs(18),
  },
});

export default CategoryRedesignScreen;
