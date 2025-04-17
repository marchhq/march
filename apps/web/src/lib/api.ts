import axios from "axios";
import { BACKEND_URL } from "./constants";
import { getSession } from "@/actions/session";

// Generic type for API request data
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RequestData = Record<string, unknown>;

// Create a separate client for internal Next.js API routes
export const internalApiClient = axios.create({
  baseURL: '', // Empty base URL for relative paths
});

export const api = axios.create({
  baseURL: BACKEND_URL,
});

export const apiClient = {
  // Internal Next.js API routes
  internal: {
    get: async <T>(url: string) => {
      const response = await internalApiClient.get<T>(url);
      return response.data;
    },
  },

  // External backend API routes
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

  // PATCH request
  patch: async <TResponse, TData = unknown>(url: string, data?: TData) => {
    const session = await getSession();
    const headers = session ? { Authorization: `Bearer ${session}` } : {};
    const response = await api.patch<TResponse>(url, data, { headers });
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
