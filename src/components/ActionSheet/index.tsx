import React from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';
import { getStyles } from './styles';
import { colors } from '../../assets/theme/colours';

interface ActionSheetProps {
    isVisible: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const ActionSheet: React.FC<ActionSheetProps> = ({
    isVisible,
    onClose,
    children
}) => {
    const colour = colors;
    const styles = getStyles(colour);
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            {/* Tappable backdrop to close the sheet */}
            <TouchableOpacity
                style={styles.container}
                activeOpacity={1}
                onPress={onClose}
            >
                {/* The action sheet container, which stops the backdrop tap from propagating */}
                <View style={styles.sheet} onTouchStart={(e) => e.stopPropagation()}>
                    {children}
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

export default ActionSheet;