import React, { createContext, useState, useContext, ReactNode } from 'react';
// import User from '../database/models/User';
type User = any;

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as NavigationService from '../api/NavigationService';

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const logout = async () => {
        try {
            await AsyncStorage.clear();
            setUser(null);
            NavigationService.reset('Login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
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
