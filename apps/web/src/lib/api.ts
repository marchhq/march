import axios, { AxiosRequestConfig } from "axios";
import { BACKEND_URL } from "./constants";
import { getSession } from "@/actions/session";

// Generic type for API request data
type RequestData = Record<string, unknown>;

export const api = axios.create({
  baseURL: BACKEND_URL,
});

export const apiClient = {
  // GET request
  get: async <T>(url: string) => {
    const session = await getSession();
    const headers = session ? { Authorization: `Bearer ${session}` } : {};
    const response = await api.get<T>(url, { headers });
    return response.data;
  },

  // POST request
  post: async <TResponse, TData = unknown>(url: string, data?: TData) => {
    const session = await getSession();
    const headers = session ? { Authorization: `Bearer ${session}` } : {};
    const response = await api.post<TResponse>(url, data, { headers });
    return response.data;
  },

  // PUT request
  put: async <TResponse, TData = unknown>(url: string, data?: TData) => {
    const session = await getSession();
    const headers = session ? { Authorization: `Bearer ${session}` } : {};
    const response = await api.put<TResponse>(url, data, { headers });
    return response.data;
  },

  // DELETE request
  delete: async <T>(url: string) => {
    const session = await getSession();
    const headers = session ? { Authorization: `Bearer ${session}` } : {};
    const response = await api.delete<T>(url, { headers });
    return response.data;
  },
};
