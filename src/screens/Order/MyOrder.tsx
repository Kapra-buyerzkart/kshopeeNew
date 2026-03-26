import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Svg, { Line } from 'react-native-svg';
import { colors } from '../../assets/theme/colours';
import { styles } from './styles';
import { myOrders, Order, OrderItem } from './dummydata';
import { AppIcons } from '../../assets/icons';
import { LoaderContext } from '../../context/loaderContext';
import { getMyOrdersApi } from '../../api/services/orderService';
import CONFIG from '../../globals/config';

const DashedSeparator = () => (
    <View style={styles.separatorContainer}>
        <Svg height="1" width="100%">
            <Line x1="0" y1="0.5" x2="100%" y2="0.5" stroke={colors.lightGrey} strokeWidth="1" strokeDasharray="8, 8" />
        </Svg>
    </View>
);

const MyOrder = () => {
    const navigation = useNavigation<any>();

    const [orderData, setOrderData] = useState<any>([]);
    const { showLoader } = useContext(LoaderContext) || { showLoader: () => { } };

    const renderStatusIcon = (status: string) => {
        switch (status) {
            case 'Out For Order':
            case 'Out for Delivery':
            case 'Delivery Agent Assigned':
                return <MaterialCommunityIcons name="truck-fast" size={20} color="#F39C12" />;
            case 'Cancelled':
                return <Ionicons name="close-circle" size={20} color={colors.red} />;
            case 'Delivered':
                return <Ionicons name="checkmark-circle" size={20} color={colors.green} />;
            case 'Order Placed':
            case 'Order Pending':
                return <MaterialCommunityIcons name="clock-outline" size={20} color="#3498DB" />;
            default:
                return null;
        }
    };

    useEffect(() => {
        fetchMyOrderFunction();
    }, []);

    const fetchMyOrderFunction = async () => {
        try {
            showLoader(true);
            const response = await getMyOrdersApi();
            console.log("Order details response---->", JSON.stringify(response, null, 2))
            if (response && response.success && response.data) {
                //console.log("Order details response data---->", JSON.stringify(response.data, null, 2))
                setOrderData(response.data);
            } else {
                setOrderData([]);
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
            setOrderData([]);
        } finally {
            showLoader(false);
        }
    };


    const getImageUrl = (imagePath: string) => {
        if (!imagePath) return require("../../assets/images/category/nike.png"); // Adjust fullback if needed
        if (typeof imagePath !== 'string') return imagePath;
        if (imagePath.startsWith('http')) return { uri: imagePath };
        return { uri: `${CONFIG.image_base_url}/${imagePath}`.replace(/([^:]\/)\/+/g, "$1") };
    };

    const renderOrderItem = (product: any, order: any, index: number) => {
        // Inject order information so it's accessible in selectedItem
        const item = {
            ...product,
            orderId: order?.orderId,
            orderNumber: order?.orderNumber
        };

        return (
            <TouchableOpacity key={index} style={styles.itemContainer} onPress={() => navigation.navigate('MyOrderDetails', { order, selectedItem: item })}>
                <Image source={getImageUrl(item?.featuredImage)} style={styles.itemImage} resizeMode="contain" />
                <View style={styles.itemDetails}>
                    <Text style={styles.itemName} numberOfLines={1}>{item?.productName}</Text>
                    <Text style={styles.discountedPrice}>₹{item?.lineTotal?.toFixed(2)}</Text>
                </View>
                <TouchableOpacity style={styles.chevronContainer}>
                    <AppIcons.RightArrow color={colors.themeTeal} size={20} />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    const renderOrderCard = ({ item }: { item: any }) => {
        let parsedItems = [];
        try {
            parsedItems = item?.items ? JSON.parse(item?.items) : [];
        } catch (e) { }

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.statusContainer}>
                        {renderStatusIcon(item.orderStatusText)}
                        <Text style={styles.statusText}>{item.orderStatusText}</Text>
                    </View>
                    <Text style={styles.dateText}>{item.orderDate ? new Date(item.orderDate).toLocaleDateString() : ''}</Text>
                </View>

                <DashedSeparator />

                {parsedItems.map((product: any, idx: number) => renderOrderItem(product, item, idx))}

                <DashedSeparator />

                <View style={styles.cardFooter}>
                    <View style={styles.footerLeft}>
                        <Text style={styles.footerLabel}>Order ID :</Text>
                        <Text style={styles.orderIdText}>{item.orderNumber}</Text>
                    </View>
                    <View style={styles.footerRight}>
                        <Text style={styles.footerLabel}>Total Amount :</Text>
                        <Text style={styles.totalAmountText}>₹{item.grandTotal?.toFixed(2)}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>

                    <AppIcons.ArrowBack color={colors.black} size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Order</Text>
            </View>

            <FlatList
                data={orderData?.items || []}
                keyExtractor={(item, index) => item.orderId ? item.orderId.toString() : index.toString()}
                renderItem={renderOrderCard}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

export default MyOrder;