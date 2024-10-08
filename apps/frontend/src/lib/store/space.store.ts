import axios from "axios"
import { create } from "zustand"

import { Space, SpaceStoreTypes } from "@/src/lib/@types/Items/Space"
import { BACKEND_URL } from "../constants/urls"

// Utility function to create config with Authorization header
const getConfig = (session: string) => ({
  headers: {
    Authorization: `Bearer ${session}`,
  },
})

const useSpaceStore = create<SpaceStoreTypes>((set, get) => ({
  pages: [],
  page: null,
  loading: false,
  error: null,

  // Fetch all pages
  fetchPages: async (session: string) => {
    set({ loading: true, error: null })
    try {
      const config = getConfig(session)
      const response = await axios.get<{ pages: Space[] }>(
        `${BACKEND_URL}/api/spaces/overview/`,
        config
      )
      set({ pages: response.data.pages, loading: false })
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Failed to fetch pages",
        loading: false,
      })
    }
  },

  // Fetch a specific page by ID
  fetchPageById: async (id: string, session: string) => {
    set({ loading: true, error: null })
    try {
      const config = getConfig(session)
      const response = await axios.get<{ page: Space }>(
        `${BACKEND_URL}/api/spaces/${id}`,
        config
      )
      set({ page: response.data.page, loading: false })
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Error while fetching page",
        loading: false,
      })
    }
  },

  // Create a page
  createPage: async (data: Space, session: string) => {
    set({ loading: true, error: null })
    try {
      const config = getConfig(session)
      // Post request, sending `CreatePage`, receiving `Page`
      const response = await axios.post<{ page: Space }>(
        `${BACKEND_URL}/api/spaces/create/`,
        data,
        config
      )
      set((state) => ({
        pages: [response.data.page, ...state.pages], // Response contains the full `Page` object
        loading: false,
      }))
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Error while creating page",
        loading: false,
      })
    }
  },

  // Update an existing page
  updatePage: async (_id: string, data: Space, session: string) => {
    set({ loading: true, error: null })
    try {
      const config = getConfig(session)
      const response = await axios.put<{ page: Space }>(
        `${BACKEND_URL}/api/spaces/${_id}`,
        data,
        config
      )
      const updatedPage = response.data.page
      set({
        pages: get().pages.map((page) =>
          page._id === _id ? updatedPage : page
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

  // Set selected page in state
  setSelectedPage: (page: Space | null) => {
    set({ page })
  },
}))

export default useSpaceStore
