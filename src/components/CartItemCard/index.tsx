import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AppIcons } from '../../assets/icons';
import { colors } from '../../assets/theme/colours';
import { cartItemCardStyles as styles } from './styles';

export interface CartItem {
    id: string;
    title: string;
    size: string;
    color: string;
    price: number;
    originalPrice: number;
    discount: string;
    quantity: number;
    image: string;
}

interface CartItemCardProps {
    item: CartItem;
    onDelete?: (id: string) => void;
    onIncrement?: (id: string) => void;
    onDecrement?: (id: string) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({
    item,
    onDelete,
    onIncrement,
    onDecrement,
}) => {
    return (
        <View style={styles.itemCard}>
            {/* Top: Image + Details */}
            <View style={styles.itemTopRow}>
                <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode='cover' />
                <View style={styles.itemDetails}>
                    <View style={styles.itemTitleRow}>
                        <Text style={styles.itemTitle} numberOfLines={2}>
                            {item.title}
                        </Text>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => onDelete?.(item.id)}>
                            <AppIcons.Delete color={colors.grey} size={20} />
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.variantRow, { marginTop: 19 }]}>
                        <Text style={styles.variantLabel}>Size : </Text>
                        <Text style={styles.variantValue}>{item.size}</Text>
                    </View>
                    <View style={[styles.variantRow, { marginTop: 5 }]}>
                        <Text style={styles.variantLabel}>Color : </Text>
                        <View
                            style={[
                                styles.colorCircle,
                                { backgroundColor: item.color },
                            ]}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.separator} />
            {/* Bottom: Quantity + Price (full width) */}
            <View style={styles.itemBottomRow}>
                <View style={styles.quantitySelector}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => onDecrement?.(item.id)}>
                        <LinearGradient
                            colors={[colors.themeTeal, colors.themeDarkTeal, colors.themeDarkTeal]}
                            start={{ x: 0.1, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={styles.qtyBtn}>
                            <AppIcons.Back color={colors.white} size={20} />
                        </LinearGradient>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>
                        {String(item.quantity).padStart(2, '0')}
                    </Text>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => onIncrement?.(item.id)}>
                        <LinearGradient
                            colors={[colors.themeTeal, colors.themeDarkTeal, colors.themeDarkTeal]}
                            start={{ x: 0.1, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={styles.qtyBtn}>
                            <AppIcons.Forward color={colors.white} size={20} />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={styles.priceContainer}>
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountArrow}>▼</Text>
                        <Text style={styles.discountText}>{item.discount}</Text>
                    </View>
                    <Text style={styles.mrpText}>
                        MRP ₹{item.originalPrice.toFixed(2)}
                    </Text>
                    <Text style={styles.priceText}>
                        <Text style={styles.rupeeSign}>₹</Text>
                        {item.price.toFixed(2)}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default CartItemCard;
