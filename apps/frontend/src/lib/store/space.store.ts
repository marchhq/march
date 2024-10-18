import axios from "axios"
import { create } from "zustand"

import { BACKEND_URL } from "../constants/urls"
import { Space, SpaceStoreTypes } from "@/src/lib/@types/Items/Space"

// Utility function to create config with Authorization header
const getConfig = (session: string) => ({
  headers: {
    Authorization: `Bearer ${session}`,
  },
})

const useSpaceStore = create<SpaceStoreTypes>((set, get) => ({
  spaces: [],
  space: null,
  loading: false,
  error: null,

  // Fetch all pages
  fetchSpaces: async (session: string) => {
    set({ loading: true, error: null })
    try {
      const config = getConfig(session)
      const response = await axios.get<{ spaces: Space[] }>(
        `${BACKEND_URL}/spaces/`,
        config
      )
      set({ spaces: response.data.spaces, loading: false })
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Failed to fetch pages",
        loading: false,
      })
    }
  },

  // Fetch a specific page by ID
  fetchSpaceById: async (id: string, session: string) => {
    set({ loading: true, error: null })
    try {
      const config = getConfig(session)
      const response = await axios.get<{ space: Space }>(
        `${BACKEND_URL}/spaces/${id}`,
        config
      )
      set({ space: response.data.space, loading: false })
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Error while fetching page",
        loading: false,
      })
    }
  },

  // Create a page
  createSpace: async (data: Space, session: string) => {
    set({ loading: true, error: null })
    try {
      const config = getConfig(session)
      const response = await axios.post<{ space: Space }>(
        `${BACKEND_URL}/spaces/`,
        data,
        config
      )
      set((state) => ({
        spaces: [response.data.space, ...state.spaces],
        loading: false,
      }))
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Error while creating page",
        loading: false,
      })
    }
  },

  // Update & delete an existing page
  updateSpace: async (_id: string, data: Space, session: string) => {
    set({ loading: true, error: null })
    try {
      const config = getConfig(session)
      const response = await axios.put<{ space: Space }>(
        `${BACKEND_URL}/spaces/${_id}`,
        data,
        config
      )
      const updatedSpace = response.data.space
      set({
        spaces: get().spaces.map((space) =>
          space._id === _id ? updatedSpace : space
        ),
        loading: false,
      })
    } catch (error: any) {
      set({
        error: error?.message || "Error while updating page",
        loading: false,
      })
    }
  },

  // Set selected space in state
  setSelectedSpace: (space: Space | null) => {
    set({ space })
  },
}))

export default useSpaceStore
