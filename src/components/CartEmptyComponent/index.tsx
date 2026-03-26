import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const CartEmptyComponent = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Your cart is empty!</Text>
        <Text style={{ marginTop: 10, color: 'gray' }}>Add some delicious items to your cart.</Text>
    </View>
);
export default CartEmptyComponent;
