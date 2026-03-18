// src/api/mutations/useAuthMutations.ts
import { useMutation } from '@tanstack/react-query';
import apiClient from '../services/apiClient';
import API_ROUTES from '../services/apiRoutes';

const login = async (credentials: { email: string; password: string }) => {
    const res = await apiClient.post(API_ROUTES.AUTH.LOGIN, credentials);
    return res.data;
};

export const useLoginMutation = () =>
    useMutation({
        mutationFn: login,
    });
