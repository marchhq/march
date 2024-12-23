"use server"

import axios from "axios"

import { Type, TypeResponse } from "../../@types/Items/type"
import { BACKEND_URL } from "../../constants/urls"

export default async function getTypes(
  session: string | null
): Promise<Type[]> {
  if (!session) {
    console.error("No session provided")
    throw new Error("Session is required")
  }

  try {
    const res = await axios.get<TypeResponse>(`${BACKEND_URL}/types`, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    })

    return res.data.types || []
  } catch (error) {
    console.error(error)
    throw new Error("Failed to fetch types")
  }
}
