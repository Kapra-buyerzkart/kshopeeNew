import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    Animated,
    Image,
    Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../assets/theme/colours';
import { Fonts } from '../../assets/theme/fonts';
import { AppIcons } from '../../assets/icons';

const { width } = Dimensions.get('window');

const OrderSuccessScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const {
        orderId,
        orderNumber,
        paymentMethod,
        totalItems,
        totalAmount,
        deliveryMode,
        address
    } = route.params || {};

    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Animated.View style={[styles.successIconContainer, { transform: [{ scale: scaleAnim }] }]}>
                    <LinearGradient
                        colors={[colors.themeTeal, colors.themeDarkTeal]}
                        style={styles.iconGradient}
                    >
                        <AppIcons.Check color={colors.white} size={60} />
                    </LinearGradient>
                </Animated.View>

                <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
                    <Text style={styles.title}>Order Placed Successfully!</Text>
                    <Text style={styles.subtitle}>
                        Thank you for choosing Kapra. Your order has been placed and is being processed.
                    </Text>

                    <View style={styles.orderCard}>
                        <View style={styles.orderRow}>
                            <Text style={styles.label}>Order Number</Text>
                            <Text style={styles.value}>#{orderNumber || orderId}</Text>
                        </View>
                        <View style={styles.separator} />
                        <View style={styles.orderRow}>
                            <Text style={styles.label}>Amount Paid</Text>
                            <Text style={[styles.value, { color: colors.themeTeal }]}>₹{totalAmount?.toFixed(2)}</Text>
                        </View>
                        <View style={styles.separator} />
                        <View style={styles.orderRow}>
                            <Text style={styles.label}>Payment Mode</Text>
                            <Text style={styles.value}>{paymentMethod?.toUpperCase()}</Text>
                        </View>
                        <View style={styles.separator} />
                        <View style={styles.orderRow}>
                            <Text style={styles.label}>Delivery Mode</Text>
                            <Text style={[styles.value, { textTransform: 'capitalize' }]}>{deliveryMode}</Text>
                        </View>
                    </View>

                    <View style={styles.addressBox}>
                        <View style={styles.addressHeader}>
                            <AppIcons.Home color={colors.themeTeal} size={18} />
                            <Text style={styles.addressTitle}>Delivering to</Text>
                        </View>
                        <Text style={styles.addressText} numberOfLines={2}>{address || 'Your selected address'}</Text>
                    </View>
                </Animated.View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.trackButton}
                    onPress={() => navigation.navigate('MyOrder')}
                >
                    <LinearGradient
                        colors={[colors.themeTeal, colors.themeDarkTeal]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.buttonGradient}
                    >
                        <Text style={styles.trackButtonText}>View My Orders</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.homeButton}
                    onPress={() => navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] })}
                >
                    <Text style={styles.homeButtonText}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    successIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 30,
        ...Platform.select({
            ios: {
                shadowColor: colors.themeTeal,
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 15,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    iconGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontFamily: Fonts.gilroyBold,
        color: colors.black,
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: Fonts.gilroyMedium,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 40,
    },
    orderCard: {
        backgroundColor: '#F9F9F9',
        borderRadius: 20,
        padding: 20,
        width: width - 60,
        borderWidth: 1,
        borderColor: '#EEE',
        marginBottom: 20,
    },
    orderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    label: {
        fontSize: 14,
        fontFamily: Fonts.gilroyMedium,
        color: '#999',
    },
    value: {
        fontSize: 14,
        fontFamily: Fonts.gilroyBold,
        color: colors.black,
    },
    separator: {
        height: 1,
        backgroundColor: '#EEE',
    },
    addressBox: {
        width: width - 60,
        paddingHorizontal: 4,
    },
    addressHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    addressTitle: {
        fontSize: 14,
        fontFamily: Fonts.gilroyBold,
        color: colors.black,
    },
    addressText: {
        fontSize: 14,
        fontFamily: Fonts.gilroyMedium,
        color: '#666',
        lineHeight: 20,
    },
    footer: {
        padding: 30,
        gap: 15,
    },
    trackButton: {
        height: 56,
        borderRadius: 16,
        overflow: 'hidden',
    },
    buttonGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    trackButtonText: {
        color: colors.white,
        fontSize: 18,
        fontFamily: Fonts.gilroyBold,
    },
    homeButton: {
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
    },
    homeButtonText: {
        color: '#666',
        fontSize: 16,
        fontFamily: Fonts.gilroyBold,
    },
});

export default OrderSuccessScreen;
