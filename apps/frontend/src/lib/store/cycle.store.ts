import axios, { AxiosError } from "axios"
import { create } from "zustand"

import { CycleItem, CycleItemStore } from "../@types/Items/Cycle"
import { BACKEND_URL } from "../constants/urls"
import { toUtcDate } from "@/src/utils/datetime"

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
  byDate: ViewState
  overdue: ViewState
  thisWeek: ViewState
  favorites: ViewState
  setViewItems: (
    view: "inbox" | "byDate" | "overdue" | "thisWeek",
    items: CycleItem[]
  ) => void
  setWeekDates: (startDate: string, endDate: string) => void
}

export const useCycleItemStore = create<ExtendedCycleItemStore>((set, get) => ({
  inbox: { ...initialViewState },
  byDate: { ...initialViewState },
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
      const errorMessage = "unknow: failed to fetch inbox"
      console.error(errorMessage, error)

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

  fetchByDate: async (session: string, date: string) => {
    set((state) => ({
      byDate: { ...state.byDate, isLoading: true, error: null },
      isLoading: true,
      error: null,
    }))

    try {
      const { data } = await api.get(`/api/${date}`, {
        headers: { Authorization: `Bearer ${session}` },
      })

      set((state) => ({
        byDate: {
          items: data.response.today || [],
          isLoading: false,
          error: null,
        },
        isLoading: false,
      }))
    } catch (error) {
      const errorMessage = "unknow: failed to fetch by date"
      console.error(errorMessage, error)

      set((state) => ({
        byDate: {
          ...state.byDate,
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
      const errorMessage = "unknow: failed to fetch overdue"
      console.error(errorMessage, error)

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
      const errorMessage = "unknow: failed to fetch this week"
      console.error(errorMessage, error)

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
      const errorMessage = "unknown: failed to fetch favorites"
      console.error(errorMessage, error)

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
      const errorMessage = "unknown: failed to fetch item"
      console.error(errorMessage, error)
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
      const errorMessage = "unknown: failed to fetch item by date"
      console.error(errorMessage, error)
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
        const start = new Date(thisWeek.startDate).toISOString()
        const end = new Date(thisWeek.endDate).toISOString()

        itemToCreate.cycle = {
          startsAt: start,
          endsAt: end,
          ...itemToCreate.cycle,
        }
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
      const errorMessage = "unknown: failed to create item"
      console.error(errorMessage, error)

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
      const updateItemsInViewInbox = (items: CycleItem[]) => {
        // remove item from inbox if dueDate is set (not null)
        if (updates.dueDate) {
          return items.filter((item) => item._id !== id)
        }

        if (updates.cycle) {
          return items.filter((item) => item._id !== id)
        }
        // otherwise, just update the item in inbox
        return items.map((item) =>
          item._id === id ? { ...item, ...updates } : item
        )
      }

      const updateItemsInViewByDate = (items: CycleItem[]) => {
        if (updates.dueDate === null) {
          return items.filter((item) => item._id !== id)
        }

        if (updates.dueDate) {
          const newDueDate = updates.dueDate
          const todayDate = new Date()

          const formattedNewDueDate = newDueDate?.toISOString().split("T")[0]
          const formattedTodayDate = todayDate.toISOString().split("T")[0]

          if (formattedNewDueDate !== formattedTodayDate) {
            return items.filter((item) => item._id !== id)
          }
        }

        // otherwise, just update the item in by date view
        return items.map((item) =>
          item._id === id ? { ...item, ...updates } : item
        )
      }

      const updateItemsInView = (items: CycleItem[], isOverdue = false) => {
        // Only filter out done items from overdue list
        if (isOverdue) {
          if (updates.dueDate === null) {
            return items.filter((item) => item._id !== id)
          }

          if (updates.dueDate) {
            const newDueDate = updates.dueDate
            const todayDate = new Date()

            const formattedNewDueDate = newDueDate?.toISOString().split("T")[0]
            const formattedTodayDate = todayDate.toISOString().split("T")[0]

            if (formattedNewDueDate !== formattedTodayDate) {
              return items.filter((item) => item._id !== id)
            }
          }

          if (updates.status === "done") {
            return items.filter((item) => item._id !== id)
          }
        }

        // For all other lists, just update the item
        return items.map((item) =>
          item._id === id ? { ...item, ...updates } : item
        )
      }

      return {
        inbox: {
          ...state.inbox,
          items: updateItemsInViewInbox(state.inbox.items),
        },
        byDate: {
          ...state.byDate,
          items: updateItemsInViewByDate(state.byDate.items),
        }, // No filtering
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
      // Adjust dueDate to UTC if it's a Date object
      if (updates.dueDate instanceof Date) {
        updates.dueDate = toUtcDate(updates.dueDate)
      }

      const { data } = await api.put(
        `/api/inbox/${id}`,
        {
          ...updates,
          dueDate: updates.dueDate,
        },
        {
          headers: { Authorization: `Bearer ${session}` },
        }
      )

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
          byDate: {
            ...state.byDate,
            items: updateItemsInView(state.byDate.items),
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
      const errorMessage = "unknown: failed to update item"
      console.error(errorMessage, error)

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
        byDate: {
          ...state.byDate,
          items: deleteItemsInView(state.byDate.items),
        },
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
          byDate: {
            ...state.byDate,
            items: updateItemsInView(state.byDate.items),
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
      const errorMessage = "unknown: failed to delete item"
      console.error(errorMessage, error)

      set((state) => ({
        ...state,
        error: errorMessage,
      }))
      throw error
    }
  },
  setInboxItems: (items) => {
    set((state) => ({
      inbox: {
        ...state.inbox,
        items,
        isLoading: false,
        error: null,
      },
    }))
  },
}))
