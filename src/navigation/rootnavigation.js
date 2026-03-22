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
import MainTabs from '../screens/MainTabs';
import RegistrationScreen from '../screens/Registration';
import WishlistScreen from '../screens/Wishlist';
import ProductDetails from '../screens/Product/ProductDetails';
// import ChangePwdScreen from '../screens/ChangePwdScreen';
// import LoginPwdScreen from '../screens/LoginPwdScreen';
import { CartProvider } from '../context/CartContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <CartProvider>
      <Stack.Navigator initialRouteName="MainTabs">
        <Stack.Screen name="Wishlist" component={WishlistScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RegistraionScreen" component={RegistrationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ headerShown: false }} />
        {/* <Stack.Screen name="ChangePwdScreen" component={ChangePwdScreen} options={{ headerShown: false }} /> */}
        {/* <Stack.Screen name="LoginPwdScreen" component={LoginPwdScreen} options={{ headerShown: false }} /> */}
        <Stack.Screen
          name="Main"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Details" component={DetailScreen} />
        <Stack.Screen name="CheckComponent" component={CheckApiScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CheckApiScreen" component={CheckApiScreen} />
      </Stack.Navigator>
    </CartProvider>
  );
}
