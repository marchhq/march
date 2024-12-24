"use server"

import axios from "axios"

import {
  Item,
  ItemCreateResponse,
  ItemResponse,
} from "../../@types/Items/Items"
import { BACKEND_URL } from "../../constants/urls"

export async function createItem(session: string | null, data: Partial<Item>) {
  if (!session) {
    console.error("no session provided")
    throw new Error("session is required")
  }

  try {
    await axios.post(
      `${BACKEND_URL}/api/inbox/`,
      {
        data,
      },
      {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      }
    )
  } catch (error) {
    console.error(error)
    throw new Error("failed to create item")
  }
}

export async function getItemsByType(session: string | null, type: string) {
  if (!session) {
    console.error("no session provided")
    throw new Error("session is required")
  }

  try {
    const res = await axios.get<ItemResponse>(
      `${BACKEND_URL}/api/items/${type}`,
      {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      }
    )

    return res.data.items || []
  } catch (error) {
    console.error(error)
    throw new Error("failed to fetch items")
  }
}

export async function mutateItem(
  session: string | null,
  data: Partial<Item>,
  id: string
) {
  if (!session) {
    console.error("no session provided")
    throw new Error("session is required")
  }

  try {
    await axios.put<ItemCreateResponse>(
      `${BACKEND_URL}/api/inbox/${id}`,
      {
        data,
      },
      {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      }
    )
  } catch (error) {
    console.error(error)
    throw new Error("failed to update items")
  }
}
