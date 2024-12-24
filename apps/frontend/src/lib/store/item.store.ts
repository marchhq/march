import { create } from "zustand"

import { Item } from "../@types/Items/Items"

interface ItemStore {
  currentItem: Item | null
  setCurrentItem: (item: Item | null) => void
  clearCurrentItem: () => void
}

export const useItemStore = create<ItemStore>((set) => ({
  currentItem: null,
  setCurrentItem: (item) => set({ currentItem: item }),
  clearCurrentItem: () => set({ currentItem: null }),
}))
