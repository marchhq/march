import axios, { AxiosError } from "axios"
import { create } from "zustand"

import { BACKEND_URL } from "../constants/urls"
import {
  InboxItem,
  InboxItemCreateResponse,
  InboxStoreType,
  OverdueInboxItem,
  TodayInboxItem,
} from "@/src/lib/@types/Items/Inbox"

const useInboxStore = create<InboxStoreType>((set) => ({
  inboxItems: [],
  todayInboxItems: [],
  overdueInboxItems: [],
  isLoading: false,
  isFetched: false,
  setIsFetched: (isFetched: boolean) => {
    set({ isFetched })
  },
  fetchInboxData: async (session: string) => {
    let inboxItems_: InboxItem[] = []
    set({ isLoading: true })
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      }
      const { data } = await axios.get(`${BACKEND_URL}/api/my`, config)
      inboxItems_ = data.response as InboxItem[]
    } catch (error) {
      const e = error as AxiosError
      console.error("error fetching my: ", e)
    }
    set({ inboxItems: inboxItems_ })
    set({ isLoading: false })
    return inboxItems_
  },
  setInboxItems: (inboxItems: InboxItem[]) => {
    // setState for inboxItems
    set({ inboxItems })
  },
  fetchTodayInboxData: async (session: string) => {
    let todayItems_: TodayInboxItem[] = []
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      }
      const { data } = await axios.get(`${BACKEND_URL}/api/my/today`, config)
      todayItems_ = data.response.items as TodayInboxItem[]
    } catch (error) {
      const e = error as AxiosError
      console.error("error fetching my-today: ", e)
    }
    set({ todayInboxItems: todayItems_ })
    return todayItems_
  },
  setTodayInboxItems: (todayInboxItems: TodayInboxItem[]) => {
    // setState for todayInboxItems
    set({ todayInboxItems })
  },
  fetchOverdueInboxData: async (session: string) => {
    let overdueItems_: OverdueInboxItem[] = []
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      }
      const { data } = await axios.get(`${BACKEND_URL}/api/my/overdue`, config) // Fetch overdue items
      overdueItems_ = data.response.items as OverdueInboxItem[]
    } catch (error) {
      const e = error as AxiosError
      console.error("error fetching my-overdue: ", e)
    }
    set({ overdueInboxItems: overdueItems_ })
    return overdueItems_
  },
  setOverdueInboxItems: (overdueInboxItems: OverdueInboxItem[]) => {
    set({ overdueInboxItems })
  },
  moveItemToDate: async (session: string, id: string, date: Date) => {
    // Update the date of an item
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      }
      const response = await axios.post(
        `${BACKEND_URL}/api/setDate/`,
        { id, date: date ? date : null },
        config
      )
      const updatedItem = response.data.response.items

      // Update the inboxItems with the updated item
      set((state) => ({
        inboxItems: state.inboxItems.map((item) =>
          item._id === id ? { ...item, dueDate: date } : item
        ),
      }))
      return updatedItem
    } catch (error) {
      const e = error as AxiosError
      console.error("error moving item to new date: ", e)
      return null
    }
  },
  updateItem: async (session: string, editedItem: InboxItem, id: string) => {
    set((state) => ({
      inboxItems: state.inboxItems.map((item) =>
        item._id === id
          ? {
              ...item,
              title: editedItem.title,
              description: editedItem.description,
            }
          : item
      ),
    }))
    try {
      await axios.put(`${BACKEND_URL}/api/items/${id}`, editedItem, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      })
    } catch (error) {
      const e = error as AxiosError
      console.error("error updating inbox item: ", e)
    }
  },
  addItem: async (session: string, title: string, description: string) => {
    let res: InboxItemCreateResponse
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/items/create`,
        {
          title,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )
      res = data as InboxItemCreateResponse
      set((state: InboxStoreType) => ({
        inboxItems: [res.item, ...state.inboxItems],
      }))
      return res.item
    } catch (error) {
      const e = error as AxiosError
      console.error("error adding item to inbox: ", e)
      return null
    }
  },
  deleteItem: async (session: string, id: string) => {
    try {
      set((state: InboxStoreType) => {
        const index = state.inboxItems.findIndex((i) => i._id === id)
        if (index !== -1) {
          state.inboxItems.splice(index, 1)
        }
        return {
          inboxItems: state.inboxItems,
        }
      })
      await axios.put(
        `${BACKEND_URL}/api/items/${id}`,
        {
          isDeleted: true,
        },
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )
    } catch (error) {
      const e = error as AxiosError
      console.error("error deleting inbox item: ", e)
    }
  },
}))

export default useInboxStore
