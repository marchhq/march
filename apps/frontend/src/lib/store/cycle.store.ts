import axios from "axios"
import { create } from "zustand"

import {
  CreateItemResponse,
  CycleItem,
  CycleItems,
  CycleItemStoreTypes,
} from "../@types/Items/Cycle"
import { BACKEND_URL } from "../constants/urls"

export const useCycleItemStore = create<CycleItemStoreTypes>((set) => ({
  item: null,
  items: [],
  isLoading: false,
  isFetched: false,
  setItem: (item: CycleItem | null) => set({ item }),
  setIsFetched: (isFetched: boolean) => set({ isFetched }),
  fetchItems: async (session: string) => {
    set({ isLoading: true })
    try {
      const { data } = await axios.get<CycleItems>(
        `${BACKEND_URL}/api/inbox/`,
        {
          headers: { Authorization: `Bearer ${session}` },
        }
      )
      set({ items: data.response, isFetched: true })
    } catch (error) {
      console.error("Error fetching cycle items: ", error)
    } finally {
      set({ isLoading: false })
    }
  },
  createItem: async (data: Partial<CycleItem>, session: string) => {
    try {
      const response = await axios.post<CreateItemResponse>(
        `${BACKEND_URL}/api/inbox/`,
        data,
        {
          headers: { Authorization: `Bearer ${session}` },
        }
      )
      const newItem = response.data.item
      set((state) => ({ items: [newItem, ...state.items] }))
    } catch (error) {
      console.error("Error adding item: ", error)
    }
  },
}))
