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
  startDate?: string
  endDate?: string
}

const initialViewState: ViewState = {
  items: [],
  isLoading: false,
  error: null,
  startDate: "",
  endDate: "",
}

interface ExtendedCycleItemStore extends CycleItemStore {
  inbox: ViewState
  today: ViewState
  overdue: ViewState
  thisWeek: ViewState
  favorites: ViewState
  setViewItems: (
    view: "inbox" | "today" | "overdue" | "thisWeek",
    items: CycleItem[]
  ) => void
  setWeekDates: (startDate: string, endDate: string) => void
}

export const useCycleItemStore = create<ExtendedCycleItemStore>((set, get) => ({
  inbox: { ...initialViewState },
  today: { ...initialViewState },
  overdue: { ...initialViewState },
  thisWeek: { ...initialViewState },
  favorites: { ...initialViewState },
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
      items: view === "inbox" ? items : state.items,
    }))
  },

  setCurrentItem: (item: CycleItem | null) => {
    set({ currentItem: item })
  },

  fetchInbox: async (session: string) => {
    set((state) => ({
      inbox: { ...state.inbox, isLoading: true, error: null },
      isLoading: true,
      error: null,
    }))

    try {
      const { data } = await api.get("/api/inbox", {
        headers: { Authorization: `Bearer ${session}` },
      })

      set((state) => ({
        inbox: {
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
          : "unknow: failed to fetch inbox"

      set((state) => ({
        inbox: {
          ...state.inbox,
          error: errorMessage,
          isLoading: false,
        },
        error: errorMessage,
        isLoading: false,
      }))
    }
  },

  fetchToday: async (session: string, date: string) => {
    set((state) => ({
      today: { ...state.today, isLoading: true, error: null },
      isLoading: true,
      error: null,
    }))

    try {
      const { data } = await api.get(`/api/${date}`, {
        headers: { Authorization: `Bearer ${session}` },
      })

      set((state) => ({
        today: {
          items: data.response.today || [],
          isLoading: false,
          error: null,
        },
        isLoading: false,
      }))
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "unknow: failed to fetch today"

      set((state) => ({
        today: {
          ...state.today,
          error: errorMessage,
          isLoading: false,
        },
        error: errorMessage,
        isLoading: false,
      }))
    }
  },

  fetchOverdue: async (session: string, date: string) => {
    set((state) => ({
      overdue: { ...state.overdue, isLoading: true, error: null },
      isLoading: true,
      error: null,
    }))

    try {
      const { data } = await api.get(`/api/${date}`, {
        headers: { Authorization: `Bearer ${session}` },
      })

      set((state) => ({
        overdue: {
          items: data.response.overdue || [],
          isLoading: false,
          error: null,
        },
        isLoading: false,
      }))
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "unknow: failed to fetch overdue"

      set((state) => ({
        overdue: {
          ...state.overdue,
          error: errorMessage,
          isLoading: false,
        },
        error: errorMessage,
        isLoading: false,
      }))
    }
  },

  setWeekDates: (startDate, endDate) => {
    set((state) => ({
      thisWeek: {
        ...state.thisWeek,
        startDate,
        endDate,
      },
    }))
  },

  fetchThisWeek: async (
    session: string,
    startDate?: string,
    endDate?: string
  ) => {
    set((state) => ({
      thisWeek: {
        ...state.thisWeek,
        isLoading: true,
        error: null,
        startDate: startDate || state.thisWeek.startDate,
        endDate: endDate || state.thisWeek.endDate,
      },
      isLoading: true,
      error: null,
    }))

    try {
      const queryParams = new URLSearchParams()
      if (startDate) queryParams.append("startDate", startDate)
      if (endDate) queryParams.append("endDate", endDate)

      const url = `/api/this-week/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`

      const { data } = await api.get(url, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      })

      set((state) => ({
        thisWeek: {
          items: data.response || [],
          isLoading: false,
          error: null,
          startDate: startDate || state.thisWeek.startDate,
          endDate: endDate || state.thisWeek.endDate,
        },
        items: data.response || [],
        isLoading: false,
      }))
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "unknow: failed to fetch this week"

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
  fetchFavorites: async (session: string) => {
    set((state) => ({
      favorites: { ...state.favorites, isLoading: true, error: null },
      isLoading: true,
      error: null,
    }))

    try {
      const { data } = await api.get("/api/favorite", {
        headers: { Authorization: `Bearer ${session}` },
      })

      set((state) => ({
        favorites: {
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
          : "unknown: failed to fetch favorites"

      set((state) => ({
        favorites: {
          ...state.favorites,
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
          : "unknown: failed to fetch item"
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
          : "unknown: failed to fetch item by date"
      set({ error: errorMessage, isLoading: false })
    }
  },

  createItem: async (session: string, item: Partial<CycleItem>) => {
    set((state) => ({
      inbox: { ...state.inbox, isLoading: true, error: null },
      thisWeek: { ...state.thisWeek, isLoading: true, error: null },
      isLoading: true,
      error: null,
    }))

    try {
      // get fresh state
      const currentState = get()
      const { thisWeek } = currentState

      const itemToCreate = { ...item }

      // Calculate cycleDate if we're in thisWeek view and have dates
      if (thisWeek.startDate && thisWeek.endDate) {
        const start = new Date(thisWeek.startDate)
        const end = new Date(thisWeek.endDate)
        const middleTimestamp =
          start.getTime() + (end.getTime() - start.getTime()) / 2
        itemToCreate.cycleDate = new Date(middleTimestamp).toISOString()
      }

      const { data } = await api.post("/api/inbox", itemToCreate, {
        headers: { Authorization: `Bearer ${session}` },
      })

      set((state) => ({
        inbox: {
          items: [data.response, ...state.inbox.items],
          isLoading: false,
          error: null,
        },
        thisWeek: {
          ...state.thisWeek,
          items: [...state.thisWeek.items, data.response],
          isLoading: false,
          error: null,
        },
        items: [data.response, ...state.items],
        isLoading: false,
      }))

      return data.response
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "unknown: failed to create item"

      set((state) => ({
        inbox: {
          ...state.inbox,
          error: errorMessage,
          isLoading: false,
        },
        thisWeek: {
          ...state.thisWeek,
          error: errorMessage,
          isLoading: false,
        },
        error: errorMessage,
        isLoading: false,
      }))
      throw error
    }
  },

  updateItem: async (
    session: string,
    updates: Partial<CycleItem>,
    id: string
  ) => {
    set((state) => {
      const updateItemsInView = (items: CycleItem[], isOverdue = false) => {
        // Only filter out done items from overdue list
        if (isOverdue && updates.status === "done") {
          return items.filter((item) => item._id !== id)
        }

        // For all other lists, just update the item
        return items.map((item) =>
          item._id === id ? { ...item, ...updates } : item
        )
      }

      return {
        inbox: { ...state.inbox, items: updateItemsInView(state.inbox.items) },
        today: { ...state.today, items: updateItemsInView(state.today.items) }, // No filtering
        overdue: {
          ...state.overdue,
          items: updateItemsInView(state.overdue.items, true),
        }, // Only filter overdue
        thisWeek: {
          ...state.thisWeek,
          items: updateItemsInView(state.thisWeek.items),
        },
        items: updateItemsInView(state.items),
        currentItem:
          state.currentItem?._id === id
            ? { ...state.currentItem, ...updates }
            : state.currentItem,
      }
    })

    try {
      const { data } = await api.put(`/api/inbox/${id}`, updates, {
        headers: { Authorization: `Bearer ${session}` },
      })

      // Update with server response
      set((state) => {
        const updateItemsInView = (items: CycleItem[]) =>
          items.map((item) =>
            item._id === id ? { ...item, ...data.response } : item
          )

        return {
          inbox: {
            ...state.inbox,
            items: updateItemsInView(state.inbox.items),
          },
          today: {
            ...state.today,
            items: updateItemsInView(state.today.items),
          },
          overdue: {
            ...state.overdue,
            items: updateItemsInView(state.overdue.items),
          },
          thisWeek: {
            ...state.thisWeek,
            items: updateItemsInView(state.thisWeek.items),
          },
          items: updateItemsInView(state.items),
          currentItem:
            state.currentItem?._id === id
              ? { ...state.currentItem, ...data.response }
              : state.currentItem,
          error: null,
        }
      })
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "unknown: failed to update item"

      set((state) => ({
        ...state,
        error: errorMessage,
      }))
      throw error
    }
  },
  deleteItem: async (session: string, id: string) => {
    const updates = { isDeleted: true }

    set((state) => {
      const deleteItemsInView = (items: CycleItem[]) =>
        items.filter((item) => item._id !== id)

      return {
        inbox: { ...state.inbox, items: deleteItemsInView(state.inbox.items) },
        today: { ...state.today, items: deleteItemsInView(state.today.items) },
        overdue: {
          ...state.overdue,
          items: deleteItemsInView(state.overdue.items),
        },
        thisWeek: {
          ...state.thisWeek,
          items: deleteItemsInView(state.thisWeek.items),
        },
        items: deleteItemsInView(state.items),
        currentItem: state.currentItem?._id === id ? null : state.currentItem,
      }
    })

    try {
      const { data } = await api.put(`/api/inbox/${id}`, updates, {
        headers: { Authorization: `Bearer ${session}` },
      })

      set((state) => {
        const updateItemsInView = (items: CycleItem[]) =>
          items.map((item) =>
            item._id === id ? { ...item, ...data.response } : item
          )

        return {
          inbox: {
            ...state.inbox,
            items: updateItemsInView(state.inbox.items),
          },
          today: {
            ...state.today,
            items: updateItemsInView(state.today.items),
          },
          overdue: {
            ...state.overdue,
            items: updateItemsInView(state.overdue.items),
          },
          thisWeek: {
            ...state.thisWeek,
            items: updateItemsInView(state.thisWeek.items),
          },
          items: updateItemsInView(state.items),
          error: null,
        }
      })
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "unknown: failed to delete item"

      set((state) => ({
        ...state,
        error: errorMessage,
      }))
      throw error
    }
  },
}))
