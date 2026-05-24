// For root navigation 

import * as React from 'react';
//import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import HomeScreen from '../Home';
import CheckComponentScreen from '../screens/CheckComponent';
import CheckApiScreen from '../screens/CheckApiScreen';
import BottomTabNavigator from './BottomNavigator';
import DetailScreen from '../screens/Details';
import LoginScreen from '../screens/Login';
import OtpScreen from '../screens/Otp/OtpScreen';
import RegistrationScreen from '../screens/Registration';
import WishlistScreen from '../screens/Wishlist';
import CartScreen from '../screens/Cart/CartScreen';
// import RegistraionScreen from '../screens/RegistraionScreen';
import ProductDetails from '../screens/Product/ProductDetails';
import ProductCategoryDetail from '../screens/Product/ProductCategoryDetail/ProductCategoryDetail';
import MyOrder from '../screens/Order/MyOrder';
import MyOrderDetails from '../screens/Order/MyOrderDetails';
import ReferralScreen from '../screens/Referral';
import BCoinScreen from '../screens/BCoin';
import EditProfile from '../screens/Profile/EditProfile';
import SavedAddressScreen from '../screens/SavedAddress';
import AddLocationScreen from '../screens/AddLocation';
import OrderSuccessScreen from '../screens/Order/OrderSuccessScreen';
import OrderFailedScreen from '../screens/Order/OrderFailedScreen';
import OrderPendingScreen from '../screens/Order/OrderPendingScreen';
import SearchScreen from '../screens/SearchScreen/SearchScreen';
import UpdateContactScreen from '../screens/Profile/UpdateContactScreen';
import UpdateContactOtpScreen from '../screens/Profile/UpdateContactOtpScreen';

// import ChangePwdScreen from '../screens/ChangePwdScreen';
import ChangePwdScreen from '../screens/Login/ChangePwdScreen';
import LoginPwdScreen from '../screens/Login/LoginPwdScreen';
import { CartProvider } from '../context/CartContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import { getAccessToken } from '../api/services/tokenService';
import { useUser } from '../context/UserContext';


const Stack = createNativeStackNavigator();

export default function RootStack() {
  const [initialRoute, setInitialRoute] = React.useState(null);
  const { loadProfile } = useUser();

  React.useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await getAccessToken();
        if (token) {
          await loadProfile();
          setInitialRoute('MainTabs');
        } else {
          setInitialRoute('Login');
        }
      } catch (error) {
        console.error('RootStack auth check error:', error);
        setInitialRoute('Login');
      }
    };
    checkAuthStatus();
  }, []);

  if (initialRoute === null) {
    return null; // Or a loading spinner
  }

  return (
    <CartProvider>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Wishlist" component={WishlistScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RegistraionScreen" component={RegistrationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: false }} />

        <Stack.Screen name="ProductDetailsScreen" component={ProductDetails} options={{ headerShown: false }} />
        <Stack.Screen name="ProductCategoryDetail" component={ProductCategoryDetail} options={{ headerShown: false }} />
        <Stack.Screen name="MyOrder" component={MyOrder} options={{ headerShown: false }} />
        <Stack.Screen name="MyOrderDetails" component={MyOrderDetails} options={{ headerShown: false }} />
        <Stack.Screen name="Referral" component={ReferralScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BCoin" component={BCoinScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
        <Stack.Screen name="UpdateContactScreen" component={UpdateContactScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UpdateContactOtpScreen" component={UpdateContactOtpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SavedAddressScreen" component={SavedAddressScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddLocationScreen" component={AddLocationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OrderSuccessScreen" component={OrderSuccessScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OrderFailedScreen" component={OrderFailedScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OrderPendingScreen" component={OrderPendingScreen} options={{ headerShown: false }} />
        {/* <Stack.Screen name="ChangePwdScreen" component={ChangePwdScreen} options={{ headerShown: false }} /> */}
        <Stack.Screen name="ChangePwdScreen" component={ChangePwdScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LoginPwdScreen" component={LoginPwdScreen} options={{ headerShown: false }} />

        <Stack.Screen name="Details" component={DetailScreen} />
        <Stack.Screen name="CheckComponent" component={CheckApiScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CheckApiScreen" component={CheckApiScreen} />
      </Stack.Navigator>
    </CartProvider>
  );
}
