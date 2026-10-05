import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { HOME_FONTS, fs, s } from '../theme';

const TICKER_ITEMS = [
  'Certified 100% BIS Hallmarked Jewellery',
  'Free Insured Express Delivery across India',
  '15-Day Easy Returns & Exchange',
  'Lifetime Exchange & Buyback Guarantee',
  '100% Certified Natural Diamonds',
];

const SPEED_PX_PER_SEC = 38;
const ESTIMATED_WIDTH = TICKER_ITEMS.length * s(280);

const MarqueeTicker: React.FC = () => {
  const [contentWidth, setContentWidth] = useState(ESTIMATED_WIDTH);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (contentWidth <= 0) return;

    if (animationRef.current) {
      animationRef.current.stop();
    }

    animatedValue.setValue(0);
    const duration = (contentWidth / SPEED_PX_PER_SEC) * 1000;

    const anim = Animated.loop(
      Animated.timing(animatedValue, {
        toValue: -contentWidth,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animationRef.current = anim;
    anim.start();

    return () => {
      anim.stop();
    };
  }, [contentWidth, animatedValue]);

  const renderTickerList = (isMeasure = false) => (
    <View
      style={styles.tickerRow}
      onLayout={
        isMeasure
          ? e => {
              const width = Math.ceil(e.nativeEvent.layout.width);
              if (width > 50 && Math.abs(width - contentWidth) > 5) {
                setContentWidth(width);
              }
            }
          : undefined
      }
    >
      {TICKER_ITEMS.map((item, index) => (
        <View key={index} style={styles.tickerGroup}>
          <View style={styles.dot} />
          <Text style={styles.tickerText} numberOfLines={1}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.movingTrack,
          {
            transform: [{ translateX: animatedValue }],
          },
        ]}
      >
        {renderTickerList(true)}
        {renderTickerList(false)}
        {renderTickerList(false)}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#082B22',
    paddingVertical: s(10),
    marginVertical: s(12),
    overflow: 'hidden',
    width: '100%',
  },
  movingTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  tickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  tickerGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: s(28),
    flexShrink: 0,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D4AF37',
    marginRight: s(8),
  },
  tickerText: {
    fontSize: fs(10.5),
    fontFamily: HOME_FONTS.medium,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

export default React.memo(MarqueeTicker);
