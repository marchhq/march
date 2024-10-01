import axios, { AxiosError } from "axios"
import { create } from "zustand"

import {
  InboxItem,
  InboxItemCreateResponse,
  InboxStoreType,
  OverdueInboxItem,
  TodayInboxItem,
} from "@/src/lib/@types/Items/Inbox"

import { BACKEND_URL } from "../constants/urls"

const useInboxStore = create<InboxStoreType>((set) => ({
  inboxItems: [],
  todayInboxItems: [],
  overdueInboxItems: [],
  isFetched: false,
  setIsFetched: (isFetched: boolean) => {
    set({ isFetched })
  },
  fetchInboxData: async (session: string) => {
    let inboxItems_: InboxItem[] = []
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
      console.error("Error while fetching my::", e.message)
    }
    set({ inboxItems: inboxItems_ })
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
      console.error("Error while fetching my-today::", e.message)
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
      console.error("Error while fetching my-overdue::", e.message)
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
      console.error("Error while moving item to new date::", e.message)
      return null
    }
  },
  updateItem: (editedItem: InboxItem, id: string) => {
    set((state) => ({
      inboxItems: state.inboxItems.map((item) =>
        item.uuid === id
          ? {
              ...item,
              title: editedItem.title,
              description: editedItem.description,
            }
          : item
      ),
    }))
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
      console.error("error adding item to inbox:", e)
      return null
    }
  },
}))

export default useInboxStore
