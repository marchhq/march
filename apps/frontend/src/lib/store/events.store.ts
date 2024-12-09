import axios, { AxiosError } from "axios"
import { create } from "zustand"

import { Event, Events } from "../@types/Items/event"
import { BACKEND_URL } from "../constants/urls"

export interface EventsStoreType {
  events: Event[]
  currentEvent: Event | null
  fetchEventsByDate: (session: string, date: string) => Promise<void>
  setCurrentEvent: (event: Event | null) => void
}

export const useEventsStore = create<EventsStoreType>((set) => ({
  events: [],
  currentEvent: null,
  fetchEventsByDate: async (session: string, date: string) => {
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/calendar/events/${date}`,
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )

      const response = data as Events
      set((state: EventsStoreType) => ({
        ...state,
        events: response.events,
      }))
    } catch (error) {
      const e = error as AxiosError
      console.error("error fetching events: ", e.response?.data)
    }
  },
  setCurrentEvent: (event: Event | null) => {
    set((state: EventsStoreType) => ({
      ...state,
      currentEvent: event,
    }))
  },
}))
