import React from 'react';
import { View, StyleSheet, FlexAlignType } from 'react-native';
import AppText from './AppText';
import { UITypeVariant, UI_SPACING } from '../../theme/tokens';
import { Fonts } from '../../theme/fonts';

export interface PriceBlockProps {
  price: number | string;
  mrp?: number | string | null;
  align?: FlexAlignType;
  variant?: UITypeVariant;
}

const formatPriceValue = (val: number | string | null | undefined): string => {
  if (val == null || val === '') return '';
  const clean = String(val).replace(/,/g, '').trim();
  const num = parseFloat(clean);
  if (!Number.isFinite(num)) return String(val);
  return Number.isInteger(num)
    ? num.toLocaleString('en-IN')
    : num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const PriceBlock: React.FC<PriceBlockProps> = ({
  price,
  mrp,
  align = 'flex-end',
  variant = 'price',
}) => {
  const hasStrike = mrp != null && Number(mrp) > Number(price);

  return (
    <View style={[styles.wrap, { alignItems: align }]}>
      <AppText variant={variant}>₹{formatPriceValue(price)}</AppText>
      {hasStrike ? (
        <AppText variant="micro" tone="faint" style={styles.strike}>
          ₹{formatPriceValue(mrp)}
        </AppText>
      ) : null}
    </View>
  );
};

export default React.memo(PriceBlock);

const styles = StyleSheet.create({
  wrap: {
    gap: 1,
  },
  strike: {
    fontFamily: Fonts.lexend.regular,
    textDecorationLine: 'line-through',
    marginTop: UI_SPACING.xs / 2,
  },
});
