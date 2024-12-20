import { create } from "zustand"

interface CreateItemStore {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const useCreateStore = create<CreateItemStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))
