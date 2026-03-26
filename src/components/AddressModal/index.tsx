import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AddressModal = ({ visible, onClose }: any) => (
    <Modal visible={visible} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                <Text>Address Modal Placeholder</Text>
                <TouchableOpacity onPress={onClose}><Text>Close</Text></TouchableOpacity>
            </View>
        </View>
    </Modal>
);
export default AddressModal;
