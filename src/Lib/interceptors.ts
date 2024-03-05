import { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { jwtDecode } from "jwt-decode";
import axiosInstance from './axios';

const onRequest = async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
    let token = localStorage.getItem('accessToken');
    const decodedToken: any = token ? jwtDecode(token) : null;
    const currentTime = Date.now() / 1000;
    if (decodedToken && decodedToken.exp < currentTime && config?.url !== '/auth/refresh') {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        const response = await axiosInstance.post(`/auth/refresh`, {
            refresh_token: refreshToken,
        });
        localStorage.setItem('accessToken', response.data.result.access_token);
        token = response.data.result.access_token;
      }
    }
    if (token) {
      return { ...config, headers: { ...config.headers, Authorization: `Bearer ${token}` } };
    }
    return config;
  };


  export const setupInterceptorsTo = (axiosInstance: AxiosInstance): AxiosInstance => {
    // @ts-ignore
    axiosInstance.interceptors.request.use(onRequest);
    return axiosInstance;
  };