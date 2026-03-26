import React, { createContext, useState, useContext, ReactNode } from 'react';
// import User from '../database/models/User';
type User = any;

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as NavigationService from '../api/NavigationService';

import { getProfile } from '../api/services';

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
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.clear();
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
