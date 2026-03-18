import { get } from '../networkUtils';

export const getCategoriesApi = async (parentCatId: number = 1): Promise<any> => {
    return get(`categories/list`, {
        params: { parentCatId }
    });
};
