import React from 'react';
import { Modal, View, StyleProp, ViewStyle, TouchableWithoutFeedback } from 'react-native';
import { getStyles } from './styles';
import { colors } from '../../assets/theme/colours';

interface ModalProps {
    isVisible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

const CustomModal: React.FC<ModalProps> = ({ isVisible, onClose, children, style }) => {
    const colour = colors;
    const styles = getStyles(colour);
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.centeredView}>
                    <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                        <View style={[styles.modalView, style]}>
                            {children}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default CustomModal;