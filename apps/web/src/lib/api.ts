import axios from "axios";
import { BACKEND_URL } from "./constants";

// Generic type for API request data
type RequestData = Record<string, unknown>;

export const api = axios.create({
  baseURL: BACKEND_URL,
  // Ensures cookies are sent with requests
  withCredentials: true,
});

export const apiClient = {
  // GET request
  get: async <T>(url: string) => {
    const response = await api.get<T>(url);
    return response.data;
  },

  // POST request
  post: async <T>(url: string, data?: RequestData) => {
    const response = await api.post<T>(url, data);
    return response.data;
  },

  // PUT request
  put: async <T>(url: string, data?: RequestData) => {
    const response = await api.put<T>(url, data);
    return response.data;
  },

  // DELETE request
  delete: async <T>(url: string) => {
    const response = await api.delete<T>(url);
    return response.data;
  },
};
