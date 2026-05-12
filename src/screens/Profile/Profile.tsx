import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

import { colors } from '../../assets/theme/colours';
import { styles } from './styles';
import { AppIcons } from '../../assets/icons';
import { hp, wp } from '../../utils/responsive';

import { useUser } from '../../context/UserContext';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useCustomAlert } from '../../context/AlertContext';
import { LoaderContext } from '../../context/loaderContext';
import {
  deleteAccountApi,
  getWalletDataApi,
} from '../../api/services/userService';
import Toast from 'react-native-simple-toast';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { logout, profile, loadProfile } = useUser();
  const { showAlert } = useCustomAlert();
  const loader = React.useContext(LoaderContext);
  const showLoader = loader ? loader.showLoader : () => {};

  const [isLogoutModalVisible, setIsLogoutModalVisible] = React.useState(false);
  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] =
    React.useState(false);
  const [walletData, setWalletData] = React.useState<any>(null);
  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    loadProfile();
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const response = await getWalletDataApi();
      if (response && response.success) {
        setWalletData(response.data);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    }, []),
  );

  const handleLogout = async () => {
    setIsLogoutModalVisible(false);
    await logout();
  };

  const handleDeleteAccount = async () => {
    setIsDeleteAccountModalVisible(false);
    showLoader(true);
    try {
      const response = await deleteAccountApi();
      if (response && response.success) {
        await logout();
        Toast.show('Account deleted successfully', Toast.SHORT);
      } else {
        showAlert(
          'Error',
          response?.message ||
            'Failed to delete account. Please try again later.',
        );
      }
    } catch (error) {
      console.error('Delete account error:', error);
      showAlert('Error', 'An error occurred while deleting your account.');
    } finally {
      showLoader(false);
    }
  };

  const renderMenuItem = (
    icon: any,
    title: string,
    showBadge?: boolean,
    badgeValue?: string,
    iconBgColor?: string,
    onPress?: () => void,
  ) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View
        style={[
          styles.menuIconContainer,
          iconBgColor ? { backgroundColor: iconBgColor } : null,
        ]}
      >
        {icon}
      </View>
      <Text style={styles.menuItemText}>{title}</Text>
      {showBadge && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{badgeValue}</Text>
        </View>
      )}
      <MaterialIcons name="chevron-right" size={24} color="#C7C7CC" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <ImageBackground
          style={[
            styles.backgroundImage,
            { paddingTop: hp('2%'), paddingBottom: hp('2%') },
          ]}
          imageStyle={{
            borderBottomLeftRadius: wp('10%'),
            borderBottomRightRadius: wp('10%'),
          }}
          source={require('../../assets/icons/profile/topbg.png')}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={28} color={colors.black} />
            </TouchableOpacity>

            <View style={styles.userInfoContainer}>
              <View style={styles.userProfileSection}>
                <View style={styles.avatarContainer}>
                  <MaterialIcons
                    name="person"
                    size={40}
                    color={colors.themeTeal}
                  />
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.welcomeText}>Hey</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.userName} numberOfLines={1}>
                      {profile?.custName || 'User'}
                    </Text>
                    {/* <TouchableOpacity 
                          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                          onPress={() => navigation.navigate('EditProfile')} 
                          style={{ marginLeft: wp('2%'), zIndex: 99, elevation: 99 }}
                      >
                          <MaterialIcons name="edit" size={wp('4%')} color={colors.themeLightTeal || "#F25000"} />
                      </TouchableOpacity> */}
                  </View>
                  <Text style={styles.userPhone}>{profile?.phoneNo || ''}</Text>
                </View>
              </View>

              <View style={styles.headerRightActions}>
                <TouchableOpacity onPress={() => navigation.navigate('BCoin')}>
                  <Image
                    source={require('../../assets/icons/profile/bcoin.png')}
                    style={{ width: 75, height: 75, top: -5 }}
                    resizeMode="contain"
                  />
                  {/* <Text style={[styles.coinText, { position: 'absolute', right: wp('2%'), top: hp('1.5%'), color: colors.black, fontWeight: 'bold' }]}>
                                        {profile?.totalBCoins || '0.00'}
                                    </Text> */}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.notificationBell}
                  onPress={() =>
                    showAlert('Notifications', 'You have no new notifications.')
                  }
                >
                  <Ionicons
                    name="notifications"
                    size={24}
                    color={colors.black}
                    style={{ top: -5 }}
                  />
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={{ marginLeft: wp('2%') }}>
                                    <Image
                                        source={require('../../assets/images/edit_icon.png')}
                                        style={{ width: 18, height: 18, top: -15 }}
                                        tintColor={colors.black}
                                    />
                                </TouchableOpacity> */}
              </View>
            </View>
          </View>
        </ImageBackground>

        {/* Quick Action Cards */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Cart')}
          >
            <Image
              source={require('../../assets/icons/profile/cart.png')}
              style={{ width: 22, height: 22 }}
            />
            <Text style={styles.actionText}>Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('MyOrder')}
          >
            <Image
              source={require('../../assets/icons/profile/orders.png')}
              style={{ width: 22, height: 22 }}
            />
            <Text style={styles.actionText}>My Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('SavedAddressScreen')}
          >
            <Image
              source={require('../../assets/icons/profile/location.png')}
              style={{ width: 22, height: 22 }}
              resizeMode="contain"
            />
            <Text style={styles.actionText}>Address</Text>
          </TouchableOpacity>
        </View>

        {/* Refer and Earn Banner */}

        <TouchableOpacity onPress={() => navigation.navigate('Referral')}>
          <Image
            source={require('../../assets/icons/profile/refer.png')}
            style={styles.referIllustration}
            resizeMode="contain"
          />
        </TouchableOpacity>
        {/* Account Security Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account Security</Text>
          <View style={styles.menuCard}>
            {renderMenuItem(
              <Image
                source={require('../../assets/icons/profile/profile.png')}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />,
              'Edit profile',
              false,
              '1',
              undefined,
              () => navigation.navigate('EditProfile'),
            )}
            {renderMenuItem(
              <MaterialCommunityIcons
                name="phone-outline"
                size={20}
                color={colors.themeTeal}
              />,
              'Update Phone Number',
              false,
              undefined,
              undefined,
              () =>
                navigation.navigate('UpdateContactScreen', { type: 'phone' }),
            )}
            {renderMenuItem(
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                color={colors.themeTeal}
              />,
              'Update Email ID',
              false,
              undefined,
              undefined,
              () =>
                navigation.navigate('UpdateContactScreen', { type: 'email' }),
            )}
          </View>
        </View>
        {/* Offers Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Offers</Text>
          <View style={styles.menuCard}>
            {renderMenuItem(
              <Image
                source={require('../../assets/icons/profile/gift.png')}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />,
              'Smart point',
              false,
              undefined,
              colors.themeTeal,
              () =>
                showAlert(
                  'Coming Soon',
                  'Smart Points feature is coming soon!',
                ),
            )}
            {renderMenuItem(
              <Image
                source={require('../../assets/icons/profile/coupon.png')}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />,
              'Coupon',
              false,
              undefined,
              colors.themeTeal,
              () => showAlert('Coming Soon', 'Coupons feature is coming soon!'),
            )}
            {renderMenuItem(
              <Image
                source={require('../../assets/icons/profile/rupee.png')}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />,
              'B coin',
              false,
              undefined,
              colors.themeTeal,
              () => navigation.navigate('BCoin'),
            )}
          </View>
        </View>

        {/* Informations Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Informations</Text>
          <View style={styles.menuCard}>
            {renderMenuItem(
              <Image
                source={require('../../assets/icons/profile/lock.png')}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />,
              'Privacy Policy',
              false,
              undefined,
              undefined,
              () =>
                showAlert(
                  'Information',
                  'Privacy Policy will be updated soon.',
                ),
            )}
            {renderMenuItem(
              <Image
                source={require('../../assets/icons/profile/terms.png')}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />,
              'Terms and conditions',
              false,
              undefined,
              undefined,
              () =>
                showAlert(
                  'Information',
                  'Terms and Conditions will be updated soon.',
                ),
            )}
            {renderMenuItem(
              <Image
                source={require('../../assets/icons/profile/info.png')}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />,
              'About us',
              false,
              undefined,
              undefined,
              () =>
                showAlert(
                  'Information',
                  'About Us information will be updated soon.',
                ),
            )}
            {renderMenuItem(
              <MaterialCommunityIcons
                name="account-remove-outline"
                size={20}
                color={colors.themeTeal}
              />,
              'Delete account',
              false,
              undefined,
              undefined,
              () => setIsDeleteAccountModalVisible(true),
            )}
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setIsLogoutModalVisible(true)}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Image
            source={require('../../assets/images/logos/homelogo.png')}
            style={styles.footerLogo}
            resizeMode="contain"
          />
        </View>
      </ScrollView>

      <ConfirmationModal
        visible={isLogoutModalVisible}
        onClose={() => setIsLogoutModalVisible(false)}
        onConfirm={handleLogout}
        title="Log Out"
        message="Are you sure you want to log out?"
        confirmText="Log Out"
        cancelText="Cancel"
        iconName="logout"
        themeColor={colors.themeTeal}
      />

      <ConfirmationModal
        visible={isDeleteAccountModalVisible}
        onClose={() => setIsDeleteAccountModalVisible(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        iconName="delete-forever"
        themeColor={colors.themeTeal}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;
