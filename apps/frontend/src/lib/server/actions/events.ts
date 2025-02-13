"use server"

import axios from "axios"

import { BACKEND_URL } from "../../constants/urls"

export const getEventsByDate = async (session: string, date: string) => {
  const response = await axios.get(`${BACKEND_URL}/calendar/events/${date}/`, {
    headers: {
      Authorization: `Bearer ${session}`,
    },
  })
  return response.data
}
