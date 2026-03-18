// src/api/mutations/useAuthMutations.ts
import { useMutation } from '@tanstack/react-query';
import apiClient from '../apiClient';
import API_ROUTES from '../apiRoutes';

const login = async (credentials: { email: string; password: string }) => {
    const res = await apiClient.post(API_ROUTES.AUTH.LOGIN, credentials);
    return res.data;
};

export const useLoginMutation = () =>
    useMutation({
        mutationFn: login,
    });
