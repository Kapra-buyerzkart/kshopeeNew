import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Share, Clipboard, Alert, ImageBackground } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import Toast from 'react-native-simple-toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { FONTS } from '../styles/typography';
// @ts-ignore
import { getReferralHistoryApi } from '../api/services';
import { useUser } from '../context/UserContext';
import { LoaderContext } from '../context/loaderContext';
import { colors } from '../assets/theme/colours';
import { AppIcons } from '../assets/icons';
import CONFIG from '../globals/config';

interface ReferralItem {
    referrerCustId: number;
    custName: string;
    createdAt: string;
    totalTokensEarned?: string | number;
}

const ReferralScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const { profile } = useUser();
    const { showLoader } = useContext(LoaderContext);

    const [referrals, setReferrals] = useState<ReferralItem[]>([]);
    const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);


    useEffect(() => {
        fetchReferralHistory();
        console.log('profileelelle', profile);
    }, []);

    const fetchReferralHistory = async () => {
        try {
            showLoader(true);
            const response = await getReferralHistoryApi();
            console.log('Referral History Response:', response);
            if (response?.success) {
                const referralData = response?.data?.items || [];
                setReferrals(Array.isArray(referralData) ? referralData : []);
            }
        } catch (error) {
            console.error('Fetch Referral History Error:', error);
        } finally {
            showLoader(false);
            setIsInitialLoad(false);
        }
    };

    const renderItem = ({ item }: { item: ReferralItem }) => {
        const formatDate = (dateString: string) => {
            if (!dateString) return '';
            const [date] = dateString.split('T');
            const [year, month, day] = date.split('-');
            return `${day}-${month}-${year}`;
        };

        const formattedDate = formatDate(item.createdAt);

        return (
            <View style={[styles.listItem, { height: 'auto', paddingVertical: hp('1.5%') }]}>
                <View style={styles.listItemLeft}>
                    <View style={[styles.menuIconContainer, { backgroundColor: colors.homeScreenBackground }]}>
                        <Text style={styles.userInitialText}>{(item.custName || 'U').charAt(0).toUpperCase()}</Text>
                    </View>
                    <View style={{ marginLeft: wp('3%') }}>
                        <Text style={styles.listItemText}>{item.custName || 'User'}</Text>
                    </View>
                </View>
                <View style={styles.listItemRight}>
                    <Text style={styles.registeredLabelMini}>Registered on</Text>
                    <Text style={styles.dateEndText}>{formattedDate}</Text>
                </View>
            </View>
        );
    };

    const renderEmpty = () => {
        if (isInitialLoad) return null;
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No Referral History</Text>
            </View>
        );
    };

    const onShare = async () => {
        try {
            const shareUrl = `${CONFIG.referalUrl}refer/register?custrefcd=${profile?.referralCode || ''}`;
            const message = `Hey! Download KapraDaily and get fresh groceries delivered to your doorstep. Join me using my referral code: ${profile?.referralCode || 'WELCOME'} and enjoy exclusive rewards! Download now: ${shareUrl}`;
            await Share.share({
                message: message,
            });
        } catch (error: any) {
            console.error('Error sharing:', error.message);
        }
    };

    const copyToClipboard = () => {
        Clipboard.setString(profile?.referralCode || 'WELCOME');
        Alert.alert('Copied', 'Referral code copied to clipboard!');
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            {/* <ImageBackground style={styles.backgroundImageStyle} source={require('../assets/icons/profile/topbg.png')}> */}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AppIcons.Back size={wp('6%')} color={colors.black} />
                </TouchableOpacity>
                <Text style={[styles.headerText, { color: colors.black }]}>Referral</Text>
            </View>
            {/* </ImageBackground> */}
            <View style={styles.innerContainer}>
                <View style={{ flex: 1 }}>
                    <View style={styles.unifiedCard}>
                        <View style={styles.solidHeaderRow}>
                            <Image style={styles.solidSpeakerIcon} source={require('../assets/icons/profile/refer.png')} />
                            <View style={styles.solidTitleCol}>
                                <Text style={styles.solidReferTitle}>Refer & Earn</Text>
                                <Text style={styles.solidSubTitle}>Get rewarded for every friend who shops using your invite.</Text>
                            </View>
                        </View>

                        <View style={[styles.solidRewardBox, { marginTop: hp('1.5%') }]}>
                            <Text style={styles.solidRewardLabel}>Your Referral Code</Text>
                            <TouchableOpacity style={styles.referralCodeRow} onPress={copyToClipboard}>
                                <View style={styles.codeContainer}>
                                    <Text style={styles.referralCodeText}>{profile?.referralCode || 'WELCOME'}</Text>
                                </View>
                                <View style={styles.copyIconWrapper}>
                                    <MaterialCommunityIcons name="content-copy" size={wp('4%')} color={colors.themeTeal} />
                                </View>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.solidInviteBtn} onPress={onShare}>
                            <MaterialCommunityIcons name="share-variant" size={wp('5%')} color="#FFFFFF" />
                            <Text style={styles.solidBtnText}>Invite Friends</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.referEarnText, {
                        marginTop: hp('3%'),
                        marginBottom: hp('1%')
                    }]}>Referral History</Text>

                    <FlatList
                        data={referrals}
                        keyExtractor={(item, index) => `${item.referrerCustId}-${index}`}
                        renderItem={renderItem}
                        ListEmptyComponent={renderEmpty}
                        ItemSeparatorComponent={() => <View style={styles.divider} />}
                        ListFooterComponent={() => referrals.length > 0 ? <View style={{ height: hp('2%') }} /> : null}
                        style={referrals.length > 0 ? [styles.historyListCard, { flex: 1 }] : { flex: 1 }}
                        contentContainerStyle={referrals.length === 0 ? styles.emptyListContent : styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

export default ReferralScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#FFFFFF"
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: wp('6%'),
        marginTop: hp('2%'),
    },
    headerText: {
        color: '#000000',
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.65%'),
        marginLeft: wp('4%'),
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
        paddingTop: hp('2%'),
    },
    referEarnText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('4.19%'),
        color: '#000000',
        alignSelf: 'center',
        marginTop: hp('2%')
    },
    divider: {
        height: 1,
        backgroundColor: '#F2F2F2',
        marginHorizontal: wp('4%'),
    },
    historyListCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginHorizontal: wp('4%'),
        marginBottom: hp('1.5%'),
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F2F2F2',
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp('4%'),
    },
    listItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listItemRight: {
        alignItems: 'flex-end',
    },
    menuIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInitialText: {
        color: colors.themeTeal,
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4%'),
    },
    listItemText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.8%'),
        color: '#000000',
    },
    registeredLabelMini: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('2.4%'),
        color: '#777777',
        marginBottom: -hp('0.2%'),
    },
    dateEndText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.2%'),
        color: colors.themeTeal, // Changed from '#F25000'
    },
    listContent: {
        paddingBottom: hp('5%'),
    },
    emptyListContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: hp('10%')
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('4%'),
        color: '#616161',
        marginTop: hp('2%')
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
        marginTop: hp('1%'),
    },
    solidHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('2%')
    },
    solidSpeakerIcon: {
        width: wp('15%'),
        height: wp('15%'),
        resizeMode: 'contain',
    },
    solidTitleCol: {
        marginLeft: wp('3%'),
        flex: 1
    },
    solidReferTitle: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('5.5%'),
        color: '#1A1A1A',
    },
    solidSubTitle: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3%'),
        color: '#666666',
        marginTop: hp('0.5%'),
    },
    solidRewardBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: wp('3%'),
        padding: wp('3%'),
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    solidRewardLabel: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.2%'),
        color: '#777777',
        marginBottom: hp('0.5%')
    },
    solidRewardAmountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    solidCoinIcon: {
        width: wp('6%'),
        height: wp('6%'),
        resizeMode: 'contain',
        marginRight: wp('1.5%')
    },
    solidRewardValue: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('7%'),
        color: '#1A1A1A',
    },
    solidInviteBtn: {
        backgroundColor: colors.themeTeal,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp('10%'),
        paddingVertical: hp('1.5%'),
        marginTop: hp('2.5%'),
        shadowColor: colors.themeTeal,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5
    },
    solidBtnText: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4.2%'),
        color: '#FFFFFF',
        marginLeft: wp('2%')
    },
    referralCodeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp('0.5%'),
    },
    codeContainer: {
        backgroundColor: '#F9F9F9',
        borderWidth: 1,
        borderColor: '#DADADA',
        borderRadius: wp('2%'),
        paddingHorizontal: wp('4%'),
        paddingVertical: hp('0.8%'),
        flex: 1,
        marginRight: wp('2%'),
    },
    referralCodeText: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4%'),
        color: '#000000',
        textAlign: 'center',
    },
    copyIconWrapper: {
        width: wp('10%'),
        height: wp('10%'),
        borderRadius: wp('5%'),
        backgroundColor: colors.wishlistbg,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.outlineTeal,
    }
});
