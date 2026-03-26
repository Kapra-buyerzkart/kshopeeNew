import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    SafeAreaView, 
    Dimensions,
    ActivityIndicator,
    Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../assets/theme/colours';
import { Fonts } from '../../assets/theme/fonts';
import { AppIcons } from '../../assets/icons';

const { width } = Dimensions.get('window');

const OrderPendingScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { orderId, orderNumber } = route.params || {};

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.pendingIconContainer}>
                    <LinearGradient
                        colors={['#FFB300', '#FFA000']}
                        style={styles.iconGradient}
                    >
                        <ActivityIndicator size="large" color={colors.white} />
                    </LinearGradient>
                </View>

                <Text style={styles.title}>Payment Pending</Text>
                <Text style={styles.subtitle}>
                    We are waiting for a confirmation from your bank. This usually takes a few minutes. 
                    Your order will be processed once the payment is confirmed.
                </Text>

                <View style={styles.orderInfo}>
                    <Text style={styles.orderLabel}>Order Number: </Text>
                    <Text style={styles.orderValue}>#{orderNumber || orderId}</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity 
                    style={styles.myOrdersButton}
                    onPress={() => navigation.navigate('MyOrder')}
                >
                    <LinearGradient
                        colors={[colors.themeTeal, colors.themeDarkTeal]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.buttonGradient}
                    >
                        <Text style={styles.myOrdersButtonText}>Check Order Status</Text>
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
    pendingIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 30,
        ...Platform.select({
            ios: {
                shadowColor: '#FFB300',
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
        marginBottom: 30,
    },
    orderInfo: {
        flexDirection: 'row',
        backgroundColor: '#FFF8E1',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFE082',
    },
    orderLabel: {
        fontSize: 14,
        fontFamily: Fonts.gilroyMedium,
        color: '#999',
    },
    orderValue: {
        fontSize: 14,
        fontFamily: Fonts.gilroyBold,
        color: '#FFB300',
    },
    footer: {
        padding: 30,
        gap: 15,
    },
    myOrdersButton: {
        height: 56,
        borderRadius: 16,
        overflow: 'hidden',
    },
    buttonGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    myOrdersButtonText: {
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

export default OrderPendingScreen;
