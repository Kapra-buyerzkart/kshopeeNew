import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, StyleSheet, ScrollView, Modal, TouchableWithoutFeedback, Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/types';
import { useCommonStyles } from '../assets/styles';
import { AppIcons } from '../assets/icons';
import { colors } from '../assets/theme/colours';
import { useUser } from '../context/UserContext';

interface SideMenuProps {
    isVisible: boolean;
    onClose: () => void;
}

const { width } = Dimensions.get('window');
const iconPath = '../assets/images/appIcon.png'

const SideMenu: React.FC<SideMenuProps> = ({ isVisible, onClose }) => {
    const { user } = useUser();
    const isOwner = (user as any)?.table === 'users';
    const styles = useCommonStyles();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    // Internal state to keep Modal visible during exit animation
    const [modalVisible, setModalVisible] = useState(false);

    // Animations
    const slideAnim = useRef(new Animated.Value(-width)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isVisible) {
            setModalVisible(true);
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -width,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setModalVisible(false);
            });
        }
    }, [isVisible]);

    const handleNavigation = (screen: keyof RootStackParamList) => {
        onClose(); // Close menu
        // Small delay to allow animation to start or just navigate immediately
        // Actually, cleaner to just close. Animation will happen because prop changes.
        // Navigation pushes new screen, menu might unmount/stay under.
        navigation.navigate(screen as any); // Type cast for dynamic screens not yet in types or loose check
    };

    return (
        <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={onClose}
            animationType="none" // We handle animation manually
        >
            <View style={{ flex: 1 }}>

                {/* Overlay Background */}
                <TouchableWithoutFeedback onPress={onClose}>
                    <Animated.View style={[styles.sideMenuOverlay, { opacity: fadeAnim, width: '100%', height: '100%' }]} />
                </TouchableWithoutFeedback>

                {/* Side Menu Content */}
                <Animated.View style={[styles.sideMenuContainer, { transform: [{ translateX: slideAnim }] }]}>

                    {/* Header */}
                    <View style={styles.sideMenuHeader}>
                        <View style={styles.sideMenuAppIcon}>
                            <Image
                                source={require(iconPath)}
                                style={styles.sideMenuAppIconImage}
                            />
                        </View>
                        <Text style={[styles.heading1, styles.textWhite, { fontSize: 20 }]}>POS</Text>
                        {/* <View style={{ backgroundColor: 'white', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
                            <Text style={[styles.caption, styles.textPrimary, styles.textBold, { fontSize: 10 }]}>A LITTLE</Text>
                        </View> */}
                    </View>

                    {/* User Info */}
                    <View style={styles.sideMenuUserInfo}>
                        <Text style={[styles.heading1, styles.textWhite]}>{user?.name || ""}</Text>
                        <Text style={[styles.body2, { color: colors.lightGrey }]}>{isOwner ? "Owner" : "Cashier"}</Text>
                    </View>

                    {/* Branch Selector */}
                    <TouchableOpacity style={styles.sideMenuBranchSelector}>
                        <Text style={[styles.body2, styles.textWhite]}>Branch 1</Text>
                        <AppIcons.ArrowDown size={20} color={colors.white} />
                    </TouchableOpacity>

                    {/* Menu Items */}
                    <ScrollView style={styles.sideMenuScrollContent}>
                        <MenuItem icon={<AppIcons.Group size={24} color={colors.white} />} label="Clients" onPress={() => handleNavigation('Clients')} />
                        <MenuItem icon={<AppIcons.PeopleCarry size={24} color={colors.white} />} label="Employees" onPress={() => handleNavigation('Employees')} />
                        <MenuItem icon={<AppIcons.History size={24} color={colors.white} />} label="Transaction History" onPress={() => handleNavigation('OrderHistory')} />
                        <MenuItem icon={<AppIcons.ViewModule size={24} color={colors.white} />} label="Report" onPress={() => handleNavigation('OrderReport')} />
                        <MenuItem icon={<AppIcons.Home size={24} color={colors.white} />} label="Manage Store" onPress={() => handleNavigation('StoreItemsList')} />
                        <MenuItem icon={<AppIcons.User size={24} color={colors.white} />} label="Account" onPress={() => handleNavigation('Account')} />
                        <MenuItem icon={<AppIcons.Settings size={24} color={colors.white} />} label="Support" onPress={() => { }} />
                    </ScrollView>

                    {/* Footer */}
                    <View style={styles.sideMenuFooter}>
                        <View style={styles.sideMenuLastLoginContainer}>
                            <View style={styles.sideMenuLastLoginIcon}>
                                <AppIcons.History size={24} color={colors.white} />
                            </View>
                            <View style={styles.sideMenuLastLoginContent}>
                                <Text style={[styles.body2, styles.textWhite, styles.textBold, { marginBottom: 2 }]}>Last Login :</Text>
                                <Text style={[styles.caption, { color: 'rgba(255,255,255,0.8)', lineHeight: 18 }]}>Monday. July 01 2020{'\n'}(12.00 AM)</Text>
                            </View>
                        </View>
                    </View>

                </Animated.View>
            </View>
        </Modal>
    );
};

const MenuItem = ({ icon, label, onPress }: { icon: React.ReactNode, label: string, onPress: () => void }) => {
    const styles = useCommonStyles();
    return (
        <TouchableOpacity style={styles.sideMenuItem} onPress={onPress}>
            {icon}
            <Text style={[styles.body1, styles.textWhite, { fontWeight: '500', marginLeft: 16 }]}>{label}</Text>
        </TouchableOpacity>
    );
};

export default SideMenu;
