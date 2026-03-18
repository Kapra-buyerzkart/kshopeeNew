import { get } from '../networkUtils';

export const searchPincodeArea = async (search: string, limit: number = 20): Promise<any> => {
    const config = {
        params: {
            search,
            limit
        }
    };
    return get('pincodearea/search', config);
};
