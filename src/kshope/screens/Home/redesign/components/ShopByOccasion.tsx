import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CachedImage from '../../../../../components/CachedImage';
import { OccasionTile } from '../content';
import { HOME_FONTS, s, fs } from '../theme';
import { Fonts } from '../../../../theme/fonts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GUTTER = s(16);
const GAP = s(9);
const CARD_WIDTH = (SCREEN_WIDTH - GUTTER * 2 - GAP * 3) / 4;

interface ShopByOccasionProps {
  title?: string;
  occasions?: OccasionTile[];
  categories?: any[];
  onSelectCategory?: (category: any) => void;
  onSelectOccasion?: (occasion: OccasionTile) => void;
  onViewAll?: () => void;
}

const ShopByOccasion: React.FC<ShopByOccasionProps> = ({
  title = 'Shop by occasion',
  occasions,
  onSelectOccasion,
  onViewAll,
}) => {
  const items = occasions && occasions.length > 0 ? occasions.slice(0, 4) : [];

  if (items.length === 0) {
    return null;
  }

  const handlePress = (item: OccasionTile) => {
    if (onSelectOccasion) {
      onSelectOccasion(item);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity
          style={styles.viewAllBtn}
          activeOpacity={0.7}
          onPress={onViewAll}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="chevron-forward" size={16} color="#0C382E" style={styles.chevron} />
        </TouchableOpacity>
      </View>

      {/* 4 Cards Grid */}
      <View style={styles.grid}>
        {items.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.88}
            onPress={() => handlePress(item)}
          >
            <View style={styles.imageBox}>
              <CachedImage
                source={item.image}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
            <View style={styles.labelContainer}>
              <Text style={styles.label} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
                {item.label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
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
  grid: {
    flexDirection: 'row',
    paddingHorizontal: GUTTER,
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#EFE5DA',
    borderRadius: s(12),
    overflow: 'hidden',
  },
  imageBox: {
    width: '100%',
    height: CARD_WIDTH * 0.95,
    overflow: 'hidden',
    backgroundColor: '#F5ECE3',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  labelContainer: {
    paddingVertical: s(8),
    paddingHorizontal: s(3),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFE5DA',
  },
  label: {
    fontSize: fs(11),
    fontFamily: Fonts.lexend.medium || HOME_FONTS.lexendMedium,
    color: '#0C382E',
    textAlign: 'center',
  },
});

export default React.memo(ShopByOccasion);

