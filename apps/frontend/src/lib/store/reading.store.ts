import axios from "axios";
import { create } from "zustand";
import { BACKEND_URL } from "../constants/urls";
import { type ReadingItem } from "@/src/lib/@types/Items/Reading";

export interface ReadingStoreType {
  readingItems: ReadingItem[];
  isFetched: boolean;
  setIsFetched: (isFetched: boolean) => void;
  fetchReadingList: (session: string, blockId: string, spaceId: string) => Promise<void>;
  setReadingItems: (items: ReadingItem[]) => void;
  addItem: (
    session: string,
    blockId: string,
    spaceId: string,
    title: string,
    type: string,
    description?: string
  ) => Promise<void>;
  deleteItem: (session: string,spaceId:string, blockId: string, itemId: string) => Promise<void>;
}

const useReadingStore = create<ReadingStoreType>((set, get) => ({
  readingItems: [],
  isFetched: false,

  setIsFetched: (isFetched: boolean) => set({ isFetched }),

  fetchReadingList: async (session: string, blockId: string, spaceId: string) => {
    if (!blockId || !spaceId) {
      console.warn("fetchReadingList: No blockId or spaceId provided");
      set({ isFetched: true, readingItems: [] });
      return;
    }

    try {
      const response = await axios.get(`${BACKEND_URL}/spaces/${spaceId}/blocks/${blockId}/items/`, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      });

      set({ readingItems: response.data.items, isFetched: true });
    } catch (error) {
      console.error("Error fetching reading list:", error);
      set({ isFetched: true, readingItems: [] });
    }
  },

  setReadingItems: (items: ReadingItem[]) => set({ readingItems: items }),

  addItem: async (
    session: string,
    spaceId: string,
    blockId: string,
    title: string,
    type: string,
    description?: string
  ) => {
    const { readingItems } = get();
    try {
      const itemData = { title, description: description || "", type };

      // Create the new item under the specific space and block
      const createResponse = await axios.post(
        `${BACKEND_URL}/spaces/${spaceId}/blocks/${blockId}/items/`,
        itemData,
        { headers: { Authorization: `Bearer ${session}` } }
      );

      const createdItem = createResponse.data.item;

      // Update the block with the new list of items
      const updatedItems = [
        ...readingItems.map((item) => item._id),
        createdItem._id,
      ];
      await axios.put(
        `${BACKEND_URL}/spaces/${spaceId}/blocks/${blockId}/`,
        { data: { items: updatedItems } },
        { headers: { Authorization: `Bearer ${session}` } }
      );

      set((state) => ({
        readingItems: [...state.readingItems, createdItem],
      }));
    } catch (error) {
      console.error("Error adding item:", error);
    }
  },

  deleteItem: async (session: string, spaceId: string, blockId: string, itemId: string ) => {
    const { readingItems } = get();
    try {
      const updatedItems = readingItems
        .filter((item) => item._id !== itemId)
        .map((item) => item._id);
      await axios.put(
        `${BACKEND_URL}/spaces/${spaceId}/blocks/${blockId}/`,
        { data: { items: updatedItems } },
        { headers: { Authorization: `Bearer ${session}` } }
      );

      set((state) => ({
        readingItems: state.readingItems.filter((item) => item._id !== itemId),
      }));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  },
}));

export default useReadingStore;
