import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { getStyles } from './styles';
import { colors } from '../../assets/theme/colours';

interface AlertButton {
    text: string;
    onPress: () => void;
    style?: 'default' | 'cancel' | 'destructive';
}

interface AlertProps {
    isVisible: boolean;
    title: string;
    message: string;
    buttons: AlertButton[];
    onClose: () => void;
}

const CustomAlert: React.FC<AlertProps> = ({ isVisible, title, message, buttons, onClose }) => {
    const colour = colors;
    const styles = getStyles(colour);
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.alertBox}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <View style={styles.buttonContainer}>
                        {buttons.map((button, index) => (
                            <React.Fragment key={index}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => {
                                        button.onPress();
                                        onClose();
                                    }}
                                >
                                    <Text style={[
                                        styles.buttonText,
                                        button.style === 'destructive' && { color: '#FF3B30' },
                                        button.style === 'cancel' && { fontWeight: 'bold' }
                                    ]}>
                                        {button.text}
                                    </Text>
                                </TouchableOpacity>
                                {index < buttons.length - 1 && <View style={styles.separator} />}
                            </React.Fragment>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CustomAlert;