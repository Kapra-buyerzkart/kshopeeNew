import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import CachedImage from '../../../../../components/CachedImage';
import { KAPRA_ART } from '../kapraAssets';
import { HOME_FONTS, s, fs } from '../theme';
import KSHOPE_CONFIG from '../../../../globals/config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GUTTER = s(16);
const CARD_GAP = s(8);
const CARD_WIDTH = (SCREEN_WIDTH - GUTTER * 2 - CARD_GAP * 2) / 3;

interface QuickActionCardsProps {
  banners?: any[];
  onBannerPress?: (banner: any) => void;
  onGoldRatePress?: () => void;
  onGoldCoinsPress?: () => void;
  onFindStorePress?: () => void;
}

const resolveBannerSource = (banner?: any) => {
  const raw = banner?.imageUrl || banner?.ImageUrl || banner?.image;
  if (!raw || typeof raw !== 'string') return null;
  return {
    uri: raw.startsWith('http')
      ? raw
      : `${KSHOPE_CONFIG.image_base_url.replace(/\/$/, '')}/${raw.replace(
          /^\//,
          '',
        )}`,
  };
};

const QuickActionCards: React.FC<QuickActionCardsProps> = ({
  banners,
  onBannerPress,
  onGoldRatePress,
  onGoldCoinsPress,
  onFindStorePress,
}) => {
  const [fail0, setFail0] = useState(false);
  const [fail1, setFail1] = useState(false);
  const [fail2, setFail2] = useState(false);

  const banner0 = Array.isArray(banners) ? banners[0] : null;
  const banner1 = Array.isArray(banners) ? banners[1] : null;
  const banner2 = Array.isArray(banners) ? banners[2] : null;

  const source0 = !fail0 ? resolveBannerSource(banner0) : null;
  const source1 = !fail1 ? resolveBannerSource(banner1) : null;
  const source2 = !fail2 ? resolveBannerSource(banner2) : null;

  const handlePress = (banner: any, fallbackPress?: () => void) => {
    if (banner && (banner.linkType || banner.linkValue) && onBannerPress) {
      onBannerPress(banner);
    } else if (fallbackPress) {
      fallbackPress();
    }
  };

  return (
    <View style={styles.container}>
      {/* Card 1: Today's Gold Rate (app_top_3_in_a_row [0]) */}
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        // onPress={() => handlePress(banner0, onGoldRatePress)}
      >
        {source0 ? (
          <CachedImage
            source={source0}
            style={styles.bannerFullImage}
            resizeMode="cover"
            onError={() => setFail0(true)}
          />
        ) : (
          <View style={styles.cardInner}>
            <CachedImage
              source={KAPRA_ART.goldRateBars}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <Text style={styles.eyebrow}>Today's</Text>
              <Text style={styles.title} numberOfLines={1}>
                Gold Rate
              </Text>
              <Text style={styles.linkText} numberOfLines={1}>
                Check latest rate →
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Card 2: Gold Coins (app_top_3_in_a_row [1]) */}
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        // onPress={() => handlePress(banner1, onGoldCoinsPress)}
      >
        {source1 ? (
          <CachedImage
            source={source1}
            style={styles.bannerFullImage}
            resizeMode="cover"
            onError={() => setFail1(true)}
          />
        ) : (
          <View style={styles.cardInner}>
            <CachedImage
              source={KAPRA_ART.goldCoins}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <Text style={styles.title} numberOfLines={1}>
                Gold Coins
              </Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                A lasting value
              </Text>
              <Text style={styles.linkText} numberOfLines={1}>
                Explore →
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Card 3: Find a Store (app_top_3_in_a_row [2]) */}
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        // onPress={() => handlePress(banner2, onFindStorePress)}
      >
        {source2 ? (
          <CachedImage
            source={source2}
            style={styles.bannerFullImage}
            resizeMode="cover"
            onError={() => setFail2(true)}
          />
        ) : (
          <View style={styles.cardInner}>
            <CachedImage
              source={KAPRA_ART.storeFront}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <Text style={styles.title} numberOfLines={1}>
                Find a Store
              </Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                Visit our showroom
              </Text>
              <Text style={styles.linkText} numberOfLines={1}>
                Locate now →
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: GUTTER,
    paddingVertical: s(10),
    gap: CARD_GAP,
    backgroundColor: '#FFFFFF',
  },
  card: {
    flex: 1,
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: '#EFE8DE',
    borderRadius: s(8),
    overflow: 'hidden',
    height: s(66),
    justifyContent: 'center',
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: s(6),
    height: '100%',
  },
  bannerFullImage: {
    width: '100%',
    height: '100%',
  },
  cardImage: {
    width: s(36),
    height: s(36),
    borderRadius: s(6),
    marginRight: s(5),
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  eyebrow: {
    fontSize: fs(7.5),
    fontFamily: HOME_FONTS.regular,
    color: '#767676',
    lineHeight: fs(9),
  },
  title: {
    fontSize: fs(9.5),
    fontFamily: HOME_FONTS.bold,
    color: '#1A1A1A',
    lineHeight: fs(12),
  },
  subtitle: {
    fontSize: fs(7.2),
    fontFamily: HOME_FONTS.regular,
    color: '#767676',
    lineHeight: fs(9),
  },
  linkText: {
    fontSize: fs(7.2),
    fontFamily: HOME_FONTS.semiBold,
    color: '#B68D40',
    marginTop: s(2),
  },
});

export default React.memo(QuickActionCards);
