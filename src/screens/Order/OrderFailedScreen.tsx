import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    SafeAreaView, 
    Dimensions,
    Image,
    Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../assets/theme/colours';
import { Fonts } from '../../assets/theme/fonts';
import { AppIcons } from '../../assets/icons';

const { width } = Dimensions.get('window');

const OrderFailedScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { errorMessage, orderId, orderNumber } = route.params || {};

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.failedIconContainer}>
                    <LinearGradient
                        colors={['#FF5252', '#D32F2F']}
                        style={styles.iconGradient}
                    >
                        <AppIcons.Delete color={colors.white} size={60} />
                    </LinearGradient>
                </View>

                <Text style={styles.title}>Payment Failed</Text>
                <Text style={styles.subtitle}>
                    {errorMessage || "We were unable to process your payment. Please try again or use a different payment method."}
                </Text>

                {orderNumber && (
                    <View style={styles.orderInfo}>
                        <Text style={styles.orderLabel}>Reference ID: </Text>
                        <Text style={styles.orderValue}>#{orderNumber}</Text>
                    </View>
                )}
            </View>

            <View style={styles.footer}>
                <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={() => navigation.goBack()}
                >
                    <LinearGradient
                        colors={[colors.themeTeal, colors.themeDarkTeal]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.buttonGradient}
                    >
                        <Text style={styles.retryButtonText}>Retry Payment</Text>
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
    failedIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 30,
        ...Platform.select({
            ios: {
                shadowColor: '#FF5252',
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
        marginBottom: 20,
    },
    orderInfo: {
        flexDirection: 'row',
        backgroundColor: '#FFF5F5',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFDADA',
    },
    orderLabel: {
        fontSize: 14,
        fontFamily: Fonts.gilroyMedium,
        color: '#999',
    },
    orderValue: {
        fontSize: 14,
        fontFamily: Fonts.gilroyBold,
        color: '#FF5252',
    },
    footer: {
        padding: 30,
        gap: 15,
    },
    retryButton: {
        height: 56,
        borderRadius: 16,
        overflow: 'hidden',
    },
    buttonGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    retryButtonText: {
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

export default OrderFailedScreen;
