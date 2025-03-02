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
      console.log("Full error object:", error);
  
      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data?.error || 'An error occurred'; // Extract the error message
  
        if (status === 401) {
          toast.error('Unauthorized! Please log in again.');
        } else if (status === 403) {
          toast.error(`Error: ${errorMessage}`); // Display the specific error message
        } else if (status === 404) {
          toast.error('Resource not found!');
        } else if (status === 400) {
          toast.error(`Error: ${errorMessage}`);
        } else {
          toast.error(`Error: ${errorMessage}`);
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
