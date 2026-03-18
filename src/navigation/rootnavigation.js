// For root navigation 

import * as React from 'react';
//import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import HomeScreen from '../Home';
import CheckComponentScreen from '../screens/CheckComponent';
import CheckApiScreen from '../screens/CheckApiScreen';
import BottomTabNavigator from './BottomNavigator';
import DetailScreen from '../screens/Details';
import { CartProvider } from '../context/CartContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <CartProvider>
      <Stack.Navigator>
        {/* <Stack.Screen name="RootScreen" component={RootScreen} options={{ headerShown: false, }} /> */}
        <Stack.Screen
          name="Main"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Details" component={DetailScreen} />
        <Stack.Screen name="CheckComponent" component={CheckComponentScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CheckApiScreen" component={CheckApiScreen} />
      </Stack.Navigator>
    </CartProvider>
  );
}
