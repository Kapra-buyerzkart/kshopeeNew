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
import { getOrderDetailsApi, reorderApi, returnOrderItemApi, cancelOrderApi } from '../../api/services/orderService';
import { verifyRazorpayPaymentApi } from '../../api/services/paymentService';
import RazorpayCheckout from 'react-native-razorpay';
import { useUser } from '../../context/UserContext';
import CONFIG from '../../globals/config';
import ConfirmationModal from '../../components/ConfirmationModal';
import StatusModal from '../../components/StatusModal';

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
    const { profile } = useUser();

    const [orderDetails, setOrderDetails] = useState<any>([]);
    const { showLoader } = useContext(LoaderContext) || { showLoader: () => { } };

    const order: any = route.params?.order;
    const item: any = route.params?.selectedItem;

    const [confirmModal, setConfirmModal] = useState<{
        visible: boolean;
        type: 'return' | 'reorder' | 'cancel' | null;
    }>({ visible: false, type: null });

    const [statusModal, setStatusModal] = useState<{
        visible: boolean;
        type: 'success' | 'error';
        title: string;
        message: string;
        navigateOnClose?: boolean;
    }>({ visible: false, type: 'success', title: '', message: '' });

    if (!order || !item) return <View style={styles.container} />;

    const loadedItem = orderDetails?.items?.find((i: any) => {
        if (item?.productId && i.productId) return i.productId === item.productId;
        return i.productName === item?.productName;
    }) || item;

    const canReturn = loadedItem?.canReturn === true;
    const canCancel = orderDetails?.header?.canCancel === true || order?.canCancel === true;
    const canRetryPayment = orderDetails?.header?.canRetryPayment === true;

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

    const handleReorder = async () => {
        try {
            showLoader(true);
            const res = await reorderApi({ orderId: order?.orderId });
            if (res?.success) {
                setStatusModal({
                    visible: true,
                    type: 'success',
                    title: 'Success',
                    message: 'Items added to cart for reorder.',
                    navigateOnClose: true
                });
            } else {
                setStatusModal({
                    visible: true,
                    type: 'error',
                    title: 'Error',
                    message: res?.message || 'Failed to reorder'
                });
            }
        } catch (error) {
            setStatusModal({
                visible: true,
                type: 'error',
                title: 'Error',
                message: 'An error occurred while reordering'
            });
        } finally {
            showLoader(false);
        }
    };

    const handleReturn = async () => {
        try {
            showLoader(true);
            const payload = {
                orderId: order?.orderId,
                orderItemId: item?.orderItemId,
                quantity: item?.quantity || 1,
                requestReason: "Damaged product"
            };
            const res = await returnOrderItemApi(payload);
            if (res?.success) {
                setStatusModal({
                    visible: true,
                    type: 'success',
                    title: 'Success',
                    message: 'Return requested successfully.'
                });
            } else {
                setStatusModal({
                    visible: true,
                    type: 'error',
                    title: 'Error',
                    message: res?.message || 'Failed to process return'
                });
            }
        } catch (error) {
            setStatusModal({
                visible: true,
                type: 'error',
                title: 'Error',
                message: 'An error occurred while processing return'
            });
        } finally {
            showLoader(false);
        }
    };

    const handleCancel = async () => {
        try {
            showLoader(true);
            const payload = {
                orderId: order?.orderId,
                reason: "Cancelled by Customer",
                requestedFromDevice: "app"
            };
            const res = await cancelOrderApi(payload);
            if (res?.success) {
                setStatusModal({
                    visible: true,
                    type: 'success',
                    title: 'Success',
                    message: 'Order cancelled successfully.'
                });
                fetchMyOrderDetailsFunction();
            } else {
                setStatusModal({
                    visible: true,
                    type: 'error',
                    title: 'Error',
                    message: res?.message || 'Failed to cancel order'
                });
            }
        } catch (error) {
            setStatusModal({
                visible: true,
                type: 'error',
                title: 'Error',
                message: 'An error occurred while cancelling the order'
            });
        } finally {
            showLoader(false);
        }
    };

    const handleRetryPayment = async () => {
        const header = orderDetails?.header;
        const razorpayOrderId = header?.razorPayOrderId;
        const razorpayKeyId = header?.razorPayKeyId;
        const razorpayAmount = header?.razorPayAmount;

        if (!razorpayOrderId || !razorpayKeyId || !razorpayAmount) {
            setStatusModal({
                visible: true,
                type: 'error',
                title: 'Error',
                message: 'Payment details not available. Please try again later.'
            });
            return;
        }

        try {
            const options = {
                key: razorpayKeyId,
                amount: razorpayAmount,
                currency: 'INR',
                name: 'Kapra Daily',
                description: `Order #${header?.orderNumber || order?.orderId}`,
                order_id: razorpayOrderId,
                prefill: {
                    email: profile?.email || '',
                    contact: profile?.phone || profile?.phoneNo || ''
                },
                theme: { color: '#F25000' }
            };

            const sdkResponse = await RazorpayCheckout.open(options);
            showLoader(true);

            const verifyPayload = {
                orderId: order?.orderId,
                razorpayOrderId: sdkResponse.razorpay_order_id,
                razorpayPaymentId: sdkResponse.razorpay_payment_id,
                razorpaySignature: sdkResponse.razorpay_signature,
                amount: Number(razorpayAmount)
            };

            const verifyResponse = await verifyRazorpayPaymentApi(verifyPayload);
            showLoader(false);

            if (verifyResponse?.success) {
                setStatusModal({
                    visible: true,
                    type: 'success',
                    title: 'Payment Successful',
                    message: 'Your payment has been completed successfully.'
                });
                fetchMyOrderDetailsFunction();
            } else {
                setStatusModal({
                    visible: true,
                    type: 'error',
                    title: 'Verification Pending',
                    message: verifyResponse?.message || 'Payment verification is pending. Please check back later.'
                });
            }
        } catch (sdkError: any) {
            showLoader(false);
            setStatusModal({
                visible: true,
                type: 'error',
                title: 'Payment Failed',
                message: sdkError?.description || 'Payment was cancelled or failed.'
            });
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
                    <TouchableOpacity style={styles.buyAgainBtn} onPress={() => setConfirmModal({ visible: true, type: 'reorder' })}>
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

                    {/* <View style={styles.returnWindowRow}> */}
                    {/* <AppIcons.Reload size={16} color={colors.themeTeal} />
                        <Text style={styles.returnWindowText}>
                            {/* {order.returnWindowText ? (
                                <> */}
                    {/* Return window close after <Text style={styles.returnWindowRedText}>7 days</Text>

                        </Text> */}
                    {/* </View> */}
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
                                <TouchableOpacity key={otherItem.orderItemId} onPress={() => navigation.navigate('ProductDetailsScreen', { productId: otherItem.productId, product: otherItem })}>
                                    <Image source={getImageUrl(otherItem.featuredImage)} style={styles.otherProductItemImage} resizeMode="contain" />
                                </TouchableOpacity>
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

                {/* Retry Payment */}
                {canRetryPayment && (
                    <TouchableOpacity onPress={handleRetryPayment} style={{ marginHorizontal: 16, marginBottom: 16 }}>
                        <LinearGradient
                            colors={['#00eeffff', '#00aeffff']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{ borderRadius: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 48 }}
                        >
                            <AppIcons.ArrowUpBold color={colors.white} size={20} />
                            <Text style={[homeStyles.reviewFilterText, homeStyles.reviewFilterTextActive, { marginLeft: 4 }]}>Retry Payment</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}

            </ScrollView>

            {/* Bottom Bar */}
            <View style={styles.fixedBottomBar}>
                {canCancel && (
                    <TouchableOpacity style={styles.returnBtn} onPress={() => setConfirmModal({ visible: true, type: 'cancel' })}>
                        <AppIcons.Close size={20} color={colors.themeTeal} />
                        <Text style={[styles.returnBtnText, { color: colors.themeTeal }]}>Cancel</Text>
                    </TouchableOpacity>
                )}

                {canReturn && (
                    <TouchableOpacity style={styles.returnBtn} onPress={() => setConfirmModal({ visible: true, type: 'return' })}>
                        <AppIcons.ArrowDownBold size={20} color={colors.black} />
                        <Text style={styles.returnBtnText}>Return</Text>
                    </TouchableOpacity>
                )}


                <LinearGradient
                    colors={[colors.themeTeal, colors.themeDarkTeal]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[homeStyles.reviewFilterPillActiveGradient, { borderRadius: 39, flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center', height: 48 }]}
                >
                    <AppIcons.ArrowUpBold color={colors.white} size={20} />
                    <TouchableOpacity onPress={() => setConfirmModal({ visible: true, type: 'reorder' })} style={{ marginLeft: 4 }} >
                        <Text style={[homeStyles.reviewFilterText, homeStyles.reviewFilterTextActive]}>Reorder</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>

            <ConfirmationModal
                visible={confirmModal.visible}
                onClose={() => setConfirmModal({ visible: false, type: null })}
                onConfirm={() => {
                    setConfirmModal({ visible: false, type: null });
                    if (confirmModal.type === 'reorder') handleReorder();
                    else if (confirmModal.type === 'return') handleReturn();
                    else if (confirmModal.type === 'cancel') handleCancel();
                }}
                title={confirmModal.type === 'cancel' ? "Cancel Order" : confirmModal.type === 'return' ? "Return Item" : "Reorder"}
                message={confirmModal.type === 'cancel' ? "Are you sure you want to cancel this order?" : confirmModal.type === 'return' ? "Are you sure you want to return this item?" : "Are you sure you want to reorder?"}
                confirmText={confirmModal.type === 'cancel' ? "Cancel Order" : confirmModal.type === 'return' ? "Return" : "Reorder"}
                themeColor={confirmModal.type === 'cancel' ? colors.themeTeal : confirmModal.type === 'return' ? colors.themeTeal : colors.themeTeal}
            />

            <StatusModal
                visible={statusModal.visible}
                onClose={() => {
                    setStatusModal(prev => ({ ...prev, visible: false }));
                    if (statusModal.navigateOnClose) {
                        navigation.navigate('Cart');
                    }
                }}
                type={statusModal.type}
                title={statusModal.title}
                message={statusModal.message}
            />
        </SafeAreaView>
    );
};

export default MyOrderDetails;
