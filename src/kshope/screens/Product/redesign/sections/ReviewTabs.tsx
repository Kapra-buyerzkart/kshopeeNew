import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-simple-toast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HOME_FONTS, fs, s } from '../../../Home/redesign/theme';
import { PDP_ART } from '../assets';
import {
  ChevronIcon,
  DimensionsIcon,
  DiamondIcon,
  InfoIcon,
  StarSpecIcon,
} from '../icons';
import { PDP_COLORS } from '../theme';
import type {
  JewelleryDetails,
  PriceBreakupItem,
  ReviewEntry,
} from '../data/selectors';

type Spec = {
  id: string;
  label: string;
  value: string;
};

type Props = {
  average: string;
  total: number;
  bars: { star: number; percent: number }[];
  reviews: ReviewEntry[];
  hasRatings: boolean;
  specs: Spec[];
  warranty?: string;
  jewellery?: JewelleryDetails;
  priceBreakup?: {
    price: string;
    mrp: string;
    saved: string;
    percent: number;
  };
  breakupList?: PriceBreakupItem[];
};

const PREVIEW_COUNT = 2;

const Stars: React.FC<{ count: number; size: number }> = ({ count, size }) => {
  if (count <= 0) {
    return null;
  }
  return (
    <View style={styles.starsRow}>
      {Array.from({ length: Math.min(5, Math.round(count)) }).map(
        (_, index) => (
          <Image
            key={index}
            source={PDP_ART.ratingStar}
            resizeMode="contain"
            style={{ width: s(size), height: s(size) }}
          />
        ),
      )}
    </View>
  );
};

