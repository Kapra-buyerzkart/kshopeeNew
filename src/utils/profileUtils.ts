import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Merges a generated customer ID into the existing profile stored in AsyncStorage
 */
export const mergeCustomerIdIntoProfile = async (custId: number | string) => {
    try {
        const storedProfile = await AsyncStorage.getItem('profile');
        const existingProfile = storedProfile ? JSON.parse(storedProfile) : {};
        
        const updatedProfile = {
            ...existingProfile,
            custId,
        };
        
        await AsyncStorage.setItem('profile', JSON.stringify(updatedProfile));
    } catch (error) {
        console.error('Error merging customer ID into profile:', error);
    }
};
