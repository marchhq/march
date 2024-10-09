import { useEffect, useState } from "react"

import axios from "axios"

import { useAuth } from "../contexts/AuthContext"
import { Items } from "../lib/@types/Items/TodayItems"
import { BACKEND_URL } from "../lib/constants/urls"

export const useItems = () => {
  const [items, setItems] = useState<Items | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { session } = useAuth()

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get<Items>(
          `${BACKEND_URL}/api/my/today/`,
          {
            headers: {
              Authorization: `Bearer ${session}`,
            },
          }
        )
        setItems(response.data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchItems()
    }
  }, [session])

  return { items, isLoading }
}
