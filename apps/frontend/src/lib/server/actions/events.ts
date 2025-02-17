"use server"

import axios from "axios"

import { CreateEventInput } from "../../@types/Items/event"
import { BACKEND_URL } from "../../constants/urls"

export const getEventsByDate = async (session: string, date: string) => {
  const response = await axios.get(`${BACKEND_URL}/calendar/events/${date}/`, {
    headers: {
      Authorization: `Bearer ${session}`,
    },
  })
  return response.data
}

export const createEvent = async (session: string, event: CreateEventInput) => {
  const response = await axios.post(`${BACKEND_URL}/calendar/events/`, event, {
    headers: {
      Authorization: `Bearer ${session}`,
    },
  })

  return response.data
}
