import { get, post } from '../client';

export const getProductDetails = async (productId: string | number, pincodeAreaId: number | null): Promise<any> => {
    return get(`product/${productId}`, {
        params: { pincodeAreaId }
    });
};

export const searchProductsApi = async (payload: any, signal?: AbortSignal): Promise<any> => {
    try {
        const response = signal
            ? await post(`product/search`, payload, { signal })
            : await post(`product/search`, payload);
        return response;
    } catch (error: any) {
        if (error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED' || error?.message === 'canceled') {
            return null;
        }
        console.error('searchProductsApi error:', error?.response?.status, error?.message, error);
        throw error;
    }
};

export const getRelatedProductsApi = async (productId: string | number, pincodeAreaId: number | null, limit: number = 10): Promise<any> => {
    return get(`product/${productId}/related`, {
        params: { pincodeAreaId, limit }
    });
};

export const getProductSuggestionsApi = async (term: string, pincodeAreaId: number | null, limit: number = 8): Promise<any> => {
    try {
        const response = await get(`product/suggestions`, {
            params: { term, pincodeAreaId, limit }
        });

        if (response && response.success && Array.isArray(response.data)) {
            return response;
        }

        if (response && response.status === 'SERVER_ERROR') {
            return { success: true, data: [] };
        }

        return { success: true, data: [] };
    } catch {
        return { success: true, data: [] };
    }
};
