import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { AppIcons } from '../../assets/icons';
import { colors } from '../../assets/theme/colours';
import CONFIG from '../../globals/config';
import FallbackImage from '../FallbackImage';
import { useCommonStyles } from '../../assets/styles';

interface ExploreItemProps {
  item: any;
  onPress: (item: any) => void;
  toggleWishlist: (item: any) => void;
  isInWishlist: (id: any) => boolean;
}

const ExploreItem: React.FC<ExploreItemProps> = ({
  item,
  onPress,
  toggleWishlist,
  isInWishlist,
}) => {
  const styles = useCommonStyles();

  return (
    <TouchableOpacity
      style={styles.exploreItemCard}
      onPress={() => onPress(item)}
    >
      <View style={styles.exploreTopBadgesRow}>
        <View style={styles.discountCircle}>
          <Text style={[styles.discountCircleText]}>
            {item.discountPercent
              ? `-${Math.round(item.discountPercent)}%`
              : item.discountBadge || '0%'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => toggleWishlist(item)}>
          {isInWishlist(item.productId || item.id) ? (
            <AppIcons.BookmarkFilled color={colors.tealIconFont} size={24} />
          ) : (
            <AppIcons.BookmarkOutline color={colors.tealIconFont} size={24} />
          )}
        </TouchableOpacity>
      </View>

      <View style={{ position: 'relative' }}>
        <FallbackImage
          source={
            item.featuredImage
              ? { uri: CONFIG.image_base_url + item.featuredImage }
              : item.image
          }
          style={styles.exploreItemImage}
          resizeMode="contain"
        />
        {(item.stockQty <= 0 || item.stockAvailability === 'Out Of Stock') && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255,255,255,0.6)',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 15,
            }}
          >
            <Text
              style={{
                color: colors.black,
                fontFamily: 'Gilroy-Bold',
                fontSize: 12,
                backgroundColor: 'rgba(255,255,255,0.9)',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              OUT OF STOCK
            </Text>
          </View>
        )}
      </View>

      <View style={{ padding: 10, flex: 1, justifyContent: 'space-between' }}>
        <Text style={[styles.caption]} numberOfLines={3}>
          {item.prName || item.title}
        </Text>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 4,
              gap: 2,
            }}
          >
            <View style={styles.pricePill}>
              <Text style={styles.pricePillText}>
                ₹{item.specialPrice || item.currentPrice}
              </Text>
            </View>
            <Text style={styles.originalPriceText}>
              MRP₹{item.unitPrice || item.originalPrice}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ExploreItem;
