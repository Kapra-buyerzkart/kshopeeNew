import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { useCommonStyles } from '../assets/styles';
import { colors } from '../assets/theme/colours';
import { AppIcons } from '../assets/icons';
import { RootStackParamList } from '../types/types';

const FloatingCart: React.FC = () => {
    const styles = useCommonStyles();
    const { cartTotal } = useCart();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    if (cartTotal.count === 0) {
        return null;
    }

    const handlePress = () => {
        navigation.navigate('OrderDetails' as never);
    };

    return (
        <View style={styles.productFloatingCartContainer}>
            <TouchableOpacity style={styles.productCartButton} onPress={handlePress}>
                <View style={styles.productCartLeft}>
                    <AppIcons.ShoppingCart size={24} color={colors.white} />
                    <Text style={[styles.label1, styles.textWhite]}>
                        {cartTotal.count} item{cartTotal.count !== 1 ? 's' : ''}
                    </Text>
                </View>
                <Text style={[styles.label1, styles.textWhite]}>
                    Total: Rs {cartTotal.price.toFixed(2)}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default FloatingCart;
