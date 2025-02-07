"use server"
import axios from "axios"

import { Array } from "../../@types/Array"
import { BACKEND_URL } from "../../constants/urls"

export const getArrays = async (session: string): Promise<Array[]> => {
  const response = await axios.get(`${BACKEND_URL}/arrays`, {
    headers: {
      Authorization: `Bearer ${session}`,
    },
  })
  return response.data.arrays
}

export const getArrayById = async (
  session: string,
  id: string
): Promise<Array> => {
  const res = await axios.get(`${BACKEND_URL}/arrays/${id}`, {
    headers: {
      Authorization: `Bearer ${session}`,
    },
  })

  return res.data.array
}
