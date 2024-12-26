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
    const response = await axios.post<ItemCreateResponse>(
      `${BACKEND_URL}/api/inbox/`,
      data,
      {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error(error)
    throw new Error("failed to create item")
  }
}

export async function getItemsByType(session: string, type: string) {
  let url = `${BACKEND_URL}/api/items`

  if (type === "linear" || type === "github") {
    url += `?source=${type}`
  } else {
    url += `?type=${type}`
  }

  try {
    const res = await axios.get<ItemResponse>(url, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    })

    return res.data.items || []
  } catch (error) {
    console.error(error)
    throw new Error("failed to fetch items")
  }
}

export async function getItemById(session: string | null, id: string) {
  if (!session) {
    console.error("no session provided")
    throw new Error("session is required")
  }

  try {
    console.log("fetching id: ", id)
    const res = await axios.get(`${BACKEND_URL}/api/inbox/${id}`, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    })

    console.log("item by id: ", res.data)
    return res.data || []
  } catch (error) {
    console.error(error)
    throw new Error("failed to fetch items")
  }
}

export async function updateItem(
  session: string | null,
  data: Partial<Item>,
  id: string
) {
  if (!session) {
    console.error("no session provided")
    throw new Error("session is required")
  }

  try {
    const res = await axios.put<ItemCreateResponse>(
      `${BACKEND_URL}/api/inbox/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      }
    )

    return res.data
  } catch (error) {
    console.error(error)
    throw new Error("failed to update items")
  }
}
