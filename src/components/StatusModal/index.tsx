import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';

const StatusModal = ({ visible, onClose, type, title, message }: any) => (
    <Modal visible={visible} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 15, width: '80%' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{title}</Text>
                <Text style={{ marginTop: 10 }}>{message}</Text>
                <TouchableOpacity onPress={onClose} style={{ marginTop: 20, alignSelf: 'flex-end' }}>
                    <Text style={{ color: '#F25000' }}>OK</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
);
export default StatusModal;
