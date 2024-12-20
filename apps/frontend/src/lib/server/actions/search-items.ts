"use server"

import axios from "axios"

import { getSession } from "./sessions"
import { SearchResponse } from "../../@types/Items/Items"
import { BACKEND_URL } from "../../constants/urls"

export async function searchItems(
  query: string,
  session: string
): Promise<SearchResponse> {
  if (!query) return { response: [] }
  console.log("query: ", query)

  const { data } = await axios.get<SearchResponse>(
    `${BACKEND_URL}/api/items/search/?q=${query}`,
    {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    }
  )

  return data
}
