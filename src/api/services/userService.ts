import { get, post, patch } from '../networkUtils';

export const getDashboardDataApi = async (): Promise<any> => {
    return get('me/dashboard');
};

export const getWalletDataApi = async (): Promise<any> => {
    return get('me/bwallet');
};

export const redeemBCoinsApi = async (payload: { bcoins: number }): Promise<any> => {
    return post('me/bcoin/redeem', payload);
};

export const updateProfileApi = async (payload: any): Promise<any> => {
    return post('me/update', payload);
};

export const updateProfilePatchApi = async (payload: any): Promise<any> => {
    return patch('me', payload);
};

export const changePasswordApi = async (payload: any): Promise<any> => {
    return post('me/changepassword', payload);
};

export const requestEmailOtpApi = async (payload: { email: string }): Promise<any> => {
    return post('me/updateemail/requestotp', payload);
};

export const verifyEmailOtpApi = async (payload: { email: string; otp: string }): Promise<any> => {
    return post('me/updateemail/verifyotp', payload);
};

export const requestPhoneOtpApi = async (payload: { phone: string }): Promise<any> => {
    return post('me/updatephone/requestotp', payload);
};

export const verifyPhoneOtpApi = async (payload: { phone: string; otp: string }): Promise<any> => {
    return post('me/updatephone/verifyotp', payload);
};

export const getReferralHistoryApi = async (page: number = 1, pageSize: number = 20): Promise<any> => {
    return get(`me/referrals`, { params: { page, pageSize } });
};

export const getGeneralSettingsApi = async (): Promise<any> => {
    return get('general/settings');
};

export const requestProductApi = async (payload: any): Promise<any> => {
    return post('me/requestproduct', payload);
};

export const getBCoinValueChangesApi = async (): Promise<any> => {
    return get('general/bcoinvaluechanges');
};
