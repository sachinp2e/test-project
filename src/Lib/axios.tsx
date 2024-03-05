import axios, { AxiosRequestConfig } from 'axios';
import 'dotenv/config';
import { store } from '@/Lib/store';
import { logout } from '@/Lib/auth/auth.slice';
import { jwtDecode } from 'jwt-decode';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const BASE_NOTIFICATION_API_URL = process.env.NEXT_PUBLIC_NOTIFICATION_API_URL;
const NOTIFICATION_API_KEY = process.env.NEXT_PUBLIC_NOTIFICATION_API_KEY;

const getUserId = async () => {
  return localStorage.getItem('id');
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export const axiosNotificationInstance = axios.create({
  baseURL: BASE_NOTIFICATION_API_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    apiKey: NOTIFICATION_API_KEY,
  },
});

axiosInstance.interceptors.request.use(
  async (config: any) => {
    if (config?.restrictToken) {
      return config;
    }
    let token = localStorage.getItem('accessToken');
    const decodedToken: any = token ? jwtDecode(token) : null;
    const currentTime = Date.now() / 1000;
    if (
      decodedToken &&
      decodedToken.exp < currentTime &&
      config?.url !== '/user/refresh'
    ) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        const response = await axiosInstance.post(`/user/refresh`, {
          refreshToken: refreshToken,
        });
        localStorage.setItem('accessToken', response.data.result.access_token);
        token = response.data.result.access_token;
      }
    }
    if (token) {
      return {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${token}`,
          platform: 'myipr',
        },
      };
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
      const originalRequest = error.config;

      if (originalRequest.url === '/user/refresh') {
        // store.dispatch(logout());
        localStorage.clear();
        window.location.href = '/login';
      }
      if (
        originalRequest?.url !== '/user/login' &&
        originalRequest?.url !== '/user/refresh' &&
        originalRequest?.url !== '/user/get-wallet-balance' &&
        error.response
      ) {
        if (error.response.status === 401 && !originalRequest._retry) {
          // @ts-ignore
          originalRequest._retry = true;
          const refreshToken = localStorage.getItem('refreshToken');
          return axiosInstance
            .post('/user/refresh', { refreshToken })
            .then((res) => {
              if (res.status === 200) {
                localStorage.setItem('accessToken', res.data.accessToken);
                return axiosInstance(originalRequest);
              }
            })
            .catch((err) => {
              localStorage.clear();
              window.location.href = '/login';
              return Promise.reject(err);
            });
        } else if (originalRequest._retry) {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    return Promise.reject(error);
  },
);

axiosNotificationInstance.interceptors.request.use(async (config: any) => {
  const userId = await getUserId();
  if (userId && config.headers) {
    config.headers['sender'] = userId || '';
  }
  return config;
});

export default axiosInstance;
