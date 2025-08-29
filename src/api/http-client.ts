import apiClient from '@/api/client';
import {
  extractResponseData,
  validateAndProcessRequest,
  validateAndProcessResponse,
} from '@/api/helpers/http-client.helper';

import type { ApiResponse, HttpClientContract, RequestConfig } from './api.types';

export const createAxiosHttpClient = (): HttpClientContract => ({
  async get<T>(url: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const { requestSchema, responseSchema, ...axiosConfig } = config;

    // Validate and process params
    if (requestSchema && axiosConfig.params) {
      axiosConfig.params = validateAndProcessRequest(requestSchema, axiosConfig.params, `GET ${url} params`) as Record<
        string,
        any
      >;
    }

    const response = await apiClient.get<any>(url, axiosConfig);

    // Extract data from response (supports both wrapped and direct formats)
    const responseData = extractResponseData<T>(response.data);

    // Validate and process response
    const validatedData = validateAndProcessResponse<T>(responseSchema, responseData, `GET ${url}`);

    return {
      data: validatedData,
      message: response.data.message,
      success: response.data.success,
    };
  },

  async post<T>(url: string, data?: unknown, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const { requestSchema, responseSchema, ...axiosConfig } = config;

    // Validate and process request data
    const validatedData = validateAndProcessRequest(requestSchema, data, `POST ${url} request`);

    const response = await apiClient.post<any>(url, validatedData, axiosConfig);

    // Extract data from response (supports both wrapped and direct formats)
    const responseData = extractResponseData<T>(response.data);

    // Validate and process response
    const validatedResponseData = validateAndProcessResponse<T>(responseSchema, responseData, `POST ${url}`);

    return {
      data: validatedResponseData,
      message: response.data.message,
      success: response.data.success,
    };
  },

  async put<T>(url: string, data?: unknown, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const { requestSchema, responseSchema, ...axiosConfig } = config;

    // Validate and process request data
    const validatedData = validateAndProcessRequest(requestSchema, data, `PUT ${url} request`);

    const response = await apiClient.put<any>(url, validatedData, axiosConfig);

    // Extract data from response (supports both wrapped and direct formats)
    const responseData = extractResponseData<T>(response.data);

    // Validate and process response
    const validatedResponseData = validateAndProcessResponse<T>(responseSchema, responseData, `PUT ${url}`);

    return {
      data: validatedResponseData,
      message: response.data.message,
      success: response.data.success,
    };
  },

  async delete<T>(url: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const { responseSchema, ...axiosConfig } = config;

    const response = await apiClient.delete<any>(url, axiosConfig);

    // Extract data from response (supports both wrapped and direct formats)
    const responseData = extractResponseData<T>(response.data);

    // Validate and process response
    const validatedData = validateAndProcessResponse<T>(responseSchema, responseData, `DELETE ${url}`);

    return {
      data: validatedData,
      message: response.data.message,
      success: response.data.success,
    };
  },
});

export const httpClient = createAxiosHttpClient();
