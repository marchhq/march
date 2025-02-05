import { useMutation } from "@tanstack/react-query"
import axios from "axios"

import { BACKEND_URL } from "../lib/constants/urls"

export const useAskMutation = (session: string) => {
  return useMutation({
    mutationFn: async (query: string) => {
      const response = await axios.get(
        `${BACKEND_URL}/ai/ask?query=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )
      if (!response.data) throw new Error("failed to fetch response")
      return response.data
    },
  })
}
