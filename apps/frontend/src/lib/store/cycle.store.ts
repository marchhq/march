import axios from "axios"
import { create } from "zustand"

import {
  CreateItemResponse,
  CycleItem,
  CycleItems,
  CycleItemStoreTypes,
} from "../@types/Items/Cycle"
import { BACKEND_URL } from "../constants/urls"

export const useCycleItemStore = create<CycleItemStoreTypes>((set, get) => ({
  cycleItem: null,
  cycleItems: [],
  isLoading: false,
  isFetched: false,
  setCycleItem: (cycleItem: CycleItem | null) => set({ cycleItem }),
  setIsFetched: (isFetched: boolean) => set({ isFetched }),
  fetchItems: async (session: string) => {
    let cycleItems_: CycleItem[] = []
    set({ isLoading: true })
    try {
      console.log("Fetching items from API...")
      const { data } = await axios.get<CycleItems>(
        `${BACKEND_URL}/api/inbox/`,
        {
          headers: { Authorization: `Bearer ${session}` },
        }
      )
      console.log("API response:", data)
      cycleItems_ = data.response
      console.log("Setting cycleItems in store:", cycleItems_)
      set({ cycleItems: cycleItems_, isFetched: true })
      console.log("Store state after update:", get())
    } catch (error) {
      console.error("Error fetching cycle items: ", error)
    } finally {
      set({ isLoading: false })
    }
    return cycleItems_
  },
  setCycleItems: (cycleItems: CycleItem[]) => {
    set({ cycleItems })
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
      set((state) => ({ cycleItems: [newItem, ...state.cycleItems] }))
    } catch (error) {
      console.error("Error adding item: ", error)
    }
  },
  mutateItem: async (data: Partial<CycleItem>, session: string, id: string) => {
    try {
      const response = await axios.put<CreateItemResponse>(
        `${BACKEND_URL}/api/inbox/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )
      const mutatedItem = response.data.item
      set((state) => ({
        cycleItems: [mutatedItem, ...state.cycleItems],
      }))
    } catch (error) {
      console.error("error updating item: ", error)
    }
  },
}))
