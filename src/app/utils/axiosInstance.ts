import axios, { AxiosInstance } from "axios"
import { useUserStore } from '@/stores/authStore';
import { toast } from 'sonner';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL,
  withCredentials: true, 
});

axiosInstance.interceptors.request.use(
    (config) => {
      const { accessToken } = useUserStore.getState(); 
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

axiosInstance.interceptors.response.use(
  (response) => {
    
    return response;
  },
  (error) => {
    
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || 'An error occurred';
      if (status === 401) {
        toast.error('Unauthorized! Please log in again.');
      } else if (status === 403) {
        toast.error('Forbidden! You do not have permission.');
      } else if (status === 404) {
        toast.error('Resource not found!');
      } else {
        toast.error(`Error: ${message}`);
      }
    } else if (error.request) {
      toast.error('Network error! Please try again.');
    } else {
      toast.error(`Unexpected error: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
