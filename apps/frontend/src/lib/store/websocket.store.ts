import { create } from "zustand"

interface WebSocketStore {
  isConnected: boolean
  setConnected: (status: boolean) => void
}

export const useWebSocketStore = create<WebSocketStore>((set) => ({
  isConnected: false,
  setConnected: (status) => set({ isConnected: status }),
}))
