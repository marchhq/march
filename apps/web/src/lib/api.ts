import axios, { AxiosRequestConfig } from "axios";
import { BACKEND_URL } from "./constants";
import { tokenUtils } from './token';

// Generic type for API request data
type RequestData = Record<string, unknown>;

export const api = axios.create({
  baseURL: BACKEND_URL,
});

// Add request interceptor to add token
api.interceptors.request.use((config) => {
  const token = tokenUtils.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("config: ", config)
  }
  return config;
});

export const apiClient = {
  // GET request
  get: async <T>(url: string, config?: AxiosRequestConfig) => {
    const response = await api.get<T>(url, config);
    return response.data;
  },

  // POST request
  post: async <T>(url: string, data?: RequestData, config?: AxiosRequestConfig) => {
    const response = await api.post<T>(url, data, config);
    return response.data;
  },

  // PUT request
  put: async <T>(url: string, data?: RequestData, config?: AxiosRequestConfig) => {
    const response = await api.put<T>(url, data, config);
    return response.data;
  },

  // DELETE request
  delete: async <T>(url: string, config?: AxiosRequestConfig) => {
    const response = await api.delete<T>(url, config);
    return response.data;
  },
};
