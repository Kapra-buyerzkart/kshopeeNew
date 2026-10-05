import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWishlist } from '../../../context/WishlistContext';
import { s } from '../../Home/redesign/theme';
import Gallery from './sections/Gallery';
import PriceHeader from './sections/PriceHeader';
import SpecDetailsRow from './sections/SpecDetailsRow';
import ProductInfoSection from './sections/ProductInfoSection';
import ReviewTabs from './sections/ReviewTabs';
import TrustStrip from './sections/TrustStrip';
import SimilarProducts from './sections/SimilarProducts';
import ProductActionRow from './sections/ProductActionRow';
import ProductDetailsSkeleton from './sections/ProductDetailsSkeleton';
import { useProductDetails } from './data/useProductDetails';
import {
  extractJewelleryDetails,
  extractPriceBreakup,
  galleryImages,
  isOutOfStock,
  pricing,
  productDescription,
  productSubtitle,
  productTitle,
  ratingSummary,
  reviewList,
  reviewSummary,
  specificationList,
  tokenCount,
  warrantyText,
} from './data/selectors';
import { PDP_COLORS } from './theme';

const ProductStatusBar: React.FC = () => {
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

const ProductDetailsRedesignScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { product, productId } = ((route.params as any) || {}) as {
    product?: any;
    productId?: string;
  };

  const rawId = product?.productId ?? productId;
  const id = String(rawId ?? '');

  const { isInWishlist, toggleWishlist } = useWishlist();
  const {
    details,
    product: current,
    related,
    cartQty,
    stockBlocked,
    loading,
    addToCart,
    setQuantity,
  } = useProductDetails(id, product);

  const wishlistId = current?.productId ?? rawId;
  const prices = pricing(current, details);
  const rating = ratingSummary(details, current);
  const outOfStock = isOutOfStock(current, details) || stockBlocked;
  const reviewStats = reviewSummary(details, current);
  const reviews = reviewList(details, current);
  const specs = specificationList(details, current);
  const title = productTitle(current, details);
  const jewellery = extractJewelleryDetails(details, current);
  const sku =
    jewellery.sku ||
    current?.sku ||
    current?.productCode ||
    details?.sku ||
    details?.product?.sku ||
    '';
  const description = productDescription(current, details);
  const breakup = extractPriceBreakup(details, current);

  const openProduct = (item: any) =>
    navigation.push('KshopeProductDetails', {
      productId: item?.productId,
      product: item,
    });

  return (
    <View style={styles.safe}>
      <ProductStatusBar />

      {loading ? (
        <ProductDetailsSkeleton />
      ) : (
        <Animated.ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: s(120) + insets.bottom },
          ]}
        >
          <Gallery
            images={galleryImages(details, current)}
            discountLabel={prices.discountLabel}
            wishlisted={isInWishlist(wishlistId)}
            title={title}
            onBack={() => navigation.goBack()}
            onToggleWishlist={() => toggleWishlist(current)}
          />

          <PriceHeader
            title={title}
            subtitle={`${jewellery.goldPurity} ${jewellery.goldType}${
              jewellery.hasDiamond ? ' | Diamond' : ''
            }`}
            price={prices.price}
            mrp={prices.mrp}
            saveLabel={prices.saveLabel}
            savingBadge={prices.savingBadge}
            average={rating.average}
            ratings={rating.ratings}
            reviews={rating.reviews}
            hasRating={rating.hasRating}
            tokens={tokenCount(current, details, product)}
          />

          {/* Ring Size, Pincode Delivery, Gold & Diamond Specs & Customize Bar */}
          <SpecDetailsRow jewellery={jewellery} />

          <ProductActionRow
            inWishlist={isInWishlist(wishlistId)}
            onToggleWishlist={() => toggleWishlist(current)}
            inCart={cartQty > 0}
            cartQty={cartQty}
            outOfStock={outOfStock}
            onAddToCart={addToCart}
            onIncrement={addToCart}
            onDecrement={() => setQuantity(cartQty - 1)}
          />

          {description ? (
            <ProductInfoSection sku={sku} description={description} />
          ) : null}

          <ReviewTabs
            average={reviewStats.average}
            total={reviewStats.total}
            bars={reviewStats.bars}
            reviews={reviews}
            hasRatings={reviewStats.hasData}
            specs={specs}
            jewellery={jewellery}
            warranty={warrantyText(details, current)}
            priceBreakup={prices}
            breakupList={breakup}
          />

          <View style={styles.stripSpacer} />
          <TrustStrip />

          <SimilarProducts
            items={related}
            isWishlisted={item => isInWishlist(item?.productId)}
            onPress={openProduct}
            onToggleWishlist={toggleWishlist}
          />
        </Animated.ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: PDP_COLORS.white,
  },
  content: {
    paddingBottom: s(120),
  },
  stripSpacer: {
    height: s(20),
  },
});

export default ProductDetailsRedesignScreen;
