import axios, { AxiosError } from "axios"
import { create } from "zustand"

import { CycleItem, CycleItemStore } from "../@types/Items/Cycle"
import { BACKEND_URL } from "../constants/urls"

const api = axios.create({
  baseURL: BACKEND_URL,
})

export const useCycleItemStore = create<CycleItemStore>((set, get) => ({
  items: [],
  currentItem: null,
  isLoading: false,
  error: null,

  fetchItems: async (session: string, date?: string) => {
    set({ isLoading: true, error: null })
    try {
      const endpoint = date ? `/api/${date}` : "/api/inbox"
      const { data } = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${session}` },
      })
      set({ items: data.items || [], isLoading: false })
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "An unknown error occurred"
      set({ error: errorMessage, isLoading: false })
    }
  },

  fetchItem: async (session: string, id: string) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await api.get(`/api/inbox/${id}`, {
        headers: { Authorization: `Bearer ${session}` },
      })
      console.log("api response for item: ", data.response)
      set({ currentItem: data.response, isLoading: false })
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "An unknown error occurred"
      set({ error: errorMessage, isLoading: false })
    }
  },

  fetchItemByDate: async (session: string, date: string) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await api.get(`/api/${date}`, {
        headers: { Authorization: `Bearer ${session}` },
      })
      const item =
        data.response && data.response.length > 0 ? data.response[0] : null
      set({ currentItem: item, isLoading: false })
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "An unknown error occurred"
      set({ error: errorMessage, isLoading: false })
    }
  },

  setCurrentItem: (item: CycleItem | null) => {
    set({ currentItem: item })
  },

  createItem: async (session: string, item: Partial<CycleItem>) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await api.post("/api/inbox", item, {
        headers: { Authorization: `Bearer ${session}` },
      })
      set((state) => ({
        items: [data.response, ...state.items],
        currentItem: data.response,
        isLoading: false,
      }))
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "An unknown error occurred"
      set({ error: errorMessage, isLoading: false })
    }
  },

  updateItem: async (
    session: string,
    updates: Partial<CycleItem>,
    id: string
  ) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await api.put(`/api/inbox/${id}`, updates, {
        headers: { Authorization: `Bearer ${session}` },
      })
      set((state) => {
        const updatedItems = state.items.map((item) =>
          item._id === id ? { ...item, ...data.response } : item
        )
        return {
          items: updatedItems,
          currentItem:
            state.currentItem?._id === id ? data.response : state.currentItem,
          isLoading: false,
        }
      })
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "An unknown error occurred"
      set({ error: errorMessage, isLoading: false })
    }
  },
}))
