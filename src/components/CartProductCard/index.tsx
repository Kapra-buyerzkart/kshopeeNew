import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FONTS } from '../../styles/typography';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface CartProductCardProps {
    item: any;
    onDelete?: (id: any) => void;
    onIncrement?: (id: any) => void;
    onDecrement?: (id: any) => void;
}

const CartProductCard: React.FC<CartProductCardProps> = ({ item, onDelete, onIncrement, onDecrement }) => {
    const isSoldOut = item.unavailable === 1 || item.insufficientStock === 1;

    return (
        <View style={[styles.container, isSoldOut && { opacity: 0.6 }]}>
            <View style={styles.imageBox}>
                <Image source={{ uri: item.productImage }} style={styles.image} />
                {isSoldOut && (
                    <View style={styles.soldOutBadge}>
                        <Text style={styles.soldOutText}>Sold Out</Text>
                    </View>
                )}
            </View>

            <View style={styles.details}>
                <Text style={styles.name} numberOfLines={2}>{item.productName}</Text>
                <Text style={styles.variant}>{item.unitSize || item.variantName || 'Standard'}</Text>
                
                <View style={styles.priceRow}>
                    <Text style={styles.price}>₹{item.specialPrice || item.unitPrice}</Text>
                    {item.mrp > (item.specialPrice || item.unitPrice) && (
                        <Text style={styles.mrp}>₹{item.mrp}</Text>
                    )}
                </View>
            </View>

            <View style={styles.actionColumn}>
                <TouchableOpacity onPress={() => onDelete?.(item.cartItemId)} style={styles.deleteBtn}>
                    <MaterialCommunityIcons name="delete-outline" size={wp('5%')} color="#FF4D4D" />
                </TouchableOpacity>

                <View style={styles.qtySelector}>
                    <TouchableOpacity onPress={() => onDecrement?.(item.cartItemId)} style={styles.qtyBtn}>
                        <AntDesign name="minus" size={wp('3.5%')} color="#F25000" />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => onIncrement?.(item.cartItemId)} style={styles.qtyBtn}>
                        <AntDesign name="plus" size={wp('3.5%')} color="#F25000" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: wp('3%'),
        marginBottom: hp('1.5%'),
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    imageBox: {
        width: wp('20%'),
        height: wp('20%'),
        borderRadius: 10,
        backgroundColor: '#F9F9F9',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    soldOutBadge: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.6)',
        width: '100%',
        paddingVertical: 2,
        bottom: 0,
        alignItems: 'center',
    },
    soldOutText: {
        color: '#FFF',
        fontSize: wp('2.2%'),
        fontFamily: FONTS.poppins.bold,
    },
    details: {
        flex: 1,
        marginLeft: wp('3%'),
        justifyContent: 'center',
    },
    name: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3.5%'),
        color: '#000',
    },
    variant: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3%'),
        color: '#757575',
        marginTop: 2,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp('0.5%'),
    },
    price: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('3.8%'),
        color: '#F25000',
    },
    mrp: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3%'),
        color: '#9E9E9E',
        textDecorationLine: 'line-through',
        marginLeft: wp('2%'),
    },
    actionColumn: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingVertical: 2,
    },
    deleteBtn: {
        padding: wp('1%'),
    },
    qtySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF5F0',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#FFD8C4',
    },
    qtyBtn: {
        padding: wp('1.5%'),
    },
    qtyText: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('3.5%'),
        color: '#000',
        marginHorizontal: wp('2%'),
    },
});

export default CartProductCard;
