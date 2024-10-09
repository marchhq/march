import { create } from "zustand"
import { type Item } from "../@types/Items/Items"
import axios, { AxiosError } from "axios"
import { BACKEND_URL } from "../constants/urls"
import { getTodayISODate } from "@/src/utils/datetime"

export interface ItemStoreType {
  items: Item[]
  isFetched: boolean
  setIsFetched: (isFetched: boolean) => void
  fetchItems: (session: string, filter: string) => Promise<void>
  setItems: (items: Item[]) => void
  addItem: (
    session: string,
    dueDate: string,
    title: string,
    description?: string
  ) => Promise<void>
  mutateItem: (
    session: string,
    itemId: string,
    title?: string,
    description?: string,
    isDeleted?: boolean
  ) => Promise<void>
}

const useItemsStore = create<ItemStoreType>((set) => ({
  items: [],
  isFetched: false,
  setIsFetched: (isFetched: boolean) => set({ isFetched }),
  fetchItems: async (session: string, filter: string) => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/items/overview/?dueDate=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )
      set({ items: res.data.items, isFetched: true })
    } catch (error) {
      console.error("error fetching items: ", error)
      set({ isFetched: true })
    }
  },
  setItems: (items: Item[]) => set({ items }),
  addItem: async (
    session: string,
    dueDate: string,
    title: string,
    description?: string
  ) => {
    try {
      const itemData = {
        title,
        description,
        dueDate: dueDate || getTodayISODate(),
      }
      const createResponse = await axios.post(
        `${BACKEND_URL}/api/items/create/`,
        itemData,
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )
      const createdItem = createResponse.data.item
      set((state) => ({
        items: [...state.items, createdItem],
      }))
    } catch (error) {
      console.error("Error adding item:", error)
      if (error instanceof AxiosError) {
        console.error(error.response?.data)
      }
    }
  },
  mutateItem: async (
    session: string,
    itemId: string,
    title?: string,
    description?: string,
    isDeleted?: boolean
  ) => {
    try {
      const updateItemData = {
        title,
        description,
        isDeleted,
      }
      const updateResponse = await axios.put(
        `${BACKEND_URL}/api/items/${itemId}/`,
        updateItemData,
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )
      const updatedItem = updateResponse.data.item
      set((state) => ({
        items: state.items.map((item) =>
          item._id === updatedItem._id ? updatedItem : item
        ),
      }))
    } catch (error) {
      console.error("Error updating item:", error)
      if (error instanceof AxiosError) {
        console.error(error.response?.data)
      }
    }
  },
}))

export default useItemsStore
