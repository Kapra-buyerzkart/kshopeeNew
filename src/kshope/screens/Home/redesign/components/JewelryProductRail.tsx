import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ProductTile } from '../content';
import JewelryProductCard from './JewelryProductCard';
import { HOME_FONTS, s, fs } from '../theme';
import { Fonts } from '../../../../theme/fonts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GUTTER = s(16);
const CARD_GAP = s(12);
const CARD_WIDTH = Math.round((SCREEN_WIDTH - GUTTER * 2 - CARD_GAP) / 2.3);

interface JewelryProductRailProps {
  title: string;
  items: ProductTile[];
  wishlisted?: string[];
  compact?: boolean;
  onPressProduct?: (item: ProductTile) => void;
  onToggleWishlist?: (item: ProductTile) => void;
  onViewAll?: () => void;
}

const JewelryProductRail: React.FC<JewelryProductRailProps> = ({
  title,
  items,
  wishlisted = [],
  compact = false,
  onPressProduct,
  onToggleWishlist,
  onViewAll,
}) => {
  const effectiveCardWidth = compact
    ? Math.round((SCREEN_WIDTH - GUTTER * 2 - CARD_GAP * 2) / 3)
    : CARD_WIDTH;

  const renderItem = useCallback(
    ({ item }: { item: ProductTile }) => (
      <JewelryProductCard
        item={item}
        width={effectiveCardWidth}
        compact={compact}
        isWishlisted={wishlisted.includes(item.id)}
        onPress={onPressProduct}
        onToggleWishlist={onToggleWishlist}
      />
    ),
    [effectiveCardWidth, compact, wishlisted, onPressProduct, onToggleWishlist],
  );

  const keyExtractor = useCallback((item: ProductTile) => item.id, []);

  const ItemSeparator = useCallback(
    () => <View style={{ width: CARD_GAP }} />,
    [],
  );

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        {onViewAll ? (
          <TouchableOpacity
            style={styles.viewAllBtn}
            activeOpacity={0.7}
            onPress={onViewAll}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color="#0C382E"
              style={styles.chevron}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Horizontal Rail */}
      <FlatList
        horizontal
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparator}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.railContent}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={3}
        removeClippedSubviews={Platform.OS === 'android'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: s(16),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: GUTTER,
    marginBottom: s(14),
  },
  title: {
    fontSize: fs(26),
    fontFamily: Fonts.cormorantGaramond.medium || HOME_FONTS.medium,
    color: '#08281E',
    letterSpacing: 0.1,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  viewAllText: {
    fontSize: fs(13.5),
    fontFamily: Fonts.lexend.medium || HOME_FONTS.lexendMedium,
    color: '#0C382E',
  },
  chevron: {
    marginTop: 1,
  },
  railContent: {
    paddingHorizontal: GUTTER,
  },
});

export default React.memo(JewelryProductRail);
