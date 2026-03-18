import React from 'react';
import { View, Text, SafeAreaView, StyleProp, ViewStyle } from 'react-native';
import { colors } from '../../assets/theme/colours';
import { getStyles } from './styles';


interface HeaderProps {
    title: string;
    leftContent?: React.ReactNode;
    rightContent?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

const Header: React.FC<HeaderProps> = ({ title, leftContent, rightContent, style }) => {
    const colour = colors;
    const styles = getStyles(colour);
    return (
        <SafeAreaView style={{ backgroundColor: styles.container.backgroundColor }}>
            <View style={[styles.container, style]}>
                {leftContent ? (
                    <View style={styles.sideContent}>{leftContent}</View>
                ) : (
                    <View style={styles.leftSpacer} />
                )}
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                {rightContent ? (
                    <View style={styles.sideContent}>{rightContent}</View>
                ) : (
                    <View style={styles.rightSpacer} />
                )}
            </View>
        </SafeAreaView>
    );
};

export default Header;