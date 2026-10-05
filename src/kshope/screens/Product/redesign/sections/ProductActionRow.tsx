import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { HOME_FONTS, fs, s } from '../../../Home/redesign/theme';
import { CartIcon, HeartIcon, HeartSolidIcon } from '../icons';
import { PDP_COLORS } from '../theme';

type Props = {
  inWishlist: boolean;
  onToggleWishlist: () => void;
  inCart: boolean;
  cartQty?: number;
  outOfStock: boolean;
  onAddToCart: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  style?: any;
};

export const ProductActionRow: React.FC<Props> = ({
  inWishlist,
  onToggleWishlist,
  inCart,
  cartQty = 0,
  outOfStock,
  onAddToCart,
  onIncrement,
  onDecrement,
  style,
}) => {
  const showStepper = inCart && cartQty > 0 && onIncrement && onDecrement;

  return (
    <View style={[styles.container, style]}>
      {/* ADD TO WISHLIST Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onToggleWishlist}
        style={[
          styles.wishlistButton,
          inWishlist
            ? styles.wishlistButtonActive
            : styles.wishlistButtonInactive,
        ]}
      >
        {inWishlist ? (
          <HeartSolidIcon
            width={16}
            height={16}
            color={PDP_COLORS.white}
            style={styles.btnIcon}
          />
        ) : (
          <HeartIcon
            width={16}
            height={16}
            color={PDP_COLORS.bottomWishlist}
            style={styles.btnIcon}
          />
        )}
        <Text
          style={[
            styles.buttonText,
            inWishlist
              ? styles.wishlistTextActive
              : styles.wishlistTextInactive,
          ]}
          numberOfLines={1}
        >
          {inWishlist ? 'WISHLISTED' : 'ADD TO WISHLIST'}
        </Text>
      </TouchableOpacity>

      {/* ADD TO BAG / STEPPER Button */}
      {showStepper ? (
        <View style={styles.stepperContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={onDecrement}
            style={styles.stepBtn}
          >
            <Entypo name="minus" size={17} color={PDP_COLORS.white} />
          </TouchableOpacity>

          <View style={styles.qtyCol}>
            <Text style={styles.qtyLabel}>IN BAG</Text>
            <Text style={styles.qtyNumber}>{cartQty}</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={onIncrement}
            style={styles.stepBtn}
          >
            <Entypo name="plus" size={17} color={PDP_COLORS.white} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={outOfStock}
          onPress={onAddToCart}
          style={[
            styles.bagButton,
            outOfStock ? styles.bagButtonDisabled : styles.bagButtonActive,
          ]}
        >
          {!outOfStock ? (
            <CartIcon
              width={18}
              height={16}
              color={PDP_COLORS.white}
              style={styles.btnIcon}
            />
          ) : null}
          <Text
            style={[
              styles.buttonText,
              outOfStock ? styles.bagTextDisabled : styles.bagTextActive,
            ]}
            numberOfLines={1}
          >
            {outOfStock
              ? 'OUT OF STOCK'
              : inCart
              ? 'ADDED TO BAG'
              : 'ADD TO BAG'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(16),
    paddingTop: s(12),
    paddingBottom: s(12),
    backgroundColor: PDP_COLORS.white,
    gap: s(10),
  },
  wishlistButton: {
    flex: 1,
    height: s(48),
    borderRadius: s(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(8),
  },
  wishlistButtonActive: {
    backgroundColor: PDP_COLORS.bottomWishlist,
    borderWidth: 1,
    borderColor: PDP_COLORS.bottomWishlistActive,
    shadowColor: PDP_COLORS.bottomWishlist,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  wishlistButtonInactive: {
    backgroundColor: '#FAF7F2',
    borderWidth: 1.2,
    borderColor: '#DFD3C4',
  },
  wishlistTextActive: {
    color: PDP_COLORS.white,
  },
  wishlistTextInactive: {
    color: PDP_COLORS.bottomWishlist,
  },
  bagButton: {
    flex: 1.25,
    height: s(48),
    borderRadius: s(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(10),
  },
  bagButtonActive: {
    backgroundColor: PDP_COLORS.darkGreen,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: PDP_COLORS.darkGreen,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  bagButtonDisabled: {
    backgroundColor: '#EBE6DF',
    borderWidth: 1,
    borderColor: '#DFD9D0',
  },
  bagTextActive: {
    color: PDP_COLORS.white,
  },
  bagTextDisabled: {
    color: '#8E8E8E',
  },
  stepperContainer: {
    flex: 1.25,
    height: s(48),
    borderRadius: s(10),
    backgroundColor: PDP_COLORS.darkGreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(12),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: PDP_COLORS.darkGreen,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  stepBtn: {
    width: s(32),
    height: s(32),
    borderRadius: s(8),
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyLabel: {
    fontFamily: HOME_FONTS.lexendBold,
    fontSize: fs(8.5),
    color: '#DFD7C7',
    letterSpacing: 0.8,
    lineHeight: fs(8.5) * 1.2,
  },
  qtyNumber: {
    fontFamily: HOME_FONTS.lexendBold,
    fontSize: fs(14),
    color: PDP_COLORS.white,
    lineHeight: fs(14) * 1.2,
  },
  btnIcon: {
    marginRight: s(6),
  },
  buttonText: {
    fontFamily: HOME_FONTS.lexendBold,
    fontSize: fs(11.5),
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});

export default ProductActionRow;
