import { create } from "zustand"

type ItemType = "note" | "todo" | "link"

interface ItemTypeStore {
  selectedType: ItemType
  setSelectedType: (type: ItemType) => void
}

export const useItemTypeStore = create<ItemTypeStore>((set) => ({
  selectedType: "note",
  setSelectedType: (type) => set({ selectedType: type }),
}))
