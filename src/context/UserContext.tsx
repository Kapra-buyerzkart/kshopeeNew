import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
// import User from '../database/models/User';
type User = any;

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as NavigationService from '../api/NavigationService';

import { getProfile } from '../api/services';
import { getAccessToken, clearTokens } from '../api/services/tokenService';

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    profile: any | null;
    setProfile: (profile: any | null) => void;
    loadProfile: () => Promise<void>;
    logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<any | null>(null);

    const loadProfile = async () => {
        try {
            const response = await getProfile();
            if (response && response.success) {
                setProfile(response.data);
                setUser({ loggedIn: true }); // Set user as logged in
                await AsyncStorage.setItem('profile', JSON.stringify(response.data));
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

    useEffect(() => {
        const rehydrateSession = async () => {
            try {
                const token = await getAccessToken();
                if (token) {
                    // Try to load cached profile first for immediate UI
                    const cachedProfile = await AsyncStorage.getItem('profile');
                    if (cachedProfile) {
                        const parsedProfile = JSON.parse(cachedProfile);
                        setProfile(parsedProfile);
                        setUser({ loggedIn: true });
                    }
                    // Then refresh from server
                    await loadProfile();
                }
            } catch (error) {
                console.error('Session rehydration error:', error);
            }
        };
        rehydrateSession();
    }, []);

    const logout = async () => {
        try {
            await clearTokens();
            await AsyncStorage.removeItem('profile');
            await AsyncStorage.removeItem('pincodeAreaId');
            setUser(null);
            setProfile(null);
            NavigationService.reset('Login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, profile, setProfile, loadProfile, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
