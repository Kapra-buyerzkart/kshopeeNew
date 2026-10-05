import React from 'react';
import { ImageProps, ImageStyle, StyleProp } from 'react-native';

export interface CachedImageProps extends Omit<ImageProps, 'source' | 'style'> {
  source: any;
  style?: StyleProp<ImageStyle>;
  resizeMode?: 'fill' | 'contain' | 'cover' | 'center' | string;
  cachePolicy?: 'discWithCacheControl' | 'memory' | 'discNoCacheControl';
  priority?: 'low' | 'normal' | 'high';
  transitionDuration?: number;
  headers?: Record<string, string>;
  onLoad?: (event: any) => void;
  onError?: (event: any) => void;
  accessible?: boolean;
  accessibilityLabel?: string;
  children?: React.ReactNode;
}

export const prefetch: (urls: string[]) => void;
export const clearCache: () => Promise<void>;
export const CachedImageBackground: React.FC<CachedImageProps & { imageStyle?: StyleProp<ImageStyle> }>;

declare const CachedImage: React.NamedExoticComponent<CachedImageProps>;
export default CachedImage;
