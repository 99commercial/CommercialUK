import axios, {
    AxiosError,
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosResponse,
  } from 'axios';
  import { BACKEND_URL } from '../config';
  
  // ----------------------------------------------------------------------
  
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BACKEND_URL || '',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
  timeout: 10000, // 10 second timeout
});
  
  // Request Interceptor: Adds Authorization header
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );
  
  // Response Interceptor: Handles error responses
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    (error: AxiosError) =>
      Promise.reject(
        (error.response && error.response.data) || 'Something went wrong'
      )
  );
  
  export default axiosInstance;
  