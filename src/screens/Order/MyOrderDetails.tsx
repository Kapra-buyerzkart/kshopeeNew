import React, { useState } from 'react';
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

const DashedLine = () => (
    <View style={styles.trackingDashedSeparator}>
        <Svg height="1" width="100%">
            <Line x1="0" y1="0.5" x2="100%" y2="0.5" stroke={colors.lightGrey} strokeWidth="1" strokeDasharray="8, 8" />
        </Svg>
    </View>
);

const getTrackingSteps = (order: Order) => {
    const baseSteps = [
        { id: '1', title: 'Order Confirmed', subtitle: 'Your order has been placed. It will be shipped soon!' },
        { id: '2', title: 'Order Shipped', subtitle: 'Your order is on the way' },
        { id: '3', title: 'Reached the nearby Hub', subtitle: 'Your order is on the way' },
        { id: '4', title: 'You have received your order', subtitle: 'Your order is on the way' },
    ];

    let currentIndex = 0;
    if (order.status === 'Delivered') {
        currentIndex = 3;
    } else if (order.status === 'Out For Order') {
        currentIndex = 2;
    } else if (order.status === 'Cancelled') {
        currentIndex = -1; // No current active step tracking if cancelled
    }

    return baseSteps.map((step, index) => {
        const isCompleted = index < currentIndex || order.status === 'Delivered';
        const isCurrent = index === currentIndex;

        let icon = null;
        if (isCurrent) {
            icon = <AppIcons.Bag size={14} color={colors.themeTeal} />;
        }

        return {
            ...step,
            time: order.date ? `${order.date} - 11:05 PM` : '20th Oct, 2025 - 11:05 PM',
            isCompleted: order.status === 'Delivered' ? true : isCompleted,
            isCurrent: order.status === 'Delivered' && index === 3 ? true : isCurrent,
            icon
        };
    });
};

const MyOrderDetails = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const [isTrackOpen, setIsTrackOpen] = useState(false);
    const homeStyles = useCommonStyles();

    const order: Order = route.params?.order;
    const item: OrderItem = route.params?.selectedItem;

    if (!order || !item) return <View style={styles.container} />;

    const otherItems = order.items.filter(i => i.id !== item.id);
    const trackingSteps = getTrackingSteps(order);

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
                            <Image source={item.image} style={styles.productImage} resizeMode="cover" />
                        </View>
                        <View style={styles.productRightInfo}>
                            <Text style={styles.productNameDetail}>{item.name}</Text>
                            {item.size && (
                                <View style={styles.productAttributeRow}>
                                    <Text style={styles.productAttributeLabel}>Size :</Text>
                                    <Text style={styles.productAttributeValue}>{item.size}</Text>
                                </View>
                            )}
                            {item.colorHex && (
                                <View style={styles.productAttributeRow}>
                                    <Text style={styles.productAttributeLabel}>Color :</Text>
                                    <View style={[styles.colorCircle, { backgroundColor: item.colorHex }]} />
                                </View>
                            )}
                        </View>
                    </View>
                    <TouchableOpacity style={styles.buyAgainBtn}>
                        <Text style={styles.buyAgainText}>Buy again</Text>
                    </TouchableOpacity>
                </View>

                {/* Tracking Card */}
                <View style={[styles.detailCard, { marginHorizontal: 8 }]}>
                    <View style={styles.trackingTopRow}>
                        <View style={styles.trackingLeftInfo}>
                            <Image source={require('../../assets/images/img.png')} style={styles.trackingIcon} resizeMode="contain" />
                            <View>
                                <Text style={styles.trackingStatusDetail}>{order.statusDescription || 'Order reached the hub'}</Text>
                                <Text style={styles.trackingDateDetail}>{order.deliveryDateText || `Delivered on ${order.date}`}</Text>
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
                            {trackingSteps.map((step, index) => {
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
                            {order.returnWindowText ? (
                                <>
                                    Return window close after <Text style={styles.returnWindowRedText}>7 days</Text>
                                </>
                            ) : null}
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
                {otherItems.length > 0 && (
                    <View style={[styles.detailCard, { marginHorizontal: 16 }]}>
                        <Text style={styles.otherProductsTitle}>Other Products in this order</Text>
                        <View style={styles.otherProductsRow}>
                            {otherItems.map(otherItem => (
                                <Image key={otherItem.id} source={otherItem.image} style={styles.otherProductItemImage} resizeMode="contain" />
                            ))}
                        </View>
                        <View style={styles.orderIdContainer}>
                            <Text style={styles.orderIdLabelDetail}>Order ID : {order.orderId}</Text>
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
                        <Text style={styles.deliveryTypeText}>{order.deliveryType || 'Home'}</Text>
                    </View>
                    <Text style={styles.addressText}>{order.deliveryAddress}</Text>
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
                        <Text style={[homeStyles.reviewFilterText, homeStyles.reviewFilterTextActive]}>Save</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </SafeAreaView>
    );
};

export default MyOrderDetails;
