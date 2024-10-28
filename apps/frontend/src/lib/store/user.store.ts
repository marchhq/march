import axios, { AxiosError } from "axios"
import { create } from "zustand"

import { BACKEND_URL } from "../constants/urls"
import { User } from "@/src/lib/@types/auth/user"

interface UserStoreState {
  user: User | null
  isLoading: boolean
  error: string | null
}

interface UserStoreActions {
  fetchUser: (session: string) => Promise<User | null>
  setUser: (user: User | null) => void
  clearUser: () => void
}

type UserStoreType = UserStoreState & UserStoreActions

const useUserStore = create<UserStoreType>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  fetchUser: async (session: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.get<User>(`${BACKEND_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      })
      set({ user: response.data, isLoading: false })
      return response.data
    } catch (error) {
      const e = error as AxiosError
      console.error("Failed to fetch user info:", e.message)
      set({ error: "Failed to fetch user info", isLoading: false })
      return null
    }
  },

  setUser: (user: User | null) => set({ user }),
  clearUser: () => set({ user: null, error: null }),
}))

export default useUserStore
