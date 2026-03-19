import React from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { styles } from './styles';
import { AppIcons } from '../../assets/icons';
import { colors, fontColors } from '../../assets/theme/colours';
import LinearGradient from 'react-native-linear-gradient';
import { wp } from '../../utils/responsive';

interface ProductCardProps {
    title: string;
    image: any;
    price: string;
    mrp?: string;
    discount?: string;
    rating?: number;
    isWishlisted?: boolean;
    onWishlistPress?: () => void;
    onAddToCart?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
    title,
    image,
    price,
    mrp,
    discount,
    rating = 0,
    isWishlisted = false,
    onWishlistPress,
    onAddToCart,
}) => {
    // Helper to render stars
    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<AppIcons.Star key={i} size={12} style={{ marginLeft: wp('1%') }} />);
            } else {
                stars.push(<AppIcons.StarOutline key={i} size={12} style={{ marginLeft: wp('1%') }} />);
            }
        }
        return stars;
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={image}
                style={styles.imageSection}
                imageStyle={{ width: '100%', height: '100%', resizeMode: 'cover' }}
            >
                {discount && (
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>{discount}</Text>
                    </View>
                )}

                <TouchableOpacity
                    style={styles.wishlistIcon}
                    onPress={onWishlistPress}
                    activeOpacity={0.7}
                >
                    <Image source={require('../../assets/images/wishicon.png')} style={{ width: 24, height: 24 }} tintColor={isWishlisted ? 'red' : 'grey'} resizeMode='contain' />
                </TouchableOpacity>
            </ImageBackground>

            <View style={styles.detailsContainer}>
                <Text style={styles.title} numberOfLines={2}>
                    {title}
                </Text>

                <View style={styles.ratingContainer}>
                    {renderStars()}
                </View>

                <View style={styles.priceContainer}>
                    <Text style={styles.price}>₹{price}</Text>
                    {mrp && <Text style={styles.mrp}>MRP ₹{mrp}</Text>}
                </View>

                <TouchableOpacity
                    style={styles.cartButton}
                    onPress={onAddToCart}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={[colors.themeTeal, colors.themeDarkTeal, colors.themeDarkTeal]}
                        start={{ x: 0.1, y: 1 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.cartGradient}
                    >
                        <Image source={require('../../assets/images/cart.png')} style={{ width: 16, height: 16 }} tintColor={colors.white} resizeMode='contain' />
                        <Text style={styles.cartText}>Cart</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ProductCard;
