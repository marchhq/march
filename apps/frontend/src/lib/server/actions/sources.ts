import axios from "axios"

import { Source, SourceResponse } from "../../@types/Items/sources"
import { BACKEND_URL } from "../../constants/urls"

export default async function getSources(
  session: string | null
): Promise<Source[]> {
  if (!session) {
    console.error("No session provided")
    throw new Error("Session is required")
  }
  try {
    const res = await axios.get<SourceResponse>(`${BACKEND_URL}/sources`, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    })

    return res.data.sources || []
  } catch (error) {
    console.error(error)
    throw new Error("Failed to fetch types")
  }
}
