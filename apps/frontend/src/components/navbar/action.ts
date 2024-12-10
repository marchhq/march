"use server"
import axios from "axios"

import { Space } from "@/src/lib/@types/Items/Space"
import { BACKEND_URL } from "@/src/lib/constants/urls"

export const fetchSpaces = async (session: string): Promise<Space[]> => {
  const response = await axios.get(`${BACKEND_URL}/spaces`, {
    headers: {
      Authorization: `Bearer ${session}`,
    },
  })
  return response.data.spaces
}
