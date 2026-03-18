import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { getStyles } from './styles';
import { colors } from '../../assets/theme/colours';

interface ListItemProps {
    title: string;
    subtitle?: string;
    leftContent?: React.ReactNode;
    rightContent?: React.ReactNode;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    showSeparator?: boolean;
}

const ListItem: React.FC<ListItemProps> = ({
    title,
    subtitle,
    leftContent,
    rightContent,
    onPress,
    style,
    showSeparator = true,
}) => {
    const colour = colors;
    const styles = getStyles(colour);
    return (
        <>
            <TouchableOpacity
                style={[styles.container, style]}
                onPress={onPress}
                activeOpacity={onPress ? 0.7 : 1}
            >
                {leftContent && <View>{leftContent}</View>}
                <View style={styles.content}>
                    <Text style={styles.title} numberOfLines={1}>{title}</Text>
                    {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
                </View>
                {rightContent && <View style={styles.rightContent}>{rightContent}</View>}
            </TouchableOpacity>
            {showSeparator && <View style={styles.separator} />}
        </>
    );
};

export default ListItem;