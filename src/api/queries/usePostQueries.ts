import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient';
import API_ROUTES from '../services/apiRoutes';

// 1. Fetch all posts (paginated or non-paginated)
const fetchPosts = async ({ pageParam = 1 }) => {
    const res = await apiClient.get(API_ROUTES.POSTS.BASE, {
        params: { page: pageParam, limit: 10 },
    });
    return res.data;
};

// 2. Fetch a single post by ID
const fetchPostById = async (postId: string) => {
    const res = await apiClient.get(API_ROUTES.POSTS.DETAIL(postId));
    return res.data;
};

// Hook: Get all posts (with pagination)
export const usePosts = () =>
    useInfiniteQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts,
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const hasMore = lastPage?.hasMore;
            return hasMore ? allPages.length + 1 : undefined;
        },
    });

// Hook: Get one post by ID
export const usePostById = (postId: string) =>
    useQuery({
        queryKey: ['post', postId],
        queryFn: () => fetchPostById(postId),
        enabled: !!postId, // Only fetch if postId is truthy
    });


// Hook: Get employee details
const fetchEmployees = async () => {
    const res = await apiClient.get(API_ROUTES.EMPLOYE.DETAILS); // Replace with actual endpoint
    return res.data; // { status: "success", data: [...] }
};
export const useGetEmployee = () =>
    useQuery({
        queryKey: ['employees'],
        queryFn: fetchEmployees,
        staleTime: 0
    });


