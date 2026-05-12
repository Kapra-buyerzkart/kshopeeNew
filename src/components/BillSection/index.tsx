import React from 'react';
import { View, Text, Image, ImageBackground } from 'react-native';
import { colors } from '../../assets/theme/colours';
import { Fonts } from '../../assets/theme/fonts';
import { billSectionStyles as styles } from './styles';

export interface BillCalculations {
    mrpTotal?: number;
    itemTotal?: number;
    savings?: number;
    deliveryCharge?: number;
    totalTax?: number;
    couponDiscount?: number;
    giftCardAmount?: number;
    bcoinsAppliedValue?: number;
    totalSavings?: number;
    toPay?: number;
}

interface BillRowProps {
    label: string;
    value: string;
    isGreen?: boolean;
}

const BillRow: React.FC<BillRowProps> = ({ label, value, isGreen }) => (
    <View style={styles.billContentContainer}>
        <Text style={styles.billContentText}>{label}</Text>
        <Text style={[styles.priceText, isGreen && { color: colors.green }]}>
            {value}
        </Text>
    </View>
);

interface BillSectionProps {
    billCalculations: BillCalculations;
}

const BillSection: React.FC<BillSectionProps> = ({ billCalculations }) => {
    const {
        itemTotal = 0,
        savings = 0,
        deliveryCharge = 0,
        totalTax = 0,
        couponDiscount = 0,
        giftCardAmount = 0,
        bcoinsAppliedValue = 0,
        totalSavings = 0,
        toPay = 0,
    } = billCalculations;

    const absSavings = Math.abs(savings);
    const absCouponDiscount = Math.abs(couponDiscount);
    const absGiftCardAmount = Math.abs(giftCardAmount);
    const absBcoinsAppliedValue = Math.abs(bcoinsAppliedValue);

    return (
        <ImageBackground
            style={styles.billImageBackground}
            imageStyle={styles.billImageStyle}
            source={require('../../assets/images/bill_background.png')}>
            <View style={styles.billHeaderContainer}>
                <Image
                    style={styles.billIcon}
                    source={require('../../assets/images/bill_icon.png')}
                />
                <Text style={styles.billHeaderText}>View Your Bill</Text>
            </View>
            <View>
                {/* Item Total (MRP) */}
                <BillRow label="Item Total" value={`₹${(billCalculations.mrpTotal || (itemTotal + savings)).toFixed(2)}`} />

                {/* Discount */}
                {absSavings > 0 && (
                    <BillRow label="Discount" value={`- ₹${absSavings.toFixed(2)}`} isGreen />
                )}

                {/* Delivery */}
                <BillRow
                    label="Delivery Charge"
                    value={deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toFixed(2)}`}
                    isGreen={deliveryCharge === 0}
                />

                {/* Tax */}
                {totalTax > 0 && (
                    <BillRow label="Tax" value={`₹${totalTax.toFixed(2)}`} />
                )}

                {/* Coupon */}
                {absCouponDiscount > 0 && (
                    <BillRow label="Coupon Discount" value={`- ₹${absCouponDiscount.toFixed(2)}`} isGreen />
                )}

                {/* Gift Card */}
                {absGiftCardAmount > 0 && (
                    <BillRow label="GiftCard Applied" value={`- ₹${absGiftCardAmount.toFixed(2)}`} isGreen />
                )}

                {/* B-Coins */}
                {absBcoinsAppliedValue > 0 && (
                    <BillRow label="Bcoins Applied" value={`- ₹${absBcoinsAppliedValue.toFixed(2)}`} isGreen />
                )}

                <View style={styles.billDivider} />
                <View style={styles.billSumView}>
                    <Text style={styles.billSumText}>To Pay</Text>
                    <Text style={styles.billSumText}>₹{toPay.toFixed(2)}</Text>
                </View>

                {/* Savings */}
                {totalSavings > 0 && (
                    <Text style={styles.savingsText}>
                        You saved : ₹{totalSavings.toFixed(2)}
                    </Text>
                )}
            </View>
        </ImageBackground>
    );
};

export default React.memo(BillSection);