const ReviewPanel: React.FC<Props> = ({
  average,
  total,
  bars,
  reviews,
  hasRatings,
}) => {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? reviews : reviews.slice(0, PREVIEW_COUNT);

  if (!hasRatings) {
    return <Text style={styles.empty}>No reviews yet for this product.</Text>;
  }

  return (
    <View style={styles.reviewPanel}>
      <View style={styles.summaryRow}>
        <Text style={styles.average}>{average}</Text>
        <View style={styles.summaryRight}>
          <Text style={styles.ratingCount}>{`${total} Ratings`}</Text>
          <Stars count={Math.round(Number(average))} size={16} />
        </View>
      </View>

      <View style={styles.bars}>
        {bars.map(bar => (
          <View key={bar.star} style={styles.barRow}>
            <Text style={styles.barStar}>{bar.star}</Text>
            <Image
              source={PDP_ART.ratingStar}
              resizeMode="contain"
              style={styles.barStarIcon}
            />
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${bar.percent}%` }]} />
            </View>
            <Text style={styles.barPercent}>{`${bar.percent}%`}</Text>
          </View>
        ))}
      </View>

      {reviews.length > 0 ? (
        <>
          <Text style={styles.reviewCount}>{`${reviews.length} Reviews`}</Text>

          {visible.map(entry => (
            <View key={entry.id} style={styles.reviewRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {entry.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.reviewBody}>
                <View style={styles.reviewHead}>
                  <Text style={styles.reviewName}>{entry.name}</Text>
                  {entry.date ? (
                    <Text style={styles.reviewDate}>{entry.date}</Text>
                  ) : null}
                </View>
                <Stars count={entry.rating} size={9} />
                {entry.comment ? (
                  <Text style={styles.reviewText}>{entry.comment}</Text>
                ) : null}
              </View>
            </View>
          ))}

          {reviews.length > PREVIEW_COUNT ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setExpanded(current => !current)}
              style={styles.seeMore}
            >
              <Text style={styles.seeMoreText}>
                {expanded ? 'See Less' : 'See More'}
              </Text>
              <ChevronIcon
                width={8}
                height={14}
                style={{
                  transform: [{ rotate: expanded ? '-90deg' : '0deg' }],
                }}
              />
            </TouchableOpacity>
          ) : null}
        </>
      ) : null}
    </View>
  );
};

const ProductDetailsPanel: React.FC<{
  specs: Spec[];
  jewellery?: JewelleryDetails;
}> = ({ specs, jewellery }) => {
  const hasGold = Boolean(
    jewellery?.goldPurity || jewellery?.goldType || jewellery?.netWeight,
  );
  const hasDim = Boolean(jewellery?.dimensions || jewellery?.grossWeight);
  const hasDiamond = Boolean(
    jewellery?.hasDiamond &&
      (jewellery?.diamondClarity || jewellery?.diamondWeight),
  );

  return (
    <View style={styles.detailsContainer}>
      {/* 2-column top row */}
      {hasGold || hasDim ? (
        <View style={styles.cardRow}>
          {/* Card 1: Gold */}
          {hasGold ? (
            <View style={[styles.cardHalf, !hasDim && { width: '100%' }]}>
              <View
                style={[styles.cornerArc, { backgroundColor: '#FDF7EB' }]}
              />
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <StarSpecIcon width={12} height={12} color="#A27545" />
                  <Text style={styles.cardHeaderText}>GOLD</Text>
                </View>
                <InfoIcon width={12} height={12} color="#A2A2A2" />
              </View>
              {jewellery?.goldPurity ? (
                <Text style={styles.cardPrimaryVal} numberOfLines={1}>
                  {jewellery.goldPurity}
                </Text>
              ) : null}
              {jewellery?.goldType ? (
                <Text style={styles.cardSubText} numberOfLines={1}>
                  {jewellery.goldType}
                </Text>
              ) : null}
              {jewellery?.netWeight ? (
                <Text style={styles.cardMetaText} numberOfLines={1}>
                  {`${jewellery.netWeight} (Net wt)`}
                </Text>
              ) : null}
            </View>
          ) : null}

          {/* Card 2: Dimensions */}
          {hasDim ? (
            <View style={[styles.cardHalf, !hasGold && { width: '100%' }]}>
              <View
                style={[styles.cornerArc, { backgroundColor: '#EDF5F1' }]}
              />
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <DimensionsIcon width={12} height={12} color="#0C382E" />
                  <Text style={styles.cardHeaderText}>DIMENSIONS</Text>
                </View>
              </View>
              {jewellery?.dimensions ? (
                <Text style={styles.cardPrimaryVal} numberOfLines={1}>
                  {jewellery.dimensions}
                </Text>
              ) : null}
              {jewellery?.grossWeight ? (
                <Text style={styles.cardMetaText} numberOfLines={1}>
                  {`${jewellery.grossWeight} (Gross wt)`}
                </Text>
              ) : null}
            </View>
          ) : null}
        </View>
      ) : null}

      {hasDiamond ? (
        <View style={styles.cardFull}>
          <View style={[styles.cornerArc, { backgroundColor: '#EAF6EF' }]} />
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <DiamondIcon width={13} height={13} color="#0C382E" />
              <Text style={styles.cardHeaderText}>DIAMOND</Text>
            </View>
            <InfoIcon width={12} height={12} color="#A2A2A2" />
          </View>

          <View style={styles.cardFullBody}>
            <View style={styles.cardFullLeft}>
              {jewellery?.diamondClarity ? (
                <Text style={styles.cardPrimaryVal} numberOfLines={1}>
                  {jewellery.diamondClarity}
                </Text>
              ) : null}
              {jewellery?.diamondWeight ? (
                <Text style={styles.cardMetaText} numberOfLines={1}>
                  {`${jewellery.diamondWeight} (Total wt)`}
                </Text>
              ) : null}
            </View>
            <View style={styles.cardFullRight}>
              {jewellery?.diamondSetting ? (
                <Text style={styles.cardRightText}>
                  {jewellery.diamondSetting}
                </Text>
              ) : null}
              {jewellery?.diamondCount ? (
                <Text style={styles.cardRightText}>
                  {jewellery.diamondCount}
                </Text>
              ) : null}
            </View>
          </View>
        </View>
      ) : null}

      {/* Backend Product Specifications List */}
      {specs && specs.length > 0 ? (
        <View style={styles.extraSpecsCard}>
          <Text style={styles.extraSpecsHeading}>SPECIFICATIONS</Text>
          {specs.map((spec, index) => (
            <View
              key={spec.id}
              style={[
                styles.specRow,
                index < specs.length - 1 && styles.specRowBorder,
              ]}
            >
              <Text style={styles.specLabel}>{spec.label}</Text>
              <Text style={styles.specValue}>{spec.value}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {!hasGold && !hasDim && !hasDiamond && (!specs || specs.length === 0) ? (
        <Text style={styles.empty}>Product specifications not available.</Text>
      ) : null}
    </View>
  );
};

const PriceBreakupPanel: React.FC<{
  priceBreakup?: { price: string; mrp: string; saved: string; percent: number };
  jewellery?: JewelleryDetails;
  breakupList?: PriceBreakupItem[];
}> = ({ priceBreakup, jewellery, breakupList = [] }) => {
  const hasDynamicList = Array.isArray(breakupList) && breakupList.length > 0;

  // Deduplicate items with the same componentName (e.g. duplicate "Making Charge")
  const dedupedList = hasDynamicList
    ? breakupList.filter((item, index, arr) =>
        arr.findIndex(i => i.componentName === item.componentName) === index,
      )
    : [];

  if (!hasDynamicList && (!priceBreakup || !priceBreakup.price)) {
    return <Text style={styles.empty}>Price breakup not available.</Text>;
  }

  return (
    <View style={styles.breakupContainer}>
      {hasDynamicList ? (
        dedupedList.map(item => (
          <View key={String(item.breakupId)} style={styles.breakupRow}>
            <Text style={styles.breakupLabel}>{item.componentName}</Text>
            <Text style={styles.breakupVal}>{item.formattedAmount}</Text>
          </View>
        ))
      ) : (
        <>
          <View style={styles.breakupRow}>
            <Text style={styles.breakupLabel}>
              Gold Component ({jewellery?.goldPurity || '18 KT'})
            </Text>
            <Text style={styles.breakupVal}>{priceBreakup?.price}</Text>
          </View>

          {jewellery?.hasDiamond ? (
            <View style={styles.breakupRow}>
              <Text style={styles.breakupLabel}>
                Diamond Component ({jewellery.diamondWeight || '0.25 ct'})
              </Text>
              <Text style={styles.breakupVal}>Included</Text>
            </View>
          ) : null}

          <View style={styles.breakupRow}>
            <Text style={styles.breakupLabel}>
              Making Charges & Craftsmanship
            </Text>
            <Text style={styles.breakupVal}>Included</Text>
          </View>

          <View style={styles.breakupRow}>
            <Text style={styles.breakupLabel}>Applicable GST (3%)</Text>
            <Text style={styles.breakupVal}>Included</Text>
          </View>
        </>
      )}

      {priceBreakup?.mrp ? (
        <View style={styles.breakupRow}>
          <Text style={styles.breakupLabel}>Maximum Retail Price (MRP)</Text>
          <Text style={styles.breakupStrike}>{priceBreakup.mrp}</Text>
        </View>
      ) : null}

      {priceBreakup?.saved ? (
        <View style={styles.breakupRow}>
          <Text style={styles.breakupLabelSavings}>Total Savings</Text>
          <Text style={styles.breakupValSavings}>
            - {priceBreakup.saved} ({priceBreakup.percent}% OFF)
          </Text>
        </View>
      ) : null}

      <View style={styles.breakupDivider} />

      <View style={styles.breakupRowTotal}>
        <Text style={styles.breakupLabelTotal}>Net Payable Amount</Text>
        <Text style={styles.breakupValTotal}>{priceBreakup?.price}</Text>
      </View>
    </View>
  );
};

const BespokePromoCards: React.FC = () => {
  return (
    <View style={styles.bespokeWrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bespokeScroll}
      >
        {/* Card 1: Add Postcards */}
        <View style={styles.bespokeCard}>
          <View style={styles.bespokeHeader}>
            <Text style={styles.bespokeCategory}>BESPOKE GIFTING</Text>
            <View style={styles.arrowCircle}>
              <Ionicons name="arrow-forward" size={13} color="#C5A869" />
            </View>
          </View>
          <Text style={styles.bespokeTitle}>Add Postcards</Text>
          <Text style={styles.bespokeBrand}>by Kapra</Text>

          <View style={styles.bespokeInnerBox}>
            <Text style={styles.bespokeInnerText}>
              Add a video / image with heartfelt message to your Kapra ring and
              make your gift unique with Postcards
            </Text>
            <TouchableOpacity activeOpacity={0.7} style={styles.knowMoreRow}>
              <Text style={styles.knowMoreText}>KNOW MORE</Text>
              <Ionicons name="chevron-forward" size={11} color="#0C382E" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Card 2: Old Gold Exchange */}
        <View style={styles.bespokeCard}>
          <View style={styles.bespokeHeader}>
            <Text style={styles.bespokeCategory}>SUSTAINABLE LUXURY</Text>
            <View style={styles.arrowCircle}>
              <Ionicons name="arrow-forward" size={13} color="#C5A869" />
            </View>
          </View>
          <Text style={styles.bespokeTitle}>Old Gold Exchange</Text>
          <Text style={styles.bespokeBrand}>Program</Text>

          <View style={styles.bespokeInnerBox}>
            <Text style={styles.bespokeInnerText}>
              Exchange your old gold at our stores. It doesn't even have to be
              Kapra jewellery!
            </Text>
            <TouchableOpacity activeOpacity={0.7} style={styles.knowMoreRow}>
              <Text style={styles.knowMoreText}>KNOW MORE</Text>
              <Ionicons name="chevron-forward" size={11} color="#0C382E" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export const ReviewTabs: React.FC<Props> = props => {
  const tabs = ['PRODUCT DETAILS', 'PRICE BREAKUP'];
  if (props.hasRatings) {
    tabs.push('REVIEWS');
  }

  const [active, setActive] = useState(0);

  const handleCopySku = () => {
    if (props.jewellery?.sku) {
      Clipboard.setString(props.jewellery.sku);
      Toast.show('SKU Copied to Clipboard', Toast.SHORT);
    }
  };

  return (
    <View style={styles.wrap}>
      {/* Product Heading & SKU Badge */}
      <View style={styles.productHeaderRow}>
        {/* <Text style={styles.productSerifHeading}>Product</Text> */}
        {/* {props.jewellery?.sku ? (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleCopySku}
            style={styles.skuBadge}
          >
            <Text style={styles.skuBadgeText}>{props.jewellery.sku}</Text>
            <Ionicons
              name="copy-outline"
              size={s(12)}
              color="#0C382E"
              style={{ marginLeft: s(4) }}
            />
          </TouchableOpacity>
        ) : null} */}
      </View>

      {/* Subtitle / summary text */}
      {/* {props.jewellery?.summaryText ? (
        <Text style={styles.productSummaryText}>
          {props.jewellery.summaryText}
        </Text>
      ) : null} */}

      {/* Segmented Tab Buttons */}
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => {
          const isSelected = active === index;
          return (
            <TouchableOpacity
              key={tab}
              activeOpacity={0.85}
              onPress={() => setActive(index)}
              style={[
                styles.tabButton,
                isSelected ? styles.tabButtonActive : styles.tabButtonInactive,
              ]}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  isSelected
                    ? styles.tabButtonTextActive
                    : styles.tabButtonTextInactive,
                ]}
                numberOfLines={1}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Active Tab Panel */}
      <View style={styles.panelContent}>
        {active === 0 ? (
          <ProductDetailsPanel
            specs={props.specs}
            jewellery={props.jewellery}
          />
        ) : null}
        {active === 1 ? (
          <PriceBreakupPanel
            priceBreakup={props.priceBreakup}
            jewellery={props.jewellery}
            breakupList={props.breakupList}
          />
        ) : null}
        {active === 2 && props.hasRatings ? <ReviewPanel {...props} /> : null}
      </View>

      {/* Bespoke / Sustainable Luxury Marketing Cards */}
      {/* <BespokePromoCards /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginTop: s(16),
    paddingHorizontal: s(16),
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: PDP_COLORS.tabInactiveBg,
    borderRadius: s(8),
    padding: s(3),
    gap: s(4),
  },
  tabButton: {
    flex: 1,
    paddingVertical: s(9),
    borderRadius: s(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: PDP_COLORS.tabActiveBg,
  },
  tabButtonInactive: {
    backgroundColor: 'transparent',
  },
  tabButtonText: {
    fontFamily: HOME_FONTS.lexendBold,
    fontSize: fs(10.5),
    letterSpacing: 0.5,
  },
  tabButtonTextActive: {
    color: PDP_COLORS.white,
  },
  tabButtonTextInactive: {
    color: '#4A6158',
  },
  panelContent: {
    paddingTop: s(14),
  },
  empty: {
    fontFamily: HOME_FONTS.lexend,
    fontSize: fs(12),
    color: PDP_COLORS.muted,
    paddingVertical: s(10),
  },

  // Details Cards
  detailsContainer: {
    gap: s(12),
  },
  cardRow: {
    flexDirection: 'row',
    gap: s(12),
  },
  cardHalf: {
    flex: 1,
    backgroundColor: PDP_COLORS.infoCardBg,
    borderWidth: 1,
    borderColor: PDP_COLORS.infoCardBorder,
    borderRadius: s(12),
    padding: s(14),
    position: 'relative',
    overflow: 'hidden',
    minHeight: s(100),
  },
  cardFull: {
    backgroundColor: PDP_COLORS.infoCardBg,
    borderWidth: 1,
    borderColor: PDP_COLORS.infoCardBorder,
    borderRadius: s(12),
    padding: s(14),
    position: 'relative',
    overflow: 'hidden',
  },
  cornerArc: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: s(50),
    height: s(50),
    borderBottomLeftRadius: s(38),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: s(10),
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
  },
  cardHeaderText: {
    fontFamily: HOME_FONTS.lexendBold,
    fontSize: fs(10),
    letterSpacing: 0.6,
    color: '#3B4843',
  },
  cardPrimaryVal: {
    fontFamily: HOME_FONTS.lexendBold,
    fontSize: fs(13.5),
    color: '#1A1A1A',
    marginBottom: s(3),
  },
  cardSubText: {
    fontFamily: HOME_FONTS.lexend,
    fontSize: fs(11),
    color: '#555555',
    marginBottom: s(2),
  },
  cardMetaText: {
    fontFamily: HOME_FONTS.lexend,
    fontSize: fs(10.5),
    color: '#777777',
  },
  cardFullBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardFullLeft: {
    flex: 1,
  },
  cardFullRight: {
    alignItems: 'flex-end',
    gap: s(2),
  },
  cardRightText: {
    fontFamily: HOME_FONTS.lexend,
    fontSize: fs(10.5),
    color: '#666666',
  },
  extraSpecsCard: {
    backgroundColor: PDP_COLORS.infoCardBg,
    borderWidth: 1,
    borderColor: PDP_COLORS.infoCardBorder,
    borderRadius: s(12),
    paddingHorizontal: s(14),
    paddingVertical: s(12),
    marginTop: s(4),
  },
  extraSpecsHeading: {
    fontFamily: HOME_FONTS.lexendBold,
    fontSize: fs(10.5),
    letterSpacing: 0.6,
    color: '#3B4843',
    marginBottom: s(10),
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: s(7),
  },
  specRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F0EBE4',
  },
  specLabel: {
    fontFamily: HOME_FONTS.lexend,
    fontSize: fs(11.5),
    color: '#777777',
  },
  specValue: {
    fontFamily: HOME_FONTS.lexendMedium,
    fontSize: fs(11.5),
    color: '#1A1A1A',
  },

  // Breakup Panel
  breakupContainer: {
    backgroundColor: PDP_COLORS.infoCardBg,
    borderWidth: 1,
    borderColor: PDP_COLORS.infoCardBorder,
    borderRadius: s(12),
    padding: s(16),
    gap: s(10),
  },
  breakupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakupLabel: {
    fontFamily: HOME_FONTS.lexend,
    fontSize: fs(12),
    color: '#555555',
  },
  breakupVal: {
    fontFamily: HOME_FONTS.lexendMedium,
    fontSize: fs(12.5),
    color: '#1A1A1A',
  },
  breakupStrike: {
    fontFamily: HOME_FONTS.lexend,
    fontSize: fs(12),
    color: '#8E8E8E',
    textDecorationLine: 'line-through',
  },
  breakupLabelSavings: {
    fontFamily: HOME_FONTS.lexendMedium,
    fontSize: fs(12),
    color: PDP_COLORS.savingsGreen,
  },
  breakupValSavings: {
    fontFamily: HOME_FONTS.lexendMedium,
    fontSize: fs(12),
    color: PDP_COLORS.savingsGreen,
  },
  breakupDivider: {
    height: 1,
    backgroundColor: '#E5DFD7',
    marginVertical: s(4),
  },
  breakupRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakupLabelTotal: {
    fontFamily: HOME_FONTS.lexendBold,
    fontSize: fs(13),
    color: '#1A1A1A',
  },
  breakupValTotal: {
    fontFamily: HOME_FONTS.lexendBold,
    fontSize: fs(14.5),
    color: PDP_COLORS.darkGreen,
  },

  // Review Panel
  reviewPanel: {
    paddingVertical: s(6),
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  average: {
    fontFamily: HOME_FONTS.lexendBold,
    fontSize: fs(32),
    lineHeight: fs(32) * 1.2,
    color: PDP_COLORS.black,
  },
  summaryRight: {
    alignItems: 'flex-end',
    gap: s(4),
  },
  ratingCount: {
    fontFamily: HOME_FONTS.lexend,
    fontSize: fs(11),
    color: PDP_COLORS.muted,
  },
  starsRow: {
    flexDirection: 'row',
    gap: s(5),
  },
  bars: {
    marginTop: s(14),
    gap: s(10),
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  barStar: {
    fontFamily: HOME_FONTS.lexend,
    fontSize: fs(12),
    color: PDP_COLORS.black,
    width: s(12),
  },
  barStarIcon: {
    width: s(16),
    height: s(16),
  },
  barTrack: {
    flex: 1,
    height: s(4),
    borderRadius: s(10),
    backgroundColor: '#EAEAEA',
    overflow: 'hidden',
  },
  barFill: {
    height: s(4),
    borderRadius: s(10),
    backgroundColor: PDP_COLORS.darkGreen,
  },
  barPercent: {
    fontFamily: HOME_FONTS.lexend,
    fontSize: fs(12),
    color: PDP_COLORS.black,
    width: s(36),
    textAlign: 'right',
  },
  reviewCount: {
    fontFamily: HOME_FONTS.lexendMedium,
    fontSize: fs(13),
    color: PDP_COLORS.black,
    marginTop: s(22),
  },
  reviewRow: {
    flexDirection: 'row',
    gap: s(12),
    marginTop: s(16),
  },
  avatar: {
    width: s(36),
    height: s(36),
    borderRadius: s(18),
    backgroundColor: PDP_COLORS.rule,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: HOME_FONTS.lexendBold,
    fontSize: fs(14),
    color: PDP_COLORS.white,
  },
  reviewBody: {
    flex: 1,
    gap: s(4),
  },
  reviewHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewName: {
    fontFamily: HOME_FONTS.lexendBold,
    fontSize: fs(13),
    color: PDP_COLORS.black,
  },
  reviewDate: {
    fontFamily: HOME_FONTS.lexend,
    fontSize: fs(11),
    color: PDP_COLORS.muted,
  },
  reviewText: {
    fontFamily: HOME_FONTS.lexend,
    fontSize: fs(11.5),
    lineHeight: fs(11.5) * 1.5,
    color: '#555555',
  },
  seeMore: {
    alignSelf: 'center',
    marginTop: s(20),
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    height: s(34),
    paddingHorizontal: s(16),
    borderWidth: 1,
    borderColor: PDP_COLORS.cardBorder,
    borderRadius: s(8),
  },
  seeMoreText: {
    fontFamily: HOME_FONTS.lexendMedium,
    fontSize: fs(11.5),
    color: PDP_COLORS.black,
  },

  // Product Header & SKU Badge
  productHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: s(6),
  },
  productSerifHeading: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(24),
    color: '#0C382E',
    letterSpacing: 0.2,
  },
  skuBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4F0',
    paddingHorizontal: s(8),
    paddingVertical: s(4),
    borderRadius: s(4),
  },
  skuBadgeText: {
    fontFamily: HOME_FONTS.bold,
    fontSize: fs(10),
    color: '#0C382E',
    letterSpacing: 0.5,
  },
  productSummaryText: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(11.5),
    color: '#666666',
    marginBottom: s(14),
    lineHeight: fs(11.5) * 1.4,
  },

  // Bespoke Promo Cards
  bespokeWrap: {
    marginTop: s(24),
    marginHorizontal: -s(16),
  },
  bespokeScroll: {
    paddingHorizontal: s(16),
    gap: s(12),
  },
  bespokeCard: {
    width: s(220),
    backgroundColor: '#0C382E',
    borderRadius: s(14),
    padding: s(14),
  },
  bespokeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: s(8),
  },
  bespokeCategory: {
    fontFamily: HOME_FONTS.lexendBold,
    fontSize: fs(8.5),
    color: '#C5A869',
    letterSpacing: 0.8,
  },
  arrowCircle: {
    width: s(24),
    height: s(24),
    borderRadius: s(12),
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bespokeTitle: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(17),
    color: '#FFFFFF',
    lineHeight: fs(17) * 1.25,
  },
  bespokeBrand: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(12),
    color: '#DFD7C7',
    marginBottom: s(12),
  },
  bespokeInnerBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: s(10),
    padding: s(12),
    minHeight: s(100),
    justifyContent: 'space-between',
  },
  bespokeInnerText: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(9.5),
    lineHeight: fs(9.5) * 1.45,
    color: '#333333',
    marginBottom: s(10),
  },
  knowMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(3),
  },
  knowMoreText: {
    fontFamily: HOME_FONTS.lexendBold,
    fontSize: fs(8.5),
    color: '#0C382E',
    letterSpacing: 0.5,
  },
});

export default ReviewTabs;
