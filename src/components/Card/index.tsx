import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { getStyles } from './styles';
import { colors } from '../../assets/theme/colours';

interface CardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

const Card: React.FC<CardProps> = ({ children, style }) => {
    const colour = colors;
    const styles = getStyles(colour);
    return (
        <View style={[styles.card, style]}>
            {children}
        </View>
    );
};

export default Card;