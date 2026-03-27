// src/navigation/BottomTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/Home';
import ProfileScreen from '../screens/Profile/Profile';
import ShopWithUsScreen from '../screens/ShopWithUs/ShopWithUs';
import CategoryScreen from '../screens/Category/Category';
import DetailScreen from '../screens/Details';
import WishlistScreen from '../screens/Wishlist';

import { colors } from '../assets/theme/colours';
import { Image, View, Text, StyleSheet, Linking } from 'react-native';


const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    // removed hook call line
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border, height: 74, paddingHorizontal: 10, paddingRight: 20 },
                tabBarItemStyle: {
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                tabBarIcon: ({ focused }) => {
                    let iconSource;
                    let label = '';
                    let isKebra = false;

                    if (route.name === 'HomeScreen') {
                        iconSource = focused ? require('../assets/images/bottomtab/home_fill.png') : require('../assets/images/bottomtab/home.png');
                        //label = 'Home';
                    } else if (route.name === 'CategoryScreen') {
                        iconSource = focused ? require('../assets/images/bottomtab/category_fill.png') : require('../assets/images/bottomtab/category.png');
                        //label = 'Category';
                    } else if (route.name === 'WishlistScreen') {
                        iconSource = focused ? require('../assets/images/bottomtab/wishlist_fill.png') : require('../assets/images/bottomtab/wishlist.png');
                        //label = 'Wish List';
                    } else if (route.name === 'KebraScreen') {
                        iconSource = require('../assets/images/bottomtab/kabra.png');
                        isKebra = true;
                    }

                    if (isKebra) {
                        return (
                            <View style={styles.kebraContainer}>
                                <Image source={iconSource} style={styles.kebraIcon} resizeMode="contain" />
                            </View>
                        );
                    }

                    return (
                        <View style={styles.iconContainer}>
                            {/* {focused && (
                                <View style={styles.activeArc} />
                            )} */}
                            <Image source={iconSource} style={focused ? styles.normalIcon : styles.unselectedIcon} resizeMode="contain" />
                            <Text style={[styles.label, focused && styles.activeLabel]}>{label}</Text>
                        </View>
                    );
                },
            })}
        >
            <Tab.Screen name="HomeScreen" component={HomeScreen} />
            <Tab.Screen name="CategoryScreen" component={CategoryScreen} />
            <Tab.Screen name="WishlistScreen" component={WishlistScreen} />
            <Tab.Screen
                name="KebraScreen"
                component={ProfileScreen}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault();
                        Linking.openURL('https://play.google.com/store/apps/details?id=com.buyerskart.customer');
                    },
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        height: 60,
        marginTop: 20,
    },
    activeArc: {
        position: 'absolute',
        top: 0,
        width: 50,
        height: 25,
        borderTopWidth: 1.5,
        borderLeftWidth: 1.5,
        borderRightWidth: 1.5,
        borderColor: colors.themeTeal,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderBottomWidth: 0,
    },
    normalIcon: {
        width: 48,
        height: 48,
        marginTop: 20,
    },
    unselectedIcon: {
        width: 35,
        height: 35,
        marginTop: 20,
    },
    label: {
        fontSize: 12,
        color: colors.black,
        marginTop: 4,
    },
    activeLabel: {
        color: colors.themeTeal,
    },
    kebraContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    kebraIcon: {
        width: 100,
        height: 50,
        marginTop: 20,
    }
});

export default BottomTabNavigator;
