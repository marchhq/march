// reading.store.ts
import axios from "axios";
import { create } from "zustand";

import { BACKEND_URL } from "../constants/urls";
import { ReadingItem, ReadingLabel } from "../@types/Items/Reading";

interface ReadingStoreType {
  spaceId: string;
  readingItems: ReadingItem[];
  isFetched: boolean;
  labels: ReadingLabel[];
  setIsFetched: (isFetched: boolean) => void;
  setReadingItems: (items: ReadingItem[]) => void;
  setSpaceId: (spaceId: string) => void;
  fetchReadingList: (session: string, blockId: string) => Promise<void>;
  addItem: (
    session: string,
    blockId: string,
    title: string,
    description?: string
  ) => Promise<void>;
  deleteItem: (
    session: string,
    blockId: string,
    itemId: string
  ) => Promise<void>;
  fetchLabels: (session: string) => Promise<void>;
  updateItem: (
    session: string,
    itemId: string,
    updatedItem: Partial<ReadingItem>
  ) => Promise<void>;
}

const useReadingStore = create<ReadingStoreType>((set, get) => ({
  // State Variables
  spaceId: "",
  readingItems: [],
  isFetched: false,
  labels: [],

  // State Setters
  setIsFetched: (isFetched) => set({ isFetched }),
  setReadingItems: (items) => set({ readingItems: items }),
  setSpaceId: (spaceId) => set({ spaceId }),

  // API Calls
  fetchReadingList: async (session, blockId) => {
    if (!blockId) {
      console.warn("fetchReadingList: No blockId provided");
      set({ isFetched: true, readingItems: [] });
      return;
    }

    try {
      const response = await axios.get(`${BACKEND_URL}/api/blocks/${blockId}`, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      });
      set({ readingItems: response.data.block.data.item, isFetched: true });
    } catch (error) {
      console.error("Error fetching reading list:", error);
      set({ isFetched: true, readingItems: [] });
    }
  },

  addItem: async (session, blockId, title, description = "") => {
    const { readingItems } = get();
    try {
      const itemData = { title, description };

      const createResponse = await axios.post(
        `${BACKEND_URL}/api/items/create/`,
        itemData,
        { headers: { Authorization: `Bearer ${session}` } }
      );

      const createdItem = createResponse.data.item;

      const updatedItems = [
        ...readingItems.map((item) => item._id),
        createdItem._id,
      ];
      await axios.put(
        `${BACKEND_URL}/api/blocks/${blockId}`,
        { data: { item: updatedItems } },
        { headers: { Authorization: `Bearer ${session}` } }
      );

      set((state) => ({
        readingItems: [...state.readingItems, createdItem],
      }));
    } catch (error) {
      console.error("Error adding item:", error);
    }
  },

  deleteItem: async (session, blockId, itemId) => {
    const { readingItems } = get();
    try {
      const updatedItems = readingItems
        .filter((item) => item._id !== itemId)
        .map((item) => item._id);
      await axios.put(
        `${BACKEND_URL}/api/blocks/${blockId}`,
        { data: { item: updatedItems } },
        { headers: { Authorization: `Bearer ${session}` } }
      );

      set((state) => ({
        readingItems: state.readingItems.filter((item) => item._id !== itemId),
      }));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  },

  fetchLabels: async (session) => {
    const { spaceId } = get();
    if (!spaceId) {
      console.warn("fetchLabels: No spaceId set in store");
      return;
    }
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/spaces/${spaceId}/labels/`,
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      );
      set({ labels: response.data.labels });
    } catch (error) {
      console.error("Error fetching labels:", error);
      set({ labels: [] });
    }
  },

  updateItem: async (session, itemId, updatedItem) => {
    try {
      await axios.put(`${BACKEND_URL}/api/items/${itemId}`, updatedItem, {
        headers: { Authorization: `Bearer ${session}` },
      });

      set((state) => ({
        readingItems: state.readingItems.map((item) =>
          item._id === itemId ? { ...item, ...updatedItem } : item
        ),
      }));
    } catch (error) {
      console.error("Error updating item:", error);
    }
  },
}));

export default useReadingStore;