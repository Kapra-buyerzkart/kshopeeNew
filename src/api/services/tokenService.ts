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

const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwicGhvbmUiOiI4MTM3OTU2NTc0IiwianRpIjoiMjQ3MDg2ODMtMWQ0Yi00ZTE3LWJjMGEtNTM0Y2ZmNzQzYjk0IiwiZXhwIjoxNzkyMTIxMTA0LCJpc3MiOiJLYXByYURhaWx5QVBJIiwiYXVkIjoiS2FwcmFEYWlseUFQSVVzZXJzIn0.T7vAw2c6GD9VSQW3mcY13JvBXUhfDPTQPT3e7LomA10';

export const getAccessToken = async (): Promise<string | null> => {
    const token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return token || TEST_TOKEN;
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
