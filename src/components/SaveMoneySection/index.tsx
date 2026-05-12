import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppIcons } from '../../assets/icons';
import { colors } from '../../assets/theme/colours';
import { saveMoneyStyles as styles } from './styles';

export interface SaveMoneySectionProps {
    appliedCouponCode?: string | null;
    appliedGiftCardCode?: string | null;
    bcoinsAppliedValue?: number;
    availableBCoins?: number;
    onApplyOffer: (offerId: string) => void;
    onRejectOffer: (offerId: string) => void;
}

const SaveMoneySection: React.FC<SaveMoneySectionProps> = ({
    appliedCouponCode,
    appliedGiftCardCode,
    bcoinsAppliedValue = 0,
    availableBCoins = 0,
    onApplyOffer,
    onRejectOffer,
}) => {
    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Save money</Text>
                <MaterialCommunityIcons
                    name="ticket-percent-outline"
                    size={18}
                    color="#000"
                    style={{ alignSelf: 'center', top: -3 }}
                />
            </View>

            <View style={styles.offerCardsList}>
                {/* Coupon */}
                <View
                    style={[
                        styles.offerCard,
                        appliedCouponCode ? { borderColor: colors.green } : undefined,
                    ]}>
                    <View style={[styles.menuIconContainer, { backgroundColor: colors.themeTeal }]}>
                        <Image
                            source={require('../../assets/icons/profile/coupon.png')}
                            style={{ width: 20, height: 20 }}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.offerDetails}>
                        <Text style={styles.offerName}>Coupon</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                            {appliedCouponCode ? (
                                <>
                                    <View style={styles.appliedCouponTag}>
                                        <Text style={styles.appliedCouponText}>
                                            {appliedCouponCode}
                                        </Text>
                                    </View>
                                    <MaterialCommunityIcons
                                        name="check-circle"
                                        size={14}
                                        color={colors.green}
                                        style={styles.checkIcon}
                                    />
                                    <Text style={styles.appliedBadgeText}>Applied</Text>
                                </>
                            ) : (
                                <Text style={[styles.offerSub, { marginTop: 0 }]}>
                                    View all coupons {'>'}
                                </Text>
                            )}
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.applyBtn}
                        onPress={() =>
                            appliedCouponCode
                                ? onRejectOffer('2')
                                : onApplyOffer('2')
                        }>
                        {appliedCouponCode ? (
                            <Text style={[styles.applyBtnText, { color: colors.themeTeal }]}>
                                Remove
                            </Text>
                        ) : (
                            <Text style={styles.applyBtnText}>Apply {'>'}</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Smart Point */}
                <View
                    style={[
                        styles.offerCard,
                        styles.offerCardSpacing,
                        appliedGiftCardCode ? { borderColor: colors.green } : undefined,
                    ]}>
                    <View style={[styles.menuIconContainer, { backgroundColor: colors.themeTeal }]}>
                        <Image
                            source={require('../../assets/icons/profile/gift.png')}
                            style={{ width: 20, height: 20 }}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.offerDetails}>
                        <Text style={styles.offerName}>Smart point</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                            {appliedGiftCardCode ? (
                                <>
                                    <View style={styles.appliedCouponTag}>
                                        <Text style={styles.appliedCouponText}>
                                            {appliedGiftCardCode}
                                        </Text>
                                    </View>
                                    <MaterialCommunityIcons
                                        name="check-circle"
                                        size={14}
                                        color={colors.green}
                                        style={styles.checkIcon}
                                    />
                                    <Text style={styles.appliedBadgeText}>Applied</Text>
                                </>
                            ) : (
                                <Text style={[styles.offerSub, { marginTop: 0 }]}>
                                    View all gift cards {'>'}
                                </Text>
                            )}
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.applyBtn}
                        onPress={() =>
                            appliedGiftCardCode
                                ? onRejectOffer('4')
                                : onApplyOffer('4')
                        }>
                        {appliedGiftCardCode ? (
                            <Text style={[styles.applyBtnText, { color: '#FF4D4D' }]}>
                                Remove
                            </Text>
                        ) : (
                            <Text style={styles.applyBtnText}>Apply {'>'}</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* B-coin */}
                <View
                    style={[
                        styles.offerCard,
                        styles.offerCardSpacing,
                        bcoinsAppliedValue > 0 ? { borderColor: colors.green } : undefined,
                    ]}>
                    <View style={[styles.menuIconContainer, { backgroundColor: colors.themeTeal }]}>
                        <Image
                            source={require('../../assets/icons/profile/rupee.png')}
                            style={{ width: 20, height: 20 }}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.offerDetails}>
                        <Text style={styles.offerName}>B-coin</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                            {bcoinsAppliedValue > 0 ? (
                                <>
                                    <View style={styles.appliedCouponTag}>
                                        <Text style={styles.appliedCouponText}>
                                            ₹{bcoinsAppliedValue}
                                        </Text>
                                    </View>
                                    <MaterialCommunityIcons
                                        name="check-circle"
                                        size={14}
                                        color={colors.green}
                                        style={styles.checkIcon}
                                    />
                                    <Text style={styles.appliedBadgeText}>Applied</Text>
                                </>
                            ) : (
                                <Text style={[styles.offerSub, { marginTop: 0 }]}>
                                    Available B-coins : {availableBCoins}
                                </Text>
                            )}
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.applyBtn}
                        onPress={() =>
                            bcoinsAppliedValue > 0
                                ? onRejectOffer('3')
                                : onApplyOffer('3')
                        }>
                        {bcoinsAppliedValue > 0 ? (
                            <Text style={[styles.applyBtnText, { color: '#FF4D4D' }]}>
                                Remove
                            </Text>
                        ) : (
                            <Text style={styles.applyBtnText}>Apply {'>'}</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default React.memo(SaveMoneySection);
