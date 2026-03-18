import { get, post } from '../networkUtils';

export const getSupportTicketsApi = async (): Promise<any> => {
    return get('supportticket/list');
};

export const getTicketDetailsApi = async (id: string | number): Promise<any> => {
    return get(`supportticket/${id}`);
};

export const createSupportTicketApi = async (payload: { title: string; message: string; priority: string; orderId?: string | number }): Promise<any> => {
    return post('supportticket/create', payload);
};
