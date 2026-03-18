// src/navigation/BottomTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home';
import ProfileScreen from '../screens/Profile';
import DetailScreen from '../screens/Details';
import { colors } from '../assets/theme/colours';
import { AppIcons } from '../assets/icons';


const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    // removed hook call line
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    let iconName = route.name === 'Product' ? 'apps' : route.name === 'SpecialItems' ? 'star' : 'calculator';
                    return <AppIcons.Home name={iconName} size={size} color={color} />;
                },
                tabBarShowLabel: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.grey,
                tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border, height: 70 },
                //tabBarLabelStyle: { ...fonts.body2, paddingBottom: 5 },
                tabBarItemStyle: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10
                },
            })}
        >
            <Tab.Screen name="HomeScreen" component={HomeScreen} />
            <Tab.Screen name="ProfileScreen" component={ProfileScreen} />
            <Tab.Screen name="DetailScreen" component={DetailScreen} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
