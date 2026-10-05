import React from 'react';
import { ViewStyle, ImageSourcePropType, StyleProp } from 'react-native';

export interface TroubleshootingItem {
  icon: string;
  title: string;
  description: string;
}

export interface NoNetworkFoundProps {
  title?: string;
  message?: string;
  badgeText?: string;
  imageSource?: ImageSourcePropType;
  onRetry?: () => void | Promise<any>;
  isRetrying?: boolean;
  retryButtonText?: string;
  secondaryButtonText?: string;
  onSecondaryAction?: () => void;
  showTroubleshooting?: boolean;
  troubleshootingItems?: TroubleshootingItem[];
  isFullScreen?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export declare const LUXURY_THEME: {
  canvas: string;
  card: string;
  emerald: string;
  emeraldDeep: string;
  emeraldLight: string;
  emeraldTint: string;
  gold: string;
  goldMetallic: string;
  goldLight: string;
  goldTint: string;
  goldBorder: string;
  border: string;
  borderLight: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textFaint: string;
  white: string;
  shadow: string;
};

declare const NoNetworkFound: React.FC<NoNetworkFoundProps>;
export default NoNetworkFound;
