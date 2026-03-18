// src/api/apiRoutes.ts
const API_ROUTES = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
    },
    USER: {
        PROFILE: '/user/profile',
        UPDATE: '/user/update',
    },
    POSTS: {
        BASE: '/posts',
        DETAIL: (id: string) => `/posts/${id}`,
    },
    EMPLOYE: {
        DETAILS: '/employees',
    }
};

export default API_ROUTES;
