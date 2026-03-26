import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';

const AddressConfirmationModal = ({ visible, onClose }: any) => (
    <Modal visible={visible} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 15 }}>
                <Text>Confirm your Address</Text>
                <TouchableOpacity onPress={onClose}><Text>Cancel</Text></TouchableOpacity>
            </View>
        </View>
    </Modal>
);
export default AddressConfirmationModal;
