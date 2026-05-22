import axios, { AxiosError } from 'axios';

import { config } from '@/config';
import { getAuthToken } from '@/modules/auth/selectors';

import { createApiError, handleOtherErrors, handleUnauthorizedError } from './helpers/error.helper';

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: config.apiUrl || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError = createApiError(error, {
      source: 'network',
      originalError: error,
      endpoint: error.config?.url,
      method: error.config?.method?.toUpperCase(),
    });

    if (error.response?.status === 401) {
      handleUnauthorizedError(apiError);
    } else {
      handleOtherErrors(apiError, error);
    }

    return Promise.reject(apiError);
  },
);

export default apiClient;
