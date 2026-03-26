import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';

const CouponModal = ({ visible, onClose }: any) => (
    <Modal visible={visible} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                <Text>Apply Coupons & Offers</Text>
                <TouchableOpacity onPress={onClose}><Text>Close</Text></TouchableOpacity>
            </View>
        </View>
    </Modal>
);
export default CouponModal;
