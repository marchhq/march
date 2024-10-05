import axios from "axios"
import { create } from "zustand"

import { BACKEND_URL } from "../constants/urls"

interface ReadingItem {
  _id: string
  title: string
  description?: string
  metadata: { url: string }
}

export interface ReadingStoreType {
  readingItems: ReadingItem[]
  isFetched: boolean
  setIsFetched: (isFetched: boolean) => void
  fetchReadingList: (session: string, blockId: string) => Promise<void>
  setReadingItems: (items: ReadingItem[]) => void
  addItem: (
    session: string,
    blockId: string,
    title: string,
    url: string,
    description?: string
  ) => Promise<void>
  deleteItem: (
    session: string,
    blockId: string,
    itemId: string
  ) => Promise<void>
}

const useReadingStore = create<ReadingStoreType>((set, get) => ({
  readingItems: [],
  isFetched: false,

  setIsFetched: (isFetched: boolean) => set({ isFetched }),

  fetchReadingList: async (session: string, blockId: string) => {
    if (!blockId) {
      set({ isFetched: true })
      return
    }

    try {
      const response = await axios.get(`${BACKEND_URL}/api/blocks/${blockId}`, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      })
      set({ readingItems: response.data.block.data.item, isFetched: true })
    } catch (error) {
      console.error("Error fetching reading list:", error)
      set({ isFetched: true })
    }
  },

  setReadingItems: (items: ReadingItem[]) => set({ readingItems: items }),

  addItem: async (
    session: string,
    blockId: string,
    title: string,
    url: string,
    description?: string
  ) => {
    const { readingItems } = get()
    try {
      const createResponse = await axios.post(
        `${BACKEND_URL}/api/items/create/`,
        { title, description: description || "", metadata: { url } },
        { headers: { Authorization: `Bearer ${session}` } }
      )

      const createdItem = createResponse.data.item

      const updatedItems = [
        ...readingItems.map((item) => item._id),
        createdItem._id,
      ]
      await axios.put(
        `${BACKEND_URL}/api/blocks/${blockId}`,
        { data: { item: updatedItems } },
        { headers: { Authorization: `Bearer ${session}` } }
      )

      set((state) => ({
        readingItems: [...state.readingItems, createdItem],
      }))
    } catch (error) {
      console.error("Error adding item:", error)
    }
  },

  deleteItem: async (session: string, blockId: string, itemId: string) => {
    const { readingItems } = get()
    try {
      const updatedItems = readingItems
        .filter((item) => item._id !== itemId)
        .map((item) => item._id)
      await axios.put(
        `${BACKEND_URL}/api/blocks/${blockId}`,
        { data: { item: updatedItems } },
        { headers: { Authorization: `Bearer ${session}` } }
      )

      set((state) => ({
        readingItems: state.readingItems.filter((item) => item._id !== itemId),
      }))
    } catch (error) {
      console.error("Error deleting item:", error)
    }
  },
}))

export default useReadingStore
