import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Line } from 'react-native-svg';
import { colors } from '../../assets/theme/colours';
import { styles } from './styles';
import { Order, OrderItem } from './dummydata';
import { AppIcons } from '../../assets/icons';
import { useCommonStyles } from '../../assets/styles';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoaderContext } from '../../context/loaderContext';
import { getOrderDetailsApi } from '../../api/services/orderService';
import CONFIG from '../../globals/config';

const DashedLine = () => (
    <View style={styles.trackingDashedSeparator}>
        <Svg height="1" width="100%">
            <Line x1="0" y1="0.5" x2="100%" y2="0.5" stroke={colors.lightGrey} strokeWidth="1" strokeDasharray="8, 8" />
        </Svg>
    </View>
);

const getImageUrl = (imagePath: string) => {
    if (!imagePath) return require("../../assets/images/category/nike.png"); // Adjust fullback if needed
    if (typeof imagePath !== 'string') return imagePath;
    if (imagePath.startsWith('http')) return { uri: imagePath };
    return { uri: `${CONFIG.image_base_url}/${imagePath}`.replace(/([^:]\/)\/+/g, "$1") };
};

const MyOrderDetails = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const [isTrackOpen, setIsTrackOpen] = useState(false);
    const homeStyles = useCommonStyles();

    const [orderDetails, setOrderDetails] = useState<any>([]);
    const { showLoader } = useContext(LoaderContext) || { showLoader: () => { } };

    const order: any = route.params?.order;
    const item: any = route.params?.selectedItem;

    if (!order || !item) return <View style={styles.container} />;

    const trackingSteps = orderDetails?.timeline ? orderDetails.timeline.map((step: any, index: number, arr: any[]) => {
        const isCurrent = index === arr.length - 1;
        const isCompleted = true;

        let icon = null;
        if (isCurrent) {
            icon = <AppIcons.Bag size={14} color={colors.themeTeal} />;
        }
        return {
            id: index.toString(),
            title: step.statusText,
            subtitle: step.notes,
            time: new Date(step.changedAt).toLocaleString(),
            isCompleted,
            isCurrent,
            icon
        };
    }) : [];

    useEffect(() => {
        fetchMyOrderDetailsFunction();
    }, []);

    const fetchMyOrderDetailsFunction = async () => {
        try {
            showLoader(true);
            const response = await getOrderDetailsApi(order?.orderId);
            console.log("Order details response---->", JSON.stringify(response, null, 2))
            if (response && response.success && response.data) {
                //console.log("Order details response data---->", JSON.stringify(response.data, null, 2))
                setOrderDetails(response.data);
            } else {
                setOrderDetails([]);
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
            setOrderDetails([]);
        } finally {
            showLoader(false);
        }
    };

    return (
        <SafeAreaView style={styles.detailsContainer}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
            <View style={styles.detailsHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <AppIcons.ArrowBack size={24} color={colors.black} />
                </TouchableOpacity>
                <Text style={styles.detailsHeaderTitle}>Details</Text>
            </View>

            <ScrollView contentContainerStyle={styles.detailsScrollView} showsVerticalScrollIndicator={false}>
                {/* Product Card */}
                <View style={[styles.detailCard, { marginHorizontal: 16 }]}>
                    <View style={styles.productTopRow}>
                        <View style={styles.productImageContainer}>
                            <Image source={getImageUrl(item?.featuredImage)} style={styles.productImage} resizeMode="cover" />
                        </View>
                        <View style={styles.productRightInfo}>
                            <Text style={styles.productNameDetail}>{item?.productName}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.buyAgainBtn}>
                        <Text style={styles.buyAgainText}>Buy again</Text>
                    </TouchableOpacity>
                </View>

                {/* Tracking Card */}
                <View style={[styles.detailCard, { marginHorizontal: 16 }]}>
                    <View style={styles.trackingTopRow}>
                        <View style={styles.trackingLeftInfo}>
                            <Image source={require('../../assets/images/hub.png')} style={styles.trackingIcon} resizeMode="contain" />
                            <View>
                                <Text style={styles.trackingStatusDetail}>{orderDetails?.header?.orderStatusText || item?.orderStatusText}</Text>
                                <Text style={styles.trackingDateDetail}>{orderDetails?.header?.orderDate ? new Date(orderDetails.header.orderDate).toLocaleDateString() : ''}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.trackOrderBtn} onPress={() => setIsTrackOpen(!isTrackOpen)}>
                            <Text style={styles.trackOrderText}>Track Order</Text>
                            {isTrackOpen ? (
                                <AppIcons.ArrowUp size={16} color={colors.themeTeal} />
                            ) : (
                                <AppIcons.ArrowDown size={16} color={colors.themeTeal} />
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Expandable Timeline */}
                    {isTrackOpen && (
                        <View style={styles.trackingExpandedContainer}>
                            {trackingSteps.map((step: any, index: number) => {
                                const isLast = index === trackingSteps.length - 1;
                                return (
                                    <View key={step.id} style={styles.trackingStepRow}>
                                        <View style={styles.trackingStepLeft}>
                                            {step.isCurrent ? (
                                                <View style={styles.trackingDotCurrentContainer}>
                                                    {step.icon}
                                                </View>
                                            ) : step.isCompleted ? (
                                                <View style={styles.trackingDotCompleted} />
                                            ) : (
                                                <View style={styles.trackingDotPending} />
                                            )}
                                            {!isLast && (
                                                <View style={step.isCompleted ? styles.trackingLineCompleted : styles.trackingLinePending} />
                                            )}
                                        </View>
                                        <View style={styles.trackingStepRight}>
                                            <Text style={step.isCurrent ? styles.trackingStepTitleCurrent : styles.trackingStepTitlePending}>{step.title}</Text>
                                            <Text style={styles.trackingStepSubtitle}>{step.subtitle}</Text>
                                            <Text style={styles.trackingStepTime}>{step.time}</Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    )}

                    <DashedLine />

                    <View style={styles.returnWindowRow}>
                        <AppIcons.Reload size={16} color={colors.themeTeal} />
                        <Text style={styles.returnWindowText}>
                            {/* {order.returnWindowText ? (
                                <> */}
                            Return window close after <Text style={styles.returnWindowRedText}>7 days</Text>
                            {/* </>
                            ) : null} */}
                        </Text>
                    </View>
                </View>

                {/* Rating Banner */}
                <View style={styles.ratingFullWidth}>
                    <Text style={styles.ratingTitle}>Rate your product</Text>
                    <View style={styles.starsRow}>
                        {[1, 2, 3, 4, 5].map(i => (
                            <AppIcons.StarOutline key={i} size={32} color={colors.lightGrey} />
                        ))}
                    </View>
                </View>

                {/* Other Products Card */}
                {orderDetails?.items?.length > 1 && (
                    <View style={[styles.detailCard, { marginHorizontal: 16 }]}>
                        <Text style={styles.otherProductsTitle}>Other Products in this order</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.otherProductsRow}>
                            {orderDetails.items.filter((i: any) => {
                                if (item?.productId && i.productId) return i.productId !== item.productId;
                                return i.productName !== item?.productName;
                            }).map((otherItem: any) => (
                                <Image key={otherItem.orderItemId} source={getImageUrl(otherItem.featuredImage)} style={styles.otherProductItemImage} resizeMode="contain" />
                            ))}
                        </ScrollView>
                        <View style={styles.orderIdContainer}>
                            <Text style={styles.orderIdLabelDetail}>Order ID : {orderDetails?.header?.orderNumber || item?.orderNumber}</Text>
                        </View>
                    </View>
                )}

                {/* Delivery Address Card */}
                <View style={[styles.detailCard, { marginHorizontal: 16 }]}>
                    <View style={styles.deliveryRow}>
                        <View style={styles.deliveryPinContainer}>
                            <AppIcons.Location size={14} color={colors.themeTeal} />
                        </View>
                        <Text style={styles.deliveryToText}>Delivered to :</Text>
                        <Text style={styles.deliveryTypeText}>{orderDetails?.shippingAddress?.addressType || 'Home'}</Text>
                    </View>
                    <Text style={styles.addressText}>
                        {orderDetails?.shippingAddress ? `${orderDetails.shippingAddress.custName}, ${orderDetails.shippingAddress.addLine1}, ${orderDetails.shippingAddress.pincodeAreaName || ''}, ${orderDetails.shippingAddress.pincode}` : ''}
                    </Text>
                </View>

            </ScrollView>

            {/* Bottom Bar */}
            <View style={styles.fixedBottomBar}>
                <TouchableOpacity style={styles.returnBtn}>
                    <AppIcons.ArrowDownBold size={20} color={colors.black} />
                    <Text style={styles.returnBtnText}>Return</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.reorderBtn}>
                    <AppIcons.ArrowUpBold size={20} color={colors.white} />
                    <Text style={styles.reorderBtnText}>Reorder</Text>
                </TouchableOpacity> */}

                <LinearGradient
                    colors={[colors.themeTeal, colors.themeDarkTeal]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[homeStyles.reviewFilterPillActiveGradient, { borderRadius: 30, flexDirection: 'row' }]}
                >
                    <AppIcons.ArrowUpBold color={colors.white} size={20} />
                    <TouchableOpacity onPress={() => { }} style={{ padding: 4 }} >
                        <Text style={[homeStyles.reviewFilterText, homeStyles.reviewFilterTextActive]}>Reorder</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </SafeAreaView>
    );
};

export default MyOrderDetails;
