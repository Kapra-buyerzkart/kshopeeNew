import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import images from '../assets/images';
import { FONTS } from '../styles/typography';

export const LUXURY_THEME = {
  canvas: '#FAF9F6',
  card: '#FFFFFF',
  emerald: '#0C382E',
  emeraldDeep: '#082821',
  emeraldLight: '#164E40',
  emeraldTint: '#E8F2EE',
  gold: '#B68D40',
  goldMetallic: '#C5A869',
  goldLight: '#F3DFBF',
  goldTint: '#FAF5EE',
  goldBorder: '#EFE7DB',
  border: '#ECEAE5',
  borderLight: '#F3F1ED',
  textPrimary: '#1A1A1A',
  textSecondary: '#4A4A4A',
  textMuted: '#757575',
  textFaint: '#A0A0A0',
  white: '#FFFFFF',
  shadow: '#0C382E',
};

const DEFAULT_TROUBLESHOOTING = [
  {
    icon: 'wifi-outline',
    title: 'Wi-Fi & Cellular Data',
    description: 'Ensure Wi-Fi or mobile data is turned on and active',
  },
  {
    icon: 'airplane-outline',
    title: 'Airplane Mode',
    description: 'Check that Airplane Mode is turned off on your device',
  },
  {
    icon: 'refresh-outline',
    title: 'Signal Strength',
    description: 'Move to an area with stronger network reception',
  },
];

const NoNetworkFound = ({
  title = 'Connection Temporarily Lost',
  message = 'We are unable to connect to the Kapra network. Please verify your internet settings and try again.',
  badgeText = 'OFFLINE MODE',
  imageSource,
  onRetry,
  isRetrying: externalIsRetrying,
  retryButtonText = 'Retry Connection',
  secondaryButtonText,
  onSecondaryAction,
  showTroubleshooting = true,
  troubleshootingItems = DEFAULT_TROUBLESHOOTING,
  isFullScreen = true,
  style,
  contentContainerStyle,
}) => {
  const [internalIsRetrying, setInternalIsRetrying] = useState(false);
  const isRetrying = externalIsRetrying !== undefined ? externalIsRetrying : internalIsRetrying;

  // Pulse ring animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ringOpacity = useRef(new Animated.Value(0.4)).current;
  // Spin animation for retry icon
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 2200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(ringOpacity, {
            toValue: 0.15,
            duration: 2200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(ringOpacity, {
            toValue: 0.4,
            duration: 2200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    pulse.start();

    return () => pulse.stop();
  }, [pulseAnim, ringOpacity]);

  useEffect(() => {
    let spinAnim;
    if (isRetrying) {
      spinAnim = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );
      spinAnim.start();
    } else {
      spinValue.setValue(0);
    }

    return () => spinAnim && spinAnim.stop();
  }, [isRetrying, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleRetryPress = async () => {
    if (isRetrying || !onRetry) return;
    try {
      setInternalIsRetrying(true);
      const result = onRetry();
      if (result && typeof result.then === 'function') {
        await result;
      }
    } catch (err) {
      // Handled by caller
    } finally {
      setInternalIsRetrying(false);
    }
  };

  const resolvedImageSource =
    imageSource || images.noNetwork || require('../assets/images/noimages/luxury_no_network.jpg');

  const content = (
    <ScrollView
      showsVerticalScrollIndicator={false}
      bounces={false}
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
    >
      {/* Top Luxury Badge */}
      {badgeText ? (
        <View style={styles.badgeWrapper}>
          <View style={styles.badgeLine} />
          <View style={styles.badgeContainer}>
            <MaterialCommunityIcons
              name="diamond-stone"
              size={wp('3.2%')}
              color={LUXURY_THEME.goldMetallic}
              style={styles.badgeIcon}
            />
            <Text style={styles.badgeText}>{badgeText}</Text>
          </View>
          <View style={styles.badgeLine} />
        </View>
      ) : null}

      {/* Luxury Diamond Artwork Frame */}
      <View style={styles.artSection}>
        <Animated.View
          style={[
            styles.pulseRing,
            {
              transform: [{ scale: pulseAnim }],
              opacity: ringOpacity,
            },
          ]}
        />
        <View style={styles.imageCard}>
          <Image
            source={resolvedImageSource}
            style={styles.artworkImage}
            resizeMode="cover"
          />
          <View style={styles.innerGlowRing} />
        </View>
      </View>

      {/* Main Titles */}
      <View style={styles.textSection}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.messageText}>{message}</Text>
      </View>

      {/* Troubleshooting Tips Card */}
      {showTroubleshooting && troubleshootingItems?.length > 0 && (
        <View style={styles.troubleshootingCard}>
          <View style={styles.troubleshootHeader}>
            <Feather
              name="help-circle"
              size={wp('3.8%')}
              color={LUXURY_THEME.goldMetallic}
            />
            <Text style={styles.troubleshootHeaderText}>
              Quick Connectivity Tips
            </Text>
          </View>

          {troubleshootingItems.map((item, index) => (
            <View
              key={index}
              style={[
                styles.troubleshootItem,
                index === troubleshootingItems.length - 1 && styles.lastItem,
              ]}
            >
              <View style={styles.itemIconCircle}>
                <Ionicons
                  name={item.icon}
                  size={wp('4%')}
                  color={LUXURY_THEME.emerald}
                />
              </View>
              <View style={styles.itemTextContainer}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDesc}>{item.description}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsSection}>
        {onRetry && (
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={handleRetryPress}
            disabled={isRetrying}
            style={[styles.primaryButton, isRetrying && styles.primaryButtonDisabled]}
          >
            {isRetrying ? (
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <Ionicons
                  name="reload-outline"
                  size={wp('5%')}
                  color={LUXURY_THEME.goldLight}
                />
              </Animated.View>
            ) : (
              <Ionicons
                name="refresh-outline"
                size={wp('5%')}
                color={LUXURY_THEME.goldLight}
                style={styles.buttonIcon}
              />
            )}
            <Text style={styles.primaryButtonText}>
              {isRetrying ? 'Checking Network...' : retryButtonText}
            </Text>
          </TouchableOpacity>
        )}

        {secondaryButtonText && onSecondaryAction && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onSecondaryAction}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>{secondaryButtonText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );

  if (isFullScreen) {
    return (
      <SafeAreaView style={[styles.fullScreenContainer, style]}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={LUXURY_THEME.canvas}
          translucent={false}
        />
        {content}
      </SafeAreaView>
    );
  }

  return <View style={[styles.inlineContainer, style]}>{content}</View>;
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: LUXURY_THEME.canvas,
  },
  inlineContainer: {
    flex: 1,
    backgroundColor: LUXURY_THEME.canvas,
    width: '100%',
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('3%'),
  },
  badgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2.5%'),
    width: '100%',
    justifyContent: 'center',
  },
  badgeLine: {
    flex: 1,
    height: 1,
    backgroundColor: LUXURY_THEME.goldBorder,
    opacity: 0.6,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('3.5%'),
    paddingVertical: hp('0.6%'),
    borderRadius: wp('5%'),
    backgroundColor: LUXURY_THEME.goldTint,
    borderWidth: 1,
    borderColor: LUXURY_THEME.goldBorder,
    marginHorizontal: wp('3%'),
  },
  badgeIcon: {
    marginRight: wp('1.2%'),
  },
  badgeText: {
    fontFamily: FONTS.lexend?.medium || FONTS.gilroy?.medium || 'System',
    fontSize: wp('2.8%'),
    color: LUXURY_THEME.goldMetallic,
    letterSpacing: 1.2,
    fontWeight: '600',
  },
  artSection: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('3%'),
  },
  pulseRing: {
    position: 'absolute',
    width: wp('58%'),
    height: wp('58%'),
    borderRadius: wp('29%'),
    borderWidth: 1.5,
    borderColor: LUXURY_THEME.goldMetallic,
  },
  imageCard: {
    width: wp('50%'),
    height: wp('50%'),
    borderRadius: wp('25%'),
    backgroundColor: LUXURY_THEME.card,
    borderWidth: 2,
    borderColor: LUXURY_THEME.goldMetallic,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: LUXURY_THEME.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.14,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  artworkImage: {
    width: '100%',
    height: '100%',
  },
  innerGlowRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: wp('25%'),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  textSection: {
    alignItems: 'center',
    marginBottom: hp('3%'),
    paddingHorizontal: wp('2%'),
  },
  titleText: {
    fontFamily: FONTS.cormorantGaramond?.bold || FONTS.default?.bold || 'System',
    fontSize: wp('6.2%'),
    color: LUXURY_THEME.emeraldDeep,
    textAlign: 'center',
    letterSpacing: 0.4,
    marginBottom: hp('1%'),
  },
  messageText: {
    fontFamily: FONTS.lexend?.regular || FONTS.gilroy?.regular || 'System',
    fontSize: wp('3.6%'),
    color: LUXURY_THEME.textSecondary,
    textAlign: 'center',
    lineHeight: hp('2.5%'),
    paddingHorizontal: wp('4%'),
  },
  troubleshootingCard: {
    width: '100%',
    backgroundColor: LUXURY_THEME.card,
    borderRadius: wp('4%'),
    padding: wp('4%'),
    borderWidth: 1,
    borderColor: LUXURY_THEME.border,
    marginBottom: hp('3%'),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  troubleshootHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
    paddingBottom: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: LUXURY_THEME.borderLight,
  },
  troubleshootHeaderText: {
    fontFamily: FONTS.lexend?.medium || FONTS.gilroy?.medium || 'System',
    fontSize: wp('3.2%'),
    color: LUXURY_THEME.goldMetallic,
    marginLeft: wp('1.8%'),
    letterSpacing: 0.4,
    fontWeight: '600',
  },
  troubleshootItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('0.9%'),
  },
  lastItem: {
    paddingBottom: 0,
  },
  itemIconCircle: {
    width: wp('8.5%'),
    height: wp('8.5%'),
    borderRadius: wp('4.25%'),
    backgroundColor: LUXURY_THEME.emeraldTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('3%'),
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontFamily: FONTS.lexend?.medium || FONTS.gilroy?.medium || 'System',
    fontSize: wp('3.3%'),
    color: LUXURY_THEME.textPrimary,
    marginBottom: 2,
  },
  itemDesc: {
    fontFamily: FONTS.lexend?.regular || FONTS.gilroy?.light || 'System',
    fontSize: wp('2.9%'),
    color: LUXURY_THEME.textMuted,
    lineHeight: hp('1.8%'),
  },
  actionsSection: {
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LUXURY_THEME.emerald,
    borderRadius: wp('3%'),
    paddingVertical: hp('1.8%'),
    borderWidth: 1,
    borderColor: LUXURY_THEME.goldMetallic,
    ...Platform.select({
      ios: {
        shadowColor: LUXURY_THEME.emerald,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  primaryButtonDisabled: {
    opacity: 0.85,
  },
  buttonIcon: {
    marginRight: wp('2%'),
  },
  primaryButtonText: {
    fontFamily: FONTS.lexend?.semiBold || FONTS.gilroy?.bold || 'System',
    fontSize: wp('3.8%'),
    color: LUXURY_THEME.goldLight,
    letterSpacing: 0.6,
  },
  secondaryButton: {
    marginTop: hp('1.5%'),
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
  },
  secondaryButtonText: {
    fontFamily: FONTS.lexend?.medium || FONTS.gilroy?.medium || 'System',
    fontSize: wp('3.4%'),
    color: LUXURY_THEME.textMuted,
    textDecorationLine: 'underline',
  },
});

export default NoNetworkFound;
