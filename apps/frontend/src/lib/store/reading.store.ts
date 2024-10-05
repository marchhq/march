import axios, { type AxiosError } from "axios"
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
  blockId: string
  loading: boolean
  isFetched: boolean
  setIsFetched: (isFetched: boolean) => void
  fetchReadingList: (session: string, spaces: any[]) => Promise<void>
  setReadingItems: (items: ReadingItem[]) => void
  setBlockId: (id: string) => void
  setLoading: (loading: boolean) => void
  addItem: (session: string, title: string, url: string, description?: string) => Promise<void>
  deleteItem: (session: string, itemId: string) => Promise<void>
}

const useReadingStore = create<ReadingStoreType>((set, get) => ({
  readingItems: [],
  blockId: "",
  loading: true,
  isFetched: false,

  setIsFetched: (isFetched: boolean) => set({ isFetched }),

  fetchReadingList: async (session: string, spaces: any[]) => {
    if (!spaces.length) return

    const readingListSpace = spaces.find(space => space.name.toLowerCase() === "reading list")
    if (!readingListSpace) {
      set({ loading: false })
      return
    }

    try {
      const blockId = readingListSpace.blocks[0]
      set({ blockId })
      const response = await axios.get(`${BACKEND_URL}/api/blocks/${blockId}`, {
        headers: {
          Authorization: `Bearer ${session}`
        }
      })
      set({ readingItems: response.data.block.data.item, loading: false, isFetched: true })
    } catch (error) {
      console.error("Error fetching reading list:", error)
      set({ loading: false })
    }
  },

  setReadingItems: (items: ReadingItem[]) => set({ readingItems: items }),
  setBlockId: (id: string) => set({ blockId: id }),
  setLoading: (loading: boolean) => set({ loading }),

  addItem: async (session: string, title: string, url: string, description?: string) => {
    const { blockId, readingItems } = get()
    try {
      const createResponse = await axios.post(`${BACKEND_URL}/api/items/create/`, 
        { title, description: description || "", metadata: { url } },
        { headers: { Authorization: `Bearer ${session}` } }
      )

      const createdItem = createResponse.data.item

      const updatedItems = [...readingItems.map(item => item._id), createdItem._id]
      await axios.put(`${BACKEND_URL}/api/blocks/${blockId}`,
        { data: { item: updatedItems } },
        { headers: { Authorization: `Bearer ${session}` } }
      )

      set(state => ({
        readingItems: [...state.readingItems, createdItem],
        newItemTitle: "",
        newItemUrl: "",
        addingItem: false
      }))
    } catch (error) {
      console.error("Error adding item:", error)
    }
  },

  deleteItem: async (session: string, itemId: string) => {
    const { blockId, readingItems } = get()
    try {
      const updatedItems = readingItems.filter(item => item._id !== itemId).map(item => item._id)
      await axios.put(`${BACKEND_URL}/api/blocks/${blockId}`,
        { data: { item: updatedItems } },
        { headers: { Authorization: `Bearer ${session}` } }
      )

      set(state => ({
        readingItems: state.readingItems.filter(item => item._id !== itemId)
      }))
    } catch (error) {
      console.error("Error deleting item:", error)
    }
  }
}))

export default useReadingStore