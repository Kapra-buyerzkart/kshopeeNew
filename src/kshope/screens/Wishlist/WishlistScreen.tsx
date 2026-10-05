import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  useIsFocused,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';

import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import ConfirmationModal from '../../components/ConfirmationModal';
import {
  mapProductTile,
  formatAmountWithCommas,
  formatPriceWithCommas,
} from '../Home/redesign/data/mappers';
import { ProductImage } from '../Home/redesign/parts';
import { getHomepageData } from '../../api/services/homeService';
import { addToCartApi } from '../../api/services/cartService';
import { getKshopeAreaId } from '../../globals/storage';
import { Fonts } from '../../theme/fonts';
import { UI_ELEVATION, hitSlopTo, hp, pt } from '../../theme/tokens';
import { WISHLIST_ART } from './assets';

/* ───────── design constants ───────── */

const SCREEN_W = Dimensions.get('window').width;
const CARD_GAP = 12;
const CARD_W = Math.floor((SCREEN_W - 20 * 2 - CARD_GAP) / 2);

const COLORS = {
  darkGreen: '#0D3527',
  creamCard: '#FAF7F2',
  creamBorder: '#F0EBE1',
  creamButton: '#EFE8DE',
  cognac: '#A07042',
  gold: '#B68D40',
  goldRingOuter: '#E8DBC8',
  goldRingInner: '#F2E8DB',
  bg: '#FFFFFF',
  textDark: '#1A1A1A',
  textBody: '#666666',
  textMuted: '#767676',
  textFaint: '#9E9E9E',
  border: 'rgba(0, 0, 0, 0.07)',
  overlayBadge: 'rgba(25, 25, 25, 0.42)',
  heartRed: '#C93838',
};

/* ───────── static category data ───────── */

interface WishlistCategory {
  id: string;
  label: string;
  image: any;
}

const WISHLIST_CATEGORIES: WishlistCategory[] = [
  { id: 'rings', label: 'Rings', image: WISHLIST_ART.catRings },
  { id: 'earrings', label: 'Earrings', image: WISHLIST_ART.catEarrings },
  { id: 'pendants', label: 'Pendants', image: WISHLIST_ART.catPendants },
  { id: 'bracelets', label: 'Bracelets', image: WISHLIST_ART.catBracelets },
  { id: 'bangles', label: 'Bangles', image: WISHLIST_ART.catBangles },
];

/* ───────── curated fallback items matching design ───────── */

const CURATED_DEMO_PRODUCTS = [
  {
    id: 'curated-ring-1',
    name: 'Serenity Diamond Ring',
    detail: '18K Rose Gold • 0.50 ct',
    price: '₹ 1,24,000',
    image: WISHLIST_ART.productRing,
    raw: {
      productId: 'curated-ring-1',
      id: 'curated-ring-1',
      productName: 'Serenity Diamond Ring',
      name: 'Serenity Diamond Ring',
      specialPrice: 124000,
      price: 124000,
      metalType: '18K Rose Gold',
      weight: '0.50 ct',
    },
  },
  {
    id: 'curated-earrings-2',
    name: 'Lumière Drop Earrings',
    detail: '18K Yellow Gold • 0.72 ct',
    price: '₹ 1,48,000',
    image: WISHLIST_ART.productEarrings,
    raw: {
      productId: 'curated-earrings-2',
      id: 'curated-earrings-2',
      productName: 'Lumière Drop Earrings',
      name: 'Lumière Drop Earrings',
      specialPrice: 148000,
      price: 148000,
      metalType: '18K Yellow Gold',
      weight: '0.72 ct',
    },
  },
];

/* ───────── component ───────── */

const WishlistScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const {
    wishlistItems,
    loadWishlist,
    isLoading,
    toggleWishlist,
    isInWishlist,
  } = useWishlist();
  const { cartCount, loadCart } = useCart();
  const [itemToRemove, setItemToRemove] = useState<any>(null);
  const [suggestedProducts, setSuggestedProducts] = useState<any[]>(
    CURATED_DEMO_PRODUCTS,
  );
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [isMovingAll, setIsMovingAll] = useState(false);
  const [movingCardId, setMovingCardId] = useState<string | number | null>(
    null,
  );

  const getCardSubtitle = (item: any) => {
    const metal =
      item.raw?.metalType ||
      item.raw?.metal_type ||
      item.raw?.goldPurity ||
      item.raw?.metal ||
      '';
    const weight =
      item.raw?.weight ||
      item.raw?.diamondWeight ||
      item.raw?.netWeight ||
      item.raw?.grossWeight ||
      '';

    if (metal && weight) {
      return `${metal} | ${weight}`;
    }
    if (metal) return metal;
    if (weight) return weight;
    if (item.detail) return item.detail.replace(' • ', ' | ');
    if (item.subtitle) return item.subtitle.replace(' • ', ' | ');
    if (item.raw?.catName || item.raw?.categoryName) {
      return item.raw?.catName || item.raw?.categoryName;
    }
    return '';
  };

  const getCardPrice = (item: any) => {
    const numPrice =
      item.raw?.specialPrice || item.raw?.price || item.raw?.currentPrice;
    if (numPrice && Number(numPrice) > 0) {
      return `₹${formatAmountWithCommas(numPrice)}`;
    }
    if (item.price) {
      return formatPriceWithCommas(item.price).replace('/-', '').trim();
    }
    return '₹ —';
  };

  const handleMoveItemToBag = async (item: any) => {
    const pId = item.raw?.productId ?? item.raw?.id ?? item.id;
    if (!pId) return;
    try {
      setMovingCardId(pId);
      const storedAreaId = await getKshopeAreaId();
      await addToCartApi(pId, 1, storedAreaId ? Number(storedAreaId) : null);
      if (loadCart) {
        await loadCart();
      }
      if (item.raw) {
        await toggleWishlist(item.raw);
      }
      Toast.show('Item moved to bag', Toast.SHORT);
    } catch {
      Toast.show('Could not add to bag', Toast.SHORT);
    } finally {
      setMovingCardId(null);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadWishlist(true);
    }, [loadWishlist]),
  );

  /* fetch suggested products from home data and merge with design items */
  useEffect(() => {
    let isMounted = true;
    const fetchSuggestions = async () => {
      try {
        setLoadingSuggestions(true);
        const storedAreaId = await getKshopeAreaId();
        const data = await getHomepageData(storedAreaId, 20);
        const payload = data?.data || data;

        const firstBlock = payload?.firstProductBlock;
        const products = Array.isArray(firstBlock?.products)
          ? firstBlock.products
          : Array.isArray(firstBlock?.Products)
          ? firstBlock.Products
          : [];

        if (isMounted && products.length > 0) {
          const mapped = products.slice(0, 4).map((p: any, idx: number) => {
            const tile = mapProductTile(p, idx + 2);
            return {
              id: tile.id,
              name: tile.name,
              detail: tile.raw?.weight
                ? `${tile.raw?.metalType} • ${tile.raw?.weight}`
                : tile.raw?.metalType,
              price: tile.price,
              image: tile.image,
              raw: tile.raw || p,
            };
          });
          setSuggestedProducts([...CURATED_DEMO_PRODUCTS, ...mapped]);
        }
      } catch {
        // Fallback already preloaded with CURATED_DEMO_PRODUCTS
      } finally {
        if (isMounted) {
          setLoadingSuggestions(false);
        }
      }
    };
    fetchSuggestions();
    return () => {
      isMounted = false;
    };
  }, []);

  const cards = useMemo(
    () => wishlistItems.map((item, index) => mapProductTile(item, index)),
    [wishlistItems],
  );

  /* ─── navigation helpers ─── */

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('HomeScreen');
  };

  const openProduct = (item: any) => {
    const product = item.raw || item;
    const pId = product?.productId ?? product?.id ?? item?.id;
    if (String(pId).startsWith('curated-')) {
      openSearch({ query: item.name });
      return;
    }
    navigation.navigate('KshopeProductDetails', {
      productId: pId,
      product,
    });
  };

  const openSearch = (params?: object) =>
    navigation.navigate('KshopeSearch', params);

  const openCart = () => navigation.navigate('KshopeCart');

  const openCategory = (cat: WishlistCategory) => {
    openSearch({ query: cat.label, catName: cat.label });
  };

  const callShowroom = () => {
    Linking.openURL('tel:+919048801110').catch(() => {
      Toast.show('Unable to open phone dialer', Toast.SHORT);
    });
  };

  /* ─── move all to bag ─── */

  const handleMoveAllToBag = async () => {
    if (cards.length === 0) {
      openCart();
      return;
    }

    try {
      setIsMovingAll(true);
      const storedAreaId = await getKshopeAreaId();
      for (const card of cards) {
        const pId = card.raw?.productId ?? card.raw?.id ?? card.id;
        if (pId && !String(pId).startsWith('curated-')) {
          try {
            await addToCartApi(
              pId,
              1,
              storedAreaId ? Number(storedAreaId) : null,
            );
          } catch {
            // continue adding others
          }
        }
      }
      if (loadCart) {
        await loadCart();
      }
      Toast.show('Items moved to your bag', Toast.SHORT);
      openCart();
    } catch {
      Toast.show('Could not move all items to bag', Toast.SHORT);
    } finally {
      setIsMovingAll(false);
    }
  };

  /* ─── header ─── */

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={goBack}
        style={styles.headerBackCircle}
        hitSlop={hitSlopTo(28)}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={20} color={COLORS.textDark} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={openCart}
        hitSlop={hitSlopTo(28)}
        style={styles.headerCartButton}
        activeOpacity={0.7}
      >
        <Ionicons name="bag-outline" size={24} color={COLORS.textDark} />
        {cartCount > 0 && (
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>
              {cartCount > 99 ? '99+' : cartCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  /* ─── title section ─── */

  const renderTitleSection = () => (
    <View style={styles.titleSection}>
      <Text style={styles.titleText}>My Wishlist</Text>
      <Text style={styles.subtitleText}>
        {'BEAUTIFUL THINGS\nALWAYS BELONG WITH YOU'}
      </Text>
    </View>
  );

  /* ─── empty state card (matches design hero) ─── */

  const renderEmptyState = () => (
    <View style={styles.emptyCard}>
      {/* Concentric rings emblem with gold heart & sparkle */}
      <View style={styles.emblemContainer}>
        <View style={styles.emblemOuterRing}>
          <View style={styles.emblemInnerRing}>
            <Ionicons name="heart-outline" size={26} color={COLORS.gold} />
          </View>
        </View>
        <View style={styles.sparklePosition}>
          <Text style={styles.sparkleStar}>✦</Text>
        </View>
      </View>

      <Text style={styles.emptyTitle}>
        {'Your Wishlist Awaits Its First\nSparkle'}
      </Text>

      <Text style={styles.emptyBody}>
        {
          'Save the timeless designs that speak directly\nto your heart. Tap the heart icon on any high\njewellery creation to craft your personal\nheirloom collection here.'
        }
      </Text>

      {/* Primary CTA */}
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => navigation.navigate('CategoryScreen')}
        style={styles.ctaPrimary}
      >
        <Text style={styles.ctaPrimarySparkle}>✦</Text>
        <Text style={styles.ctaPrimaryText}>EXPLORE HIGH JEWELLERY</Text>
      </TouchableOpacity>

      {/* Secondary CTA */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={callShowroom}
        style={styles.ctaSecondary}
      >
        <Text style={styles.ctaSecondaryText}>Book a Private Store Visit</Text>
      </TouchableOpacity>
    </View>
  );

  /* ─── you may also love category row ─── */

  const renderCategoryRow = () => (
    <View style={styles.categorySection}>
      <View style={styles.categorySectionHeader}>
        <Text style={styles.categorySectionTitle}>You may also love</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => openSearch()}
          hitSlop={hitSlopTo(20)}
        >
          <Text style={styles.categorySectionLink}>
            MORE JEWELLERY TO ADORE{' '}
            <Text style={styles.categorySectionChevron}>›</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categoryRowWrapper}>
        {WISHLIST_CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.id}
            activeOpacity={0.8}
            onPress={() => openCategory(cat)}
            style={styles.categoryItem}
          >
            <View style={styles.categoryCircle}>
              <Image
                source={cat.image}
                style={styles.categoryImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.categoryLabel}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  /* ─── curated suggestions card ─── */

  const renderCuratedCard = ({ item }: { item: any; index: number }) => {
    const detail = getCardSubtitle(item);
    const priceDisplay = getCardPrice(item);
    const inWishlist = isInWishlist(
      item.raw?.productId ?? item.raw?.id ?? item.id,
    );
    const pId = item.raw?.productId ?? item.raw?.id ?? item.id;
    const isMoving = movingCardId === pId;

    return (
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={() => openProduct(item)}
        style={styles.cardContainer}
      >
        <View style={styles.cardImageWrap}>
          {typeof item.image === 'number' || item.image?.uri ? (
            <Image
              source={item.image}
              style={styles.cardImage}
              resizeMode="cover"
            />
          ) : (
            <ProductImage source={item.image} style={styles.cardImage} />
          )}

          {/* Top-right Heart Button */}
          <TouchableOpacity
            onPress={() => {
              if (item.raw) {
                toggleWishlist(item.raw);
              }
            }}
            hitSlop={hitSlopTo(24)}
            style={styles.cardHeartBtn}
            activeOpacity={0.8}
          >
            <Ionicons
              name={inWishlist ? 'heart' : 'heart-outline'}
              size={17}
              color={inWishlist ? COLORS.heartRed : COLORS.textDark}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.name}
          </Text>
          {!!detail && (
            <Text style={styles.cardSubtitle} numberOfLines={1}>
              {detail}
            </Text>
          )}
          <Text style={styles.cardPrice}>{priceDisplay}</Text>
        </View>

        {/* Move to Bag Pill Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => handleMoveItemToBag(item)}
          disabled={isMoving}
          style={styles.moveToBagBtn}
        >
          {isMoving ? (
            <ActivityIndicator size="small" color={COLORS.textDark} />
          ) : (
            <>
              <Ionicons
                name="bag-outline"
                size={15}
                color={COLORS.textDark}
                style={styles.moveToBagIcon}
              />
              <Text style={styles.moveToBagText}>Move to Bag</Text>
            </>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  /* ─── curated suggestions section ─── */

  const renderCuratedSuggestions = () => (
    <View style={styles.suggestedSection}>
      <View style={styles.suggestedSectionHeader}>
        <Text style={styles.suggestedSectionTitle}>Curated Suggestions</Text>
      </View>

      {loadingSuggestions && suggestedProducts.length === 0 ? (
        <ActivityIndicator
          size="small"
          color={COLORS.darkGreen}
          style={styles.loadingIndicator}
        />
      ) : (
        <FlatList
          data={suggestedProducts}
          renderItem={renderCuratedCard}
          keyExtractor={item => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.suggestedColumn}
          scrollEnabled={false}
          contentContainerStyle={styles.suggestedList}
        />
      )}
    </View>
  );

  /* ─── wishlist items grid card (when items present) ─── */

  const renderWishlistCard = ({ item }: { item: any; index: number }) => {
    const detail = getCardSubtitle(item);
    const priceDisplay = getCardPrice(item);
    const pId = item.raw?.productId ?? item.raw?.id ?? item.id;
    const isMoving = movingCardId === pId;

    return (
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={() => openProduct(item)}
        style={styles.cardContainer}
      >
        <View style={styles.cardImageWrap}>
          <ProductImage source={item.image} style={styles.cardImage} />

          {/* Top-right Heart Button */}
          <TouchableOpacity
            onPress={() => setItemToRemove(item.raw)}
            hitSlop={hitSlopTo(24)}
            style={styles.cardHeartBtn}
            activeOpacity={0.8}
          >
            <Ionicons name="heart" size={17} color={COLORS.heartRed} />
          </TouchableOpacity>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.name}
          </Text>
          {!!detail && (
            <Text style={styles.cardSubtitle} numberOfLines={1}>
              {detail}
            </Text>
          )}
          <Text style={styles.cardPrice}>{priceDisplay}</Text>
        </View>

        {/* Move to Bag Pill Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => handleMoveItemToBag(item)}
          disabled={isMoving}
          style={styles.moveToBagBtn}
        >
          {isMoving ? (
            <ActivityIndicator size="small" color={COLORS.textDark} />
          ) : (
            <>
              <Ionicons
                name="bag-outline"
                size={15}
                color={COLORS.textDark}
                style={styles.moveToBagIcon}
              />
              <Text style={styles.moveToBagText}>Move to Bag</Text>
            </>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  /* ─── wishlist items grid ─── */

  const renderWishlistGrid = () => (
    <View style={styles.wishlistGridSection}>
      <FlatList
        data={cards}
        renderItem={renderWishlistCard}
        keyExtractor={card => String(card.id)}
        numColumns={2}
        columnWrapperStyle={styles.suggestedColumn}
        scrollEnabled={false}
        contentContainerStyle={styles.suggestedList}
      />
    </View>
  );

  /* ─── bottom action button ─── */

  const renderBottomBar = () => (
    <View style={styles.bottomBarContainer}>
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={handleMoveAllToBag}
        disabled={isMovingAll}
        style={styles.bottomBarButton}
      >
        {isMovingAll ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            <Ionicons
              name="bag-outline"
              size={18}
              color="#FFFFFF"
              style={styles.bottomBarIcon}
            />
            <View style={styles.bottomBarTextWrap}>
              <Text style={styles.bottomBarTextTitle}>Move All to Bag</Text>
              <Text style={styles.bottomBarTextCount}> ({cards.length})</Text>
            </View>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  /* ─── loading state ─── */

  if (isLoading && cards.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {isFocused ? (
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="dark-content"
          />
        ) : null}
        {renderHeader()}
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color={COLORS.darkGreen} />
        </View>
      </SafeAreaView>
    );
  }

  /* ─── main render ─── */

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {isFocused ? (
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
      ) : null}

      {renderHeader()}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          cards.length > 0 && styles.scrollContentWithBar,
        ]}
      >
        {renderTitleSection()}

        {cards.length === 0 ? renderEmptyState() : renderWishlistGrid()}

        {renderCategoryRow()}

        {renderCuratedSuggestions()}
      </ScrollView>

      {/* Floating Bottom Button */}
      {cards.length > 0 && renderBottomBar()}

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
        themeColor={COLORS.darkGreen}
      />
    </SafeAreaView>
  );
};

/* ═══════════════════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════════════════ */

const styles = StyleSheet.create({
  /* ── layout ── */
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    paddingBottom: 200,
  },
  scrollContentWithBar: {
    paddingBottom: 200, // Space for floating bottom bar
  },
  loadingIndicator: {
    marginVertical: 24,
  },
  loadingCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ── header ── */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerBackCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#ECECEC',
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCartButton: {
    position: 'relative',
    padding: 6,
  },
  headerBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  headerBadgeText: {
    fontFamily: Fonts.lexend.semiBold,
    fontSize: 9,
    lineHeight: 11,
    color: '#FFFFFF',
  },

  /* ── title section ── */
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  titleText: {
    fontFamily: Fonts.cormorantGaramond.bold,
    fontSize: pt(36),
    lineHeight: pt(42),
    color: COLORS.textDark,
    letterSpacing: -0.4,
  },
  subtitleText: {
    fontFamily: Fonts.lexend.regular,
    fontSize: pt(9.5),
    lineHeight: pt(15),
    color: COLORS.textMuted,
    letterSpacing: 2.2,
    marginTop: 6,
  },

  /* ── empty state hero card ── */
  emptyCard: {
    marginHorizontal: 20,
    marginTop: 4,
    backgroundColor: COLORS.creamCard,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  emblemContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  emblemOuterRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FAF5EE',
    borderWidth: 1.5,
    borderColor: COLORS.goldRingOuter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emblemInnerRing: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.goldRingInner,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparklePosition: {
    position: 'absolute',
    top: -2,
    right: 0,
  },
  sparkleStar: {
    fontSize: 16,
    color: COLORS.gold,
  },
  emptyTitle: {
    fontFamily: Fonts.cormorantGaramond.semiBold,
    fontSize: pt(23),
    lineHeight: pt(29),
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyBody: {
    fontFamily: Fonts.cormorantGaramond.regular,
    fontSize: pt(13.5),
    lineHeight: pt(20),
    color: COLORS.textBody,
    textAlign: 'center',
    marginBottom: 26,
    paddingHorizontal: 6,
  },
  ctaPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.darkGreen,
    marginBottom: 12,
  },
  ctaPrimarySparkle: {
    fontSize: 14,
    color: '#FFFFFF',
    marginRight: 8,
  },
  ctaPrimaryText: {
    fontFamily: Fonts.lexend.medium,
    fontSize: pt(12),
    lineHeight: pt(16),
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  ctaSecondary: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.creamButton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaSecondaryText: {
    fontFamily: Fonts.cormorantGaramond.medium,
    fontSize: pt(15),
    lineHeight: pt(20),
    color: COLORS.textDark,
  },

  /* ── you may also love row ── */
  categorySection: {
    marginTop: 28,
  },
  categorySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categorySectionTitle: {
    fontFamily: Fonts.cormorantGaramond.semiBold,
    fontSize: pt(20),
    lineHeight: pt(25),
    color: COLORS.textDark,
  },
  categorySectionLink: {
    fontFamily: Fonts.lexend.regular,
    fontSize: pt(8.5),
    lineHeight: pt(13),
    color: COLORS.textMuted,
    letterSpacing: 1.6,
  },
  categorySectionChevron: {
    fontSize: pt(11),
  },
  categoryRowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  categoryItem: {
    alignItems: 'center',
  },
  categoryCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: COLORS.creamCard,
    borderWidth: 1,
    borderColor: '#ECE6DC',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryLabel: {
    fontFamily: Fonts.cormorantGaramond.medium,
    fontSize: pt(12),
    lineHeight: pt(16),
    color: COLORS.textDark,
    marginTop: 6,
    textAlign: 'center',
  },

  /* ── curated suggestions section ── */
  suggestedSection: {
    marginTop: 30,
  },
  suggestedSectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  suggestedSectionTitle: {
    fontFamily: Fonts.cormorantGaramond.semiBold,
    fontSize: pt(21),
    lineHeight: pt(26),
    color: COLORS.textDark,
  },
  suggestedList: {
    paddingHorizontal: 20,
  },
  suggestedColumn: {
    justifyContent: 'space-between',
    marginBottom: CARD_GAP,
  },
  /* ── product card (luxury high-jewellery design) ── */
  cardContainer: {
    width: CARD_W,
    borderRadius: 20,
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: '#ECE6DC',
    padding: 10,
    marginBottom: CARD_GAP,
    // shadowColor: '#000000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.05,
    // shadowRadius: 6,
    // elevation: 1,
  },
  cardImageWrap: {
    width: '100%',
    height: CARD_W - 20,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: COLORS.creamCard,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  storyTagWrap: {
    position: 'absolute',
    top: 8,
    left: 8,
    maxWidth: '65%',
  },
  storyTagText: {
    fontFamily: Fonts.cormorantGaramond.semiBold,
    fontSize: pt(8),
    lineHeight: pt(10.5),
    color: 'rgba(40, 32, 28, 0.78)',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  cardHeartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
  },
  cardBody: {
    paddingTop: 10,
    paddingHorizontal: 2,
  },
  cardTitle: {
    fontFamily: Fonts.cormorantGaramond.semiBold,
    fontSize: pt(16.5),
    lineHeight: pt(20),
    color: COLORS.textDark,
  },
  cardSubtitle: {
    fontFamily: Fonts.lexend.regular,
    fontSize: pt(10.5),
    lineHeight: pt(15),
    color: COLORS.textMuted,
    marginTop: 3,
  },
  cardPrice: {
    fontFamily: Fonts.lexend.semiBold,
    fontSize: pt(15),
    lineHeight: pt(20),
    color: COLORS.textDark,
    marginTop: 6,
  },
  moveToBagBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.creamButton,
    marginTop: 10,
  },
  moveToBagIcon: {
    marginRight: 6,
  },
  moveToBagText: {
    fontFamily: Fonts.lexend.medium,
    fontSize: pt(11.5),
    lineHeight: pt(16),
    color: COLORS.textDark,
  },

  /* ── wishlist items grid ── */
  wishlistGridSection: {
    marginTop: 8,
  },

  /* ── bottom sticky action bar ── */
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: hp('2.5%') > 24 ? hp('2.5%') : 24,
    paddingTop: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  bottomBarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.cognac,
    ...UI_ELEVATION.card,
  },
  bottomBarIcon: {
    marginRight: 10,
  },
  bottomBarTextWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bottomBarTextTitle: {
    fontFamily: Fonts.lexend.medium,
    fontSize: pt(12),
    lineHeight: pt(16),
    color: '#FFFFFF',
  },
  bottomBarTextCount: {
    fontFamily: Fonts.lexend.medium,
    fontSize: pt(11),
    lineHeight: pt(15),
    color: '#FFFFFF',
  },
});

export default WishlistScreen;
