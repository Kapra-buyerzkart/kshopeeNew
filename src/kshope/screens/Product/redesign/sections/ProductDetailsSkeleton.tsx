import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shimmer } from '../../../../components/atoms';
import { PDP_COLORS } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const s = (n: number) => (n / 390) * SCREEN_WIDTH;

const SPEC_PILLS = [0, 1, 2];
const REVIEW_BARS = [0, 1, 2, 3, 4];
const SIMILAR = [0, 1, 2];

const ProductDetailsSkeleton: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Gallery placeholder */}
      <Shimmer
        width={SCREEN_WIDTH}
        height={s(390)}
        radius={0}
      />

      {/* Back button circle */}
      <View style={styles.backBtn}>
        <Shimmer width={s(36)} height={s(36)} radius={s(18)} />
      </View>

      {/* Wishlist heart circle */}
      <View style={styles.heartBtn}>
        <Shimmer width={s(36)} height={s(36)} radius={s(18)} />
      </View>

      <View style={styles.body}>
        {/* Price header */}
        <View style={styles.priceSection}>
          <Shimmer width="75%" height={s(20)} radius={4} />
          <View style={styles.gap8} />
          <Shimmer width="45%" height={s(14)} radius={4} />
          <View style={styles.gap12} />

          <View style={styles.priceRow}>
            <Shimmer width={s(120)} height={s(24)} radius={4} />
            <View style={{ width: s(12) }} />
            <Shimmer width={s(80)} height={s(16)} radius={4} />
            <View style={{ width: s(12) }} />
            <Shimmer width={s(70)} height={s(22)} radius={s(11)} />
          </View>

          <View style={styles.gap8} />
          <View style={styles.ratingRow}>
            <Shimmer width={s(80)} height={s(14)} radius={4} />
            <View style={{ width: s(8) }} />
            <Shimmer width={s(60)} height={s(14)} radius={4} />
          </View>

          <View style={styles.gap12} />
          <Shimmer width={s(140)} height={s(28)} radius={s(14)} />
        </View>

        {/* Spec details row (pills) */}
        <View style={styles.specsSection}>
          <View style={styles.pillRow}>
            {SPEC_PILLS.map(i => (
              <Shimmer
                key={i}
                width={s(100)}
                height={s(36)}
                radius={s(8)}
                style={styles.pill}
              />
            ))}
          </View>
        </View>

        {/* Action row (wishlist + add to bag) */}
        <View style={styles.actionRow}>
          <Shimmer width={s(160)} height={s(48)} radius={s(24)} />
          <Shimmer width={s(160)} height={s(48)} radius={s(24)} />
        </View>

        {/* Product info section */}
        <View style={styles.infoSection}>
          <Shimmer width={s(100)} height={s(16)} radius={4} />
          <View style={styles.gap8} />
          <Shimmer width="100%" height={s(12)} radius={4} />
          <View style={styles.gap6} />
          <Shimmer width="100%" height={s(12)} radius={4} />
          <View style={styles.gap6} />
          <Shimmer width="70%" height={s(12)} radius={4} />
        </View>

        {/* Review tabs section */}
        <View style={styles.tabsSection}>
          <View style={styles.tabRow}>
            <Shimmer width={s(120)} height={s(38)} radius={s(19)} />
            <View style={{ width: s(10) }} />
            <Shimmer width={s(120)} height={s(38)} radius={s(19)} />
            <View style={{ width: s(10) }} />
            <Shimmer width={s(100)} height={s(38)} radius={s(19)} />
          </View>

          <View style={styles.gap16} />

          {/* Rating bars skeleton */}
          <View style={styles.ratingBarsWrap}>
            <Shimmer width={s(44)} height={s(44)} radius={s(22)} style={styles.ratingCircle} />
            <View style={styles.barsCol}>
              {REVIEW_BARS.map(i => (
                <Shimmer
                  key={i}
                  width="100%"
                  height={s(8)}
                  radius={4}
                  style={styles.bar}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Trust strip */}
        <View style={styles.trustRow}>
          {[0, 1, 2].map(i => (
            <Shimmer key={i} width={s(100)} height={s(50)} radius={s(8)} />
          ))}
        </View>

        {/* Similar products */}
        <View style={styles.similarSection}>
          <Shimmer width={s(140)} height={s(18)} radius={4} />
          <View style={styles.gap12} />
          <View style={styles.similarRow}>
            {SIMILAR.map(i => (
              <View key={i} style={styles.similarCard}>
                <Shimmer width="100%" height={s(140)} radius={s(10)} />
                <View style={styles.gap8} />
                <Shimmer width="80%" height={s(12)} radius={4} />
                <View style={styles.gap6} />
                <Shimmer width="50%" height={s(12)} radius={4} />
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PDP_COLORS.white,
  },
  backBtn: {
    position: 'absolute',
    top: s(50),
    left: s(16),
    zIndex: 10,
  },
  heartBtn: {
    position: 'absolute',
    top: s(50),
    right: s(16),
    zIndex: 10,
  },
  body: {
    paddingHorizontal: s(16),
    paddingTop: s(16),
  },
  priceSection: {},
  gap6: { height: s(6) },
  gap8: { height: s(8) },
  gap12: { height: s(12) },
  gap16: { height: s(16) },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  specsSection: {
    marginTop: s(20),
    paddingVertical: s(12),
    backgroundColor: PDP_COLORS.specsBg,
    borderRadius: s(12),
    paddingHorizontal: s(12),
  },
  pillRow: {
    flexDirection: 'row',
  },
  pill: {
    marginRight: s(10),
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: s(20),
  },
  infoSection: {
    marginTop: s(24),
    padding: s(16),
    borderRadius: s(12),
    borderWidth: 1,
    borderColor: PDP_COLORS.infoCardBorder,
  },
  tabsSection: {
    marginTop: s(24),
  },
  tabRow: {
    flexDirection: 'row',
  },
  ratingBarsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingCircle: {
    marginRight: s(16),
  },
  barsCol: {
    flex: 1,
  },
  bar: {
    marginBottom: s(6),
  },
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: s(24),
  },
  similarSection: {
    marginTop: s(24),
    paddingBottom: s(60),
  },
  similarRow: {
    flexDirection: 'row',
  },
  similarCard: {
    width: s(120),
    marginRight: s(12),
  },
});

export default ProductDetailsSkeleton;
