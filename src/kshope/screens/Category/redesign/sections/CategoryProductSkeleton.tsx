import React from 'react';
import { StyleSheet, View } from 'react-native';
import Shimmer from '../../../../components/atoms/Shimmer';
import { CARD_GAP, SPACE, s } from '../../../Home/redesign/theme';
import { CARD_W } from './ProductCard';

const SKELETON_ITEMS = [1, 2, 3, 4];

const CategoryProductSkeleton: React.FC = () => {
  return (
    <View style={styles.grid}>
      {SKELETON_ITEMS.map(id => (
        <View key={id} style={styles.card}>
          <Shimmer
            width={CARD_W}
            height={CARD_W * 0.92}
            radius={s(12)}
            style={styles.imageBox}
          />
          <Shimmer
            width={CARD_W * 0.75}
            height={s(12)}
            radius={s(4)}
            style={styles.titleLine}
          />
          <Shimmer
            width={CARD_W * 0.45}
            height={s(14)}
            radius={s(4)}
            style={styles.priceLine}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: CARD_GAP,
    paddingTop: SPACE.sm,
  },
  card: {
    width: CARD_W,
    marginBottom: SPACE.md,
  },
  imageBox: {
    marginBottom: s(8),
  },
  titleLine: {
    marginBottom: s(6),
  },
  priceLine: {
    marginTop: s(2),
  },
});

export default React.memo(CategoryProductSkeleton);
