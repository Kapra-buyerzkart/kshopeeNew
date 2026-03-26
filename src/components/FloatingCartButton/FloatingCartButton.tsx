import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../../context/CartContext';
import { AppIcons } from '../../assets/icons';
import { colors } from '../../assets/theme/colours';
import LinearGradient from 'react-native-linear-gradient';

const FloatingCartButton: React.FC = () => {
    const navigation = useNavigation<any>();
    const { cartCount, cartItems } = useCart();

    if (cartCount <= 0) {
        return null;
    }

    // Get the most recently added item to show its image
    const recentItem = cartItems[cartItems.length - 1];

    const fallbackImage = require('../../assets/images/appicon.png'); // Fallback image if product image is missing

    return (
        <View style={styles.outerContainer}>
            <LinearGradient
                colors={[colors.themeTeal, colors.themeDarkTeal]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientContainer}
            >
                <TouchableOpacity
                    style={styles.touchableArea}
                    onPress={() => navigation.navigate('Cart')}
                    activeOpacity={0.8}
                >
                    <View style={styles.imageContainer}>
                        <Image
                            source={recentItem?.productImage ? { uri: recentItem.productImage } : fallbackImage}
                            style={styles.productImage}
                            resizeMode="cover"
                        />
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={styles.viewCartText}>View cart</Text>
                        <Text style={styles.itemsCountText}>{cartCount} items</Text>
                    </View>

                    <View style={styles.arrowContainer}>
                        <AppIcons.ChevronRight size={24} color={colors.themeWhite} />
                    </View>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        position: 'absolute',
        bottom: 24,
        alignSelf: 'center',
        zIndex: 9999,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    gradientContainer: {
        borderRadius: 50,
        minWidth: 200,
    },
    touchableArea: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    imageContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.themeWhite,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    viewCartText: {
        color: colors.themeWhite,
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemsCountText: {
        color: colors.themeWhite,
        fontSize: 12,
        opacity: 0.9,
    },
    arrowContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
});

export default FloatingCartButton;
