import axiosInstance from './axiosInstance';
import { toast } from 'sonner';

interface AxiosHelper {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: any;
  params?: any;
  headers?: Record<string, string>;
}

export const axiosHelper = async <T>(config: AxiosHelper): Promise<T> => {
  try {
    const response = await axiosInstance({
      method: config.method,
      url: config.url,
      data: config.data,
      params: config.params,
      headers: config.headers,
    });

    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { status: number; data?: { message?: string;  } } }; 

    if (axiosError.response) {
      const status = axiosError.response.status;
      const message = axiosError.response.data?.message || 'An error occurred';

      switch (status) {
        case 401:
          toast.error('Unauthorized! Please log in again.');
          break;
        case 403:
          toast.error('Forbidden! You do not have permission.');
          break;
        case 404:
          toast.error('Resource not found!');
          break;
          case 500:
            toast.error("Server error. Please try again later or contact support.");

        default:
          toast.error(`Error: ${message}`);
      }
    } else {
      toast.error('Network error! Please try again.');
    }

    throw error; 
  }
};
