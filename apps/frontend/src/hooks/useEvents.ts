import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import axios from "axios";
import { BACKEND_URL } from "../lib/constants/urls";
import { Items } from "../lib/@types/Items/TodayItems";

export const useItems = () => {
  const [items, setItems] = useState<Items | null>(null)
  const { session } = useAuth();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get<Items>(`${BACKEND_URL}/api/my/today/`, {
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        setItems(response.data)
      } catch (error) {
        console.error("failed to fetch items: ", error)
      }
    }

    if (session) {
      fetchItems()
    }
  }, [session])

  return items
}
