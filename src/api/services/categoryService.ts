import { get } from '../networkUtils';

export const getCategoriesApi = async (parentCatId: string = '1'): Promise<any> => {
    return get(`categories/list`, {
        params: { parentCatId }
    });
};
