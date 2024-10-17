import axios from "axios"
import { create } from "zustand"

import { BACKEND_URL } from "../constants/urls"
import { type ReadingItem } from "@/src/lib/@types/Items/Reading"

export interface ReadingStoreType {
  readingItems: ReadingItem[]
  isFetched: boolean
  setIsFetched: (isFetched: boolean) => void
  fetchReadingList: (
    session: string,
    blockId: string,
    spaceId: string
  ) => Promise<void>
  setReadingItems: (items: ReadingItem[]) => void
  addItem: (
    session: string,
    blockId: string,
    spaceId: string,
    itemData: ItemData
  ) => Promise<void>
  deleteItem: (
    session: string,
    spaceId: string,
    blockId: string,
    itemId: string
  ) => Promise<void>
}

interface ItemData {
  title: string
  type: string
  description?: string
  metadata?: {
    url: string
  }
}

const useReadingStore = create<ReadingStoreType>((set, get) => ({
  readingItems: [],
  isFetched: false,

  setIsFetched: (isFetched: boolean) => set({ isFetched }),

  fetchReadingList: async (
    session: string,
    blockId: string,
    spaceId: string
  ) => {
    if (!blockId || !spaceId) {
      console.warn("fetchReadingList: No blockId or spaceId provided")
      set({ isFetched: true, readingItems: [] })
      return
    }

    try {
      const response = await axios.get(
        `${BACKEND_URL}/spaces/${spaceId}/blocks/${blockId}/items/`,
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )

      set({ readingItems: response.data.items, isFetched: true })
    } catch (error) {
      console.error("Error fetching reading list:", error)
      set({ isFetched: true, readingItems: [] })
    }
  },

  setReadingItems: (items: ReadingItem[]) => set({ readingItems: items }),
  addItem: async (
    session: string,
    spaceId: string,
    blockId: string,
    itemData: ItemData
  ) => {
    const { readingItems } = get();
    try {
      // Create the new item under the specific space and block
      const createResponse = await axios.post(
        `${BACKEND_URL}/spaces/${spaceId}/blocks/${blockId}/items/`,
        itemData,
        { headers: { Authorization: `Bearer ${session}` } }
      );
  
      const createdItem = createResponse.data.item;
  
      // **Fix: Ensure you're sending ObjectIds instead of UUIDs**
      // Assuming the readingItems and createdItem are UUIDs or the correct format:
      const updatedItems = readingItems.map((item) => item._id);
      
      updatedItems.push(createdItem._id); // Push new item ID to the array
  
      // Put updated array back to the block
      await axios.put(
        `${BACKEND_URL}/spaces/${spaceId}/blocks/${blockId}/`,
        { data: { items: updatedItems } }, // Only pass object IDs (not UUID strings)
        { headers: { Authorization: `Bearer ${session}` } }
      );
  
      // Update local state
      set((state) => ({
        readingItems: [...state.readingItems, createdItem],
      }));
    } catch (error) {
      console.error("Error adding item:", error);
    }
  },
  
  deleteItem: async (
    session: string,
    spaceId: string,
    blockId: string,
    itemId: string
  ) => {
    const { readingItems } = get()
    try {
      // Perform the delete operation on the server
      await axios.delete(
        `${BACKEND_URL}/spaces/${spaceId}/blocks/${blockId}/items/${itemId}/`,
        { headers: { Authorization: `Bearer ${session}` } }
      )

      // After successful deletion, update the local state
      set((state) => ({
        readingItems: state.readingItems.filter((item) => item._id !== itemId),
      }))
    } catch (error) {
      console.error("Error deleting item:", error)
    }
  },
}))

export default useReadingStore
