import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, RefreshControl, ImageBackground, Modal } from 'react-native';
import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCart } from '../context/CartContext';
// @ts-ignore
import { SafeAreaView } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import { useNavigation } from '@react-navigation/native';
// @ts-ignore
import { getWalletDataApi, redeemBCoinsApi, getBCoinValueChangesApi } from '../api/userService';
import { colors } from '../assets/theme/colours';
import { AppIcons } from '../assets/icons';

interface BCoinHistoryItem {
    historyId: string | number;
    description: string;
    transactionDate: string;
    transactionType: string;
    amount: number;
}

interface BCoinRateHistoryItem {
    id?: string | number;
    updatedOn: string;
    bCoinValue?: number;
    newValue?: number;
    value?: number;
    changeType?: 'up' | 'down';
}

const BCoinScreen: React.FC = () => {
    const [selected, setSelected] = useState<'bcoin' | 'btoken'>('bcoin');
    const [showModal, setShowModal] = useState(false);
    const [walletData, setWalletData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [bCoinValueHistory, setBCoinValueHistory] = useState<BCoinRateHistoryItem[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    // Redemption State
    const [showRedeemModal, setShowRedeemModal] = useState(false);
    const [requestedCoins, setRequestedCoins] = useState('');
    const [preferredMethod, setPreferredMethod] = useState<'bank' | 'wallet'>('bank');
    const [isRedeeming, setIsRedeeming] = useState(false);

    const navigation = useNavigation<any>();

    // Dummy data since AppContext is missing in the current project structure
    const isStoreUnavailable = false;
    const storeUnavailableData = { image: null, text: '' };
    const profile = {
        custId: 'dummy-id',
        referralCode: 'WELCOME',
        referralEarning: '0.00'
    };
    const generalSettings = {
        show_temporary_message: '0'
    };

    const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
    const isMounted = useRef(true);

    const showHistoryNote = generalSettings?.show_temporary_message === '1';

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (profile?.custId) {
            fetchWalletData();
        }
    }, [profile?.custId]);

    const fetchWalletData = async () => {
        if (!isMounted.current) return;
        setIsLoading(true);
        try {
            const response = await getWalletDataApi();
            if (isMounted.current && response && response.success) {
                setWalletData(response.data);
            }
        } catch (error) {
            console.error('Error fetching wallet data:', error);
        } finally {
            if (isMounted.current) setIsLoading(false);
        }
    };

    const fetchBCoinValueHistory = async () => {
        if (!isMounted.current) return;
        setIsLoadingHistory(true);
        try {
            const response = await getBCoinValueChangesApi();
            if (isMounted.current && response && response.success && response.data && response.data.items) {
                const items = [...response.data.items];

                // Sort purely chronologically (oldest first) to compare correctly
                items.sort((a, b) => new Date(a.updatedOn).getTime() - new Date(b.updatedOn).getTime());

                const mappedItems: BCoinRateHistoryItem[] = items.map((item, index) => {
                    let changeType: 'up' | 'down' = 'up';
                    if (index > 0) {
                        const prevValue = items[index - 1].bCoinValue;
                        if (item.bCoinValue < prevValue) {
                            changeType = 'down';
                        }
                    }
                    return {
                        ...item,
                        changeType
                    };
                });

                // Present newest first
                setBCoinValueHistory(mappedItems.reverse());
            }
        } catch (error) {
            console.error('Error fetching B-Coin value history:', error);
        } finally {
            if (isMounted.current) setIsLoadingHistory(false);
        }
    };

    const handleRedeem = async () => {
        const redeemAmount = Number(requestedCoins);

        if (isNaN(redeemAmount) || redeemAmount <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount of coins to redeem.');
            return;
        }

        if (redeemAmount > (walletData?.wallet?.bCoins || 0)) {
            Alert.alert('Insufficient Balance', 'You do not have enough B-Coins.');
            return;
        }

        setIsRedeeming(true);
        try {
            const payload = {
                requestedCoins: Number(requestedCoins),
                preferredMethod: preferredMethod
            };
            const response = await redeemBCoinsApi(payload);

            if (!isMounted.current) return;

            setShowRedeemModal(false);

            setTimeout(() => {
                if (!isMounted.current) return;

                if (response && response.success) {
                    setRequestedCoins('');
                    fetchWalletData(); // Refresh data
                    Alert.alert('Success', response.message || 'Redemption request submitted successfully.');
                } else {
                    let title = 'Error';
                    let message = response?.message || 'Failed to submit redemption request.';

                    if (response?.status === 'PENDING_REQUEST') {
                        title = 'Request Pending';
                    } else if (response?.status === 'INSUFFICIENT_BALANCE') {
                        title = 'Insufficient Balance';
                    }

                    Alert.alert(title, message);
                }
            }, 500);
        } catch (error) {
            console.error('Redemption error:', error);
            if (isMounted.current) {
                setShowRedeemModal(false);
                setTimeout(() => {
                    if (!isMounted.current) return;
                    Alert.alert('Error', 'An error occurred while processing your request.');
                }, 500);
            }
        } finally {
            if (isMounted.current) setIsRedeeming(false);
        }
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <ImageBackground style={styles.backgroundImageStyle} source={require('../assets/images/bcoinbgg.png')}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <AppIcons.Back size={wp('6%')} color={colors.themeWhite} />
                    </TouchableOpacity>
                    <Text style={[styles.headerText, { color: colors.themeWhite }]}>B-Coin and B-token</Text>
                </View>
            </ImageBackground>
            <View style={styles.innerContainer}>
                <View style={{ flex: 1 }}>
                    <View style={styles.unifiedCard}>
                        {/* B-Coin Row */}
                        <View style={styles.cardRow}>
                            <View style={[styles.menuIconContainer, { backgroundColor: colors.themeTeal }]}>
                                <MaterialCommunityIcons name="currency-inr" size={20} color={colors.themeWhite} />
                            </View>
                            <Text style={styles.cardTitle}>B-Coin</Text>
                            <View style={styles.balanceContainer}>
                                <Text style={styles.balanceLabel}>Available balance : </Text>
                                <View style={styles.balancePill}>
                                    <Text style={styles.balanceValue}>{walletData?.wallet?.bCoins || '0'}</Text>
                                </View>
                            </View>
                        </View>

                        {/* B-Coin Value Row */}
                        <TouchableOpacity
                            onPress={() => {
                                fetchBCoinValueHistory();
                                setShowModal(true);
                            }}
                            style={styles.valueRow}
                        >
                            <Text style={styles.valueLabel}>Today’s B-coin value : </Text>
                            <Text style={styles.valueHighlight}>₹{walletData?.wallet?.bCoinValue || '0'}</Text>
                            <AppIcons.Forward size={18} color={colors.themeTeal} style={{ marginLeft: wp('2%') }} />
                        </TouchableOpacity>

                        <View style={styles.cardDivider} />

                        {/* B-Token Row */}
                        <View style={styles.cardRow}>
                            <View style={[styles.menuIconContainer, { backgroundColor: colors.themeTeal }]}>
                                <MaterialCommunityIcons name="ticket-percent" size={20} color={colors.themeWhite} />
                            </View>
                            <Text style={styles.cardTitle}>B-Token</Text>
                            <View style={styles.balanceContainer}>
                                <Text style={styles.balanceLabel}>Available balance : </Text>
                                <View style={styles.balancePill}>
                                    <Text style={styles.balanceValue}>{walletData?.wallet?.bTokens || '0'}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.historyHeaderRow}>
                        <Text style={styles.historyHeaderText}>History</Text>
                    </View>
                    <View style={styles.bcoinTokenHeaderContainer}>
                        <TouchableOpacity onPress={() => setSelected('bcoin')} style={selected === 'bcoin' ? (
                            [styles.bcoinSingleContainer, {
                                borderBottomWidth: hp('0.43%'),
                                borderBottomColor: colors.themeTeal,
                            }]
                        ) : (styles.bcoinSingleContainer)}>
                            <Text style={selected === 'bcoin' ? (
                                [styles.bcoinSingleText, {
                                    color: colors.themeTeal
                                }]
                            ) : (styles.bcoinSingleText)}>B-Coin</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSelected('btoken')} style={selected === 'btoken' ? (
                            [styles.bcoinSingleContainer, {
                                borderBottomWidth: hp('0.43%'),
                                borderBottomColor: colors.themeTeal,
                            }]
                        ) : (styles.bcoinSingleContainer)}>
                            <Text style={selected === 'btoken' ? (
                                [styles.bcoinSingleText, {
                                    color: colors.themeTeal
                                }]
                            ) : (styles.bcoinSingleText)}>B-Token</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        {(selected === 'bcoin' ? walletData?.bcoinHistory : walletData?.btokenHistory)?.map((item: BCoinHistoryItem, index: number, array: BCoinHistoryItem[]) => (
                            <View key={item.historyId} style={[styles.bcoinContainer, {
                                borderBottomWidth: index === array.length - 1 ? 0 : 1
                            }]}>
                                <View style={{ flex: 1, marginLeft: wp('3%') }}>
                                    <Text style={styles.bcoinContent}>{item.description}</Text>
                                    <View style={{ marginTop: hp('0.5%') }}>
                                        <Text style={[styles.bcoinContent, {
                                            fontSize: wp('3.1%'),
                                            color: '#727783'
                                        }]}>
                                            {item.transactionDate ? new Date(item.transactionDate).toLocaleDateString('en-IN', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            }) : ''}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={[styles.bcoinPriceTextTwo, {
                                    color: item.transactionType === 'credit' || item.transactionType === 'Credit' ? '#0CA201' : '#FF0000'
                                }]}>
                                    {item.transactionType === 'credit' || item.transactionType === 'Credit' ? '+' : ''}{item.amount.toFixed(2)} {selected === 'bcoin' ? 'coins' : 'tokens'}
                                </Text>
                            </View>
                        ))}
                        {!isLoading && (!walletData || (selected === 'bcoin' ? walletData?.bcoinHistory?.length === 0 : walletData?.btokenHistory?.length === 0)) && (
                            <View style={{ alignItems: 'center', marginTop: hp('5%') }}>
                                <Text style={styles.viewText}>No history available</Text>
                            </View>
                        )}
                    </ScrollView>
                    {showHistoryNote && (
                        <View style={[styles.historyNoteContainer, { marginHorizontal: wp('5%'), marginBottom: hp('1%') }]}>
                            <Text style={styles.historyNoteText}>
                                This app displays only the most recent transaction history
                            </Text>
                        </View>
                    )}
                </View>
            </View>
            <TouchableOpacity onPress={() => setShowRedeemModal(true)} style={styles.redeemButton}>
                <Text style={styles.redeemText}>Redeem B-Coin</Text>
            </TouchableOpacity>

            {/* Redeem Modal */}
            <Modal
                visible={showRedeemModal}
                animationType='slide'
                transparent
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeaderContainer}>
                            <Text style={styles.modalHeaderText}>Redeem B-Coin</Text>
                            <TouchableOpacity onPress={() => setShowRedeemModal(false)}>
                                <AppIcons.Close size={wp('6%')} color={colors.themeBlack} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ paddingHorizontal: wp('5%') }}>
                            <Text style={styles.availableBalanceHeaderText}>Requested Coins</Text>
                            <TextInput
                                style={styles.redeemInput}
                                placeholder="Enter requested B-Coin"
                                placeholderTextColor="#AAAAAA"
                                keyboardType="numeric"
                                value={requestedCoins}
                                onChangeText={setRequestedCoins}
                            />

                            <Text style={[styles.availableBalanceHeaderText, { marginTop: hp('2%') }]}>Preferred Method</Text>
                            <View style={styles.methodContainer}>
                                <TouchableOpacity
                                    onPress={() => setPreferredMethod('bank')}
                                    style={[styles.methodButton, preferredMethod === 'bank' && styles.methodButtonActive]}
                                >
                                    <Text style={[styles.methodText, preferredMethod === 'bank' && styles.methodTextActive]}>Bank Transfer</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setPreferredMethod('wallet')}
                                    style={[styles.methodButton, preferredMethod === 'wallet' && styles.methodButtonActive]}
                                >
                                    <Text style={[styles.methodText, preferredMethod === 'wallet' && styles.methodTextActive]}>Wallet</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                onPress={handleRedeem}
                                disabled={isRedeeming}
                                style={[styles.redeemButton, { marginTop: hp('4%'), width: '100%', marginBottom: hp('2%') }]}
                            >
                                {isRedeeming ? (
                                    <ActivityIndicator color="#FFF" />
                                ) : (
                                    <Text style={styles.redeemText}>Submit Request</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Rate History Modal */}
            <Modal
                visible={showModal}
                animationType='slide'
                transparent
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeaderContainer}>
                            <Text style={styles.modalHeaderText}>B-Coin rate history</Text>
                            <TouchableOpacity onPress={() => setShowModal(false)}>
                                <AppIcons.Close size={wp('6%')} color={colors.themeBlack} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            {isLoadingHistory ? (
                                <ActivityIndicator size="large" color={colors.themeTeal} style={{ marginTop: hp('5%') }} />
                            ) : bCoinValueHistory && bCoinValueHistory.length > 0 ? (
                                bCoinValueHistory.map((item, index) => (
                                    <View key={item.id || index} style={styles.bcoinRateSingleContainer}>
                                        <View style={{ width: wp('30%') }}>
                                            <Text style={styles.dateText}>
                                                {item.updatedOn ? new Date(item.updatedOn).toLocaleDateString('en-IN', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                }) : ''}
                                            </Text>
                                        </View>
                                        <View style={{ width: wp('40%') }}>
                                            <Text style={styles.timeText}>
                                                {item.updatedOn ? new Date(item.updatedOn).toLocaleTimeString('en-IN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true
                                                }) : ''}
                                            </Text>
                                        </View>
                                        <View style={styles.rateView}>
                                            <Text style={[styles.rateText, {
                                                color: item.changeType === 'down' ? colors.red : colors.green
                                            }]}>₹{item.bCoinValue?.toFixed(2) || (item.newValue || item.value || 0)}</Text>
                                            {item.changeType === 'down' ? (
                                                <AppIcons.ArrowDown size={wp('4%')} color={colors.red} />
                                            ) : (
                                                <AppIcons.ArrowUp size={wp('4%')} color={colors.green} />
                                            )}
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <View style={{ alignItems: 'center', marginTop: hp('5%') }}>
                                    <Text style={styles.viewText}>No history available</Text>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default BCoinScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: wp('4.65%'),
        marginTop: hp('4%'),
    },
    leftArrowIcon: {
        width: wp('2.33%'),
        height: hp('2.03%'),
        resizeMode: 'contain'
    },
    headerText: {
        color: '#000000',
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.65%'),
        marginLeft: wp('6%')
    },
    backgroundImageStyle: {
        height: hp('35%'),
        resizeMode: 'cover',
    },
    innerContainer: {
        backgroundColor: colors.themeWhite,
        flex: 1,
        borderTopLeftRadius: wp('10%'),
        borderTopRightRadius: wp('10%'),
        marginTop: -hp('4%'),
        paddingTop: hp('2%'),
    },
    unifiedCard: {
        width: wp('92%'),
        backgroundColor: colors.themeWhite,
        borderRadius: wp('8%'),
        alignSelf: 'center',
        padding: wp('5%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: hp('1%'),
    },
    cardTitle: {
        flex: 1,
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.5%'),
        color: '#000000',
        marginLeft: wp('3%'),
    },
    balanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    balanceLabel: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.2%'),
        color: '#666666',
    },
    balancePill: {
        backgroundColor: colors.themeTeal,
        borderRadius: wp('10%'),
        paddingHorizontal: wp('4%'),
        paddingVertical: hp('0.5%'),
        minWidth: wp('18%'),
        alignItems: 'center',
    },
    balanceValue: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('3.8%'),
        color: colors.themeWhite,
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: wp('12%'),
        marginTop: -hp('0.5%'),
        paddingBottom: hp('1.5%'),
    },
    valueLabel: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.2%'),
        color: '#666666',
    },
    valueHighlight: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('3.8%'),
        color: colors.themeTeal,
    },
    cardDivider: {
        height: 1,
        backgroundColor: '#EEEEEE',
        marginVertical: hp('1.5%'),
    },
    menuIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bcoinText: {
        flex: 1,
        fontSize: wp('4%'),
        fontFamily: FONTS.poppins.semiBold,
        color: '#000000',
        marginLeft: wp('3%'),
    },
    bcoinInnerView: {
        alignItems: 'flex-end',
    },
    availableBalanceHeaderText: {
        color: '#616161',
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('2.32%')
    },
    availableBalanceValueText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.65%'),
        color: colors.themeTeal,
    },
    bcoinInnerViewTwo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bcoinTextTwo: {
        fontFamily: FONTS.poppins.regular,
        color: '#616161',
        fontSize: wp('2.79%')
    },
    bcoinPriceText: {
        fontFamily: FONTS.poppins.semiBold,
        color: '#000000',
        fontSize: wp('2.79%')
    },
    viewText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('2.79%'),
        color: '#616161'
    },
    rightArrowsIcon: {
        width: wp('3.72%'),
        height: hp('1.07%'),
        marginLeft: wp('2.5%')
    },
    historyHeaderText: {
        color: '#000000',
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('4.19%'),
        marginTop: hp('3%'),
        alignSelf: 'center'
    },
    bcoinTokenHeaderContainer: {
        flexDirection: 'row',
        marginTop: hp('2%'),
        alignSelf: 'center'
    },
    bcoinSingleContainer: {
        alignItems: 'center',
        width: wp('38.4%'),
        paddingBottom: hp('0.4%'),
    },
    bcoinSingleText: {
        color: '#616161',
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.72%')
    },
    bcoinContainer: {
        flexDirection: 'row',
        width: wp('90.7%'),
        justifyContent: 'space-between',
        alignSelf: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
        paddingBottom: hp('1.5%'),
        marginTop: hp('1.5%'),
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('3%')
    },
    bcoinImageTwo: {
        width: wp('5.98%'),
        height: wp('5.98%'),
        resizeMode: 'contain'
    },
    bcoinContent: {
        fontFamily: FONTS.poppins.regular,
        color: '#000000',
        fontSize: wp('2.56%'),
    },
    bcoinPriceTextTwo: {
        color: '#FF0000',
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3.49%')
    },
    redeemButton: {
        width: wp('90.7%'),
        height: hp('6.11%'),
        backgroundColor: colors.themeTeal,
        borderRadius: wp('10.33%'),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    redeemText: {
        color: '#FFFFFF',
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4.18%')
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: wp('9.3%'),
        borderTopRightRadius: wp('9.3%'),
        paddingVertical: hp('3.11%'),
        maxHeight: hp('70%'),
    },
    modalHeaderContainer: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp('4.65%'),
        borderBottomWidth: 1,
        borderBottomColor: '#8F8F8F40',
        paddingBottom: hp('1%'),
        marginBottom: hp('2.7%')
    },
    modalHeaderText: {
        color: '#000000',
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.65%')
    },
    closeIcon: {
        height: wp('3.72%'),
        width: wp('3.72%'),
        resizeMode: 'contain'
    },
    bcoinRateSingleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: wp('5.5%'),
        marginBottom: hp('1%')
    },
    dateText: {
        color: '#000000',
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.72%'),
        width: wp('30%')
    },
    timeText: {
        color: '#000000',
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.72%'),
        width: wp('40%')
    },
    rateView: {
        flexDirection: 'row',
        alignItems: 'center',
        width: wp('30%')
    },
    rateText: {
        color: '#FF0000',
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.25%')
    },
    upImage: {
        width: wp('3.02%'),
        height: hp('0.86%'),
        resizeMode: 'contain',
        marginLeft: wp('1%')
    },
    redeemInput: {
        borderWidth: 1,
        borderColor: '#DADADA',
        borderRadius: wp('2%'),
        paddingHorizontal: wp('4%'),
        paddingVertical: hp('1.5%'),
        marginTop: hp('1%'),
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('4%'),
        color: '#000',
        backgroundColor: '#F9F9F9'
    },
    methodContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('1.5%'),
    },
    methodButton: {
        flex: 0.48,
        borderWidth: 1,
        borderColor: '#DADADA',
        borderRadius: wp('2%'),
        paddingVertical: hp('1.5%'),
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
    methodButtonActive: {
        borderColor: colors.themeTeal,
        backgroundColor: colors.homeScreenBackground
    },
    methodText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.72%'),
        color: '#616161'
    },
    methodTextActive: {
        color: colors.themeTeal
    },
    historyHeaderRow: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginTop: hp('2%'),
        marginBottom: hp('1%'),
    },
    historyNoteContainer: {
        backgroundColor: colors.homeScreenBackground,
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('0.8%'),
        borderRadius: wp('2%'),
        marginTop: hp('0.5%'),
        borderLeftWidth: 3,
        borderLeftColor: colors.themeTeal,
    },
    historyNoteText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('2.8%'),
        color: colors.themeTeal,
    },
});
