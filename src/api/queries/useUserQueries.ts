// src/api/queries/useUserQueries.ts
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../apiClient';
import API_ROUTES from '../../apiRoutes';

const fetchUserProfile = async () => {
    const res = await apiClient.get(API_ROUTES.USER.PROFILE);
    return res.data;
};

export const useUserProfile = () =>
    useQuery({
        queryKey: ['userProfile'],
        queryFn: fetchUserProfile,
    });
