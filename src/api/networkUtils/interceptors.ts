import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import CONFIG from '../../globals/config';
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from '../services/tokenService';
import { errorHandler } from './errorHandler';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(p => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

export const setupInterceptors = (axiosInstance: AxiosInstance): void => {
  axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const isAuthApi =
        config.url?.includes('auth/loginpassword') ||
        config.url?.includes('auth/sendotp') ||
        config.url?.includes('auth/verifyotp') ||
        config.url?.includes('pincodearea/getbypincode') ||
        config.url?.includes('pincodearea/search');

      const fullUrl = config.baseURL ? `${config.baseURL}${config.url}` : config.url;
      console.log('API URL 👉', fullUrl, 'isAuthApi 👉', isAuthApi);

      if (!isAuthApi) {
        const token = await getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !originalRequest.url?.includes('refreshtoken')
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = await getRefreshToken();

          const res = await axios.post(
            `${CONFIG.base_url}/auth/refreshtoken`,
            { refresh_token: refreshToken }
          );

          const { access_token, refresh_token } = res.data.Data;

          await setTokens(access_token, refresh_token);
          processQueue(null, access_token);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }
          return axiosInstance(originalRequest);
        } catch (err) {
          processQueue(err);
          await clearTokens();
          throw err;
        } finally {
          isRefreshing = false;
        }
      }

      return errorHandler(error);
    }
  );
};
