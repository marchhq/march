import axios, { AxiosError } from "axios"
import { create } from "zustand"

import { ItemStoreType, type Item } from "../@types/Items/Items"
import { BACKEND_URL } from "../constants/urls"

const useItemsStore = create<ItemStoreType>((set) => ({
  items: [],
  selectedItem: null,
  setSelectedItem: (selectedItem: Item | null) => {
    set({ selectedItem })
  },
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
    status: string,
    description?: string
  ) => {
    try {
      const itemData = {
        title,
        description,
        status,
        dueDate,
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
      return createdItem
    } catch (error) {
      console.error("Error adding item:", error)
      if (error instanceof AxiosError) {
        console.error(error.response?.data)
      }
    }
  },

  updateItemStatus: (itemId: string, newStatus: string) => {
    set((state) => ({
      items: state.items.map((item) =>
        item._id === itemId ? { ...item, status: newStatus } : item
      ),
    }))
  },

  mutateItem: async (
    session: string,
    itemId: string,
    status: string,
    title?: string,
    description?: string,
    isDeleted?: boolean
  ) => {
    try {
      const updateItemData = {
        title,
        status,
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
  updateItem: async (session: string, editedItem: Item, id: string) => {
    set((state) => ({
      items: state.items.map((item) =>
        item._id === id
          ? {
              ...item,
              title: editedItem.title,
              description: editedItem.description,
            }
          : item
      ),
    }))
    try {
      await axios.put(`${BACKEND_URL}/api/items/${id}`, editedItem, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      })
    } catch (error) {
      const e = error as AxiosError
      console.error("error updating inbox item: ", e)
    }
  },
}))

export default useItemsStore
