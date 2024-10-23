import axios, { AxiosError } from "axios"
import { create } from "zustand"

import { CycleItem, CycleItemStore } from "../@types/Items/Cycle"
import { BACKEND_URL } from "../constants/urls"

const api = axios.create({
  baseURL: BACKEND_URL,
})

interface ViewState {
  items: CycleItem[]
  isLoading: boolean
  error: null | string
}

const initialViewState: ViewState = {
  items: [],
  isLoading: false,
  error: null,
}

interface ExtendedCycleItemStore extends CycleItemStore {
  inbox: ViewState
  today: ViewState
  thisWeek: ViewState
  setViewItems: (
    view: "inbox" | "today" | "thisWeek",
    items: CycleItem[]
  ) => void
}

export const useCycleItemStore = create<ExtendedCycleItemStore>((set) => ({
  // Separate states for different views
  inbox: { ...initialViewState },
  today: { ...initialViewState },
  thisWeek: { ...initialViewState },

  // Keep these for backward compatibility
  items: [],
  currentItem: null,
  isLoading: false,
  error: null,

  setViewItems: (view, items) => {
    set((state) => ({
      [view]: {
        ...state[view],
        items,
      },
      // Keep the items array updated for backward compatibility
      items,
    }))
  },

  setCurrentItem: (item: CycleItem | null) => {
    set({ currentItem: item })
  },

  fetchItems: async (session: string, date?: string) => {
    const view = date ? "today" : "inbox"
    set((state) => ({
      [view]: { ...state[view], isLoading: true, error: null },
      isLoading: true,
      error: null,
    }))

    try {
      const endpoint = date ? `/api/${date}` : "/api/inbox"
      const { data } = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${session}` },
      })

      set((state) => ({
        [view]: {
          items: data.response || [],
          isLoading: false,
          error: null,
        },
        items: data.response || [],
        isLoading: false,
      }))
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "An unknown error occurred"

      set((state) => ({
        [view]: {
          ...state[view],
          error: errorMessage,
          isLoading: false,
        },
        error: errorMessage,
        isLoading: false,
      }))
    }
  },

  fetchThisWeek: async (session: string) => {
    set((state) => ({
      thisWeek: { ...state.thisWeek, isLoading: true, error: null },
      isLoading: true,
      error: null,
    }))

    try {
      const { data } = await api.get(`/api/this-week/`, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      })

      set((state) => ({
        thisWeek: {
          items: data.response || [],
          isLoading: false,
          error: null,
        },
        items: data.response || [],
        isLoading: false,
      }))
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "An unknown error occurred"

      set((state) => ({
        thisWeek: {
          ...state.thisWeek,
          error: errorMessage,
          isLoading: false,
        },
        error: errorMessage,
        isLoading: false,
      }))
    }
  },

  fetchItem: async (session: string, id: string) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await api.get(`/api/inbox/${id}`, {
        headers: { Authorization: `Bearer ${session}` },
      })
      set({ currentItem: data.response, isLoading: false })
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "An unknown error occurred"
      set({ error: errorMessage, isLoading: false })
    }
  },

  fetchItemByDate: async (session: string, date: string) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await api.get(`/api/${date}`, {
        headers: { Authorization: `Bearer ${session}` },
      })
      const item =
        data.response && data.response.length > 0 ? data.response[0] : null
      set({ currentItem: item, isLoading: false })
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "An unknown error occurred"
      set({ error: errorMessage, isLoading: false })
    }
  },
  fetchBlocksBySpaceId: async (session: string, spaceId: string) => {
    set({ error: null })
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/spaces/${spaceId}/blocks`,
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )
      const blocks = data.blocks
      return blocks
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "An unknown error occurred"
      set({ error: errorMessage })
    }
  },
  createItem: async (session: string, item: Partial<CycleItem>) => {
    set((state) => ({
      inbox: { ...state.inbox, isLoading: true, error: null },
      error: null,
    }))
    try {
      const itemPreview = {
        _id: "item-preview",
        title: item.title,
        description: item.description,
        spaces: [],
        blocks: [],
      }
      set((state: any) => ({
        items: [itemPreview, ...state.items],
      }))
      const { data } = await api.post("/api/inbox", item, {
        headers: { Authorization: `Bearer ${session}` },
      })
      set((state) => {
        const updatedItems = state.items.map((item) =>
          item._id === "item-preview" ? { ...item, ...data.response } : item
        )

        if (JSON.stringify(updatedItems) !== JSON.stringify(state.items)) {
          return {
            items: updatedItems,
          }
        }
        set((state) => ({
          inbox: {
            items: [data.response, ...state.inbox.items],
            isLoading: false,
            error: null,
          },
          items: [data.response, ...state.items],
        }))
        return { ...state }
      })

      return data.response
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "An unknown error occurred"

      set((state) => ({
        inbox: {
          ...state.inbox,
          error: errorMessage,
          isLoading: false,
        },
        error: errorMessage,
      }))
    }
  },

  updateItem: async (
    session: string,
    updates: Partial<CycleItem>,
    id: string
  ) => {
    set({ error: null })
    try {
      const { data } = await api.put(`/api/inbox/${id}`, updates, {
        headers: { Authorization: `Bearer ${session}` },
      })

      set((state) => {
        // Update items in all views
        const updateItemsInView = (items: CycleItem[]) =>
          items.map((item) =>
            item._id === id ? { ...item, ...data.response } : item
          )

        const updatedInbox = updateItemsInView(state.inbox.items)
        const updatedToday = updateItemsInView(state.today.items)
        const updatedThisWeek = updateItemsInView(state.thisWeek.items)
        const updatedItems = updateItemsInView(state.items)

        const updatedCurrentItem =
          state.currentItem?._id === id
            ? { ...state.currentItem, ...data.response }
            : state.currentItem

        return {
          inbox: { ...state.inbox, items: updatedInbox },
          today: { ...state.today, items: updatedToday },
          thisWeek: { ...state.thisWeek, items: updatedThisWeek },
          items: updatedItems,
          currentItem: updatedCurrentItem,
        }
      })
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "An unknown error occurred"
      set({ error: errorMessage })
    }
  },
  deleteItem: async (
    session: string,
    updates: Partial<CycleItem>,
    id: string
  ) => {
    try {
      set((state) => {
        const index = state.items.findIndex((item) => item._id === id)
        if (index !== -1) {
          state.items.splice(index, 1)
        }
        return {
          items: state.items,
        }
      })
      await api.put(`/api/inbox/${id}`, updates, {
        headers: { Authorization: `Bearer ${session}` },
      })
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "An unknown error occurred"
    }
  },
}))
