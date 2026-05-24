import React from 'react';
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../assets/theme/colours';
import { styles } from './styles';

interface CustomGradientButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

const CustomGradientButton: React.FC<CustomGradientButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  icon,
  disabled = false,
  loading = false,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.container, disabled && styles.disabled, style]}
    >
      <LinearGradient
        colors={[colors.tealButton || '#FF6A00', colors.themeTeal || '#F25000']}
        start={{ x: 0.1, y: 1 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <>
            {icon}
            <Text style={[styles.text, textStyle]}>{title}</Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default CustomGradientButton;
