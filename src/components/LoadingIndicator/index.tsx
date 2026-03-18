import React from 'react';
import { Modal, View, ActivityIndicator } from 'react-native';
import { getStyles } from './styles';
import { colors } from '../../assets/theme/colours';

interface LoadingIndicatorProps {
    isVisible: boolean;
    size?: 'small' | 'large';
    color?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
    isVisible,
    size = 'large',
    color = colors.primary,
}) => {
    const colour = colors;
    const styles = getStyles(colour);
    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={isVisible}
            onRequestClose={() => { }} // Prevents closing on Android back button
        >
            <View style={styles.container}>
                <View style={styles.indicatorContainer}>
                    <ActivityIndicator size={size} color={color} />
                </View>
            </View>
        </Modal>
    );
};

export default LoadingIndicator;