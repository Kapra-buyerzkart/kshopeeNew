import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN = 'ACCESS_TOKEN';
const REFRESH_TOKEN = 'REFRESH_TOKEN';
const RESET_TOKEN = 'RESET_TOKEN';

export const setTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
    await AsyncStorage.multiSet([
        [ACCESS_TOKEN, accessToken],
        [REFRESH_TOKEN, refreshToken],
    ]);
};

export const getAccessToken = async (): Promise<string | null> => {
    return AsyncStorage.getItem(ACCESS_TOKEN);
};

export const getRefreshToken = (): Promise<string | null> =>
    AsyncStorage.getItem(REFRESH_TOKEN);

export const clearTokens = async (): Promise<void> => {
    await AsyncStorage.multiRemove([ACCESS_TOKEN, REFRESH_TOKEN, RESET_TOKEN]);
};

export const setResetToken = async (resetToken: string): Promise<void> => {
    await AsyncStorage.setItem(RESET_TOKEN, resetToken);
};

export const getResetToken = (): Promise<string | null> =>
    AsyncStorage.getItem(RESET_TOKEN);

export const clearResetToken = async (): Promise<void> => {
    await AsyncStorage.removeItem(RESET_TOKEN);
};
