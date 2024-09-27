import { useEffect, useState } from "react"
import { Spaces } from "../lib/@types/Items/Space"
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { BACKEND_URL } from "../lib/constants/urls";

export const useSpace = () => {
  const [spaces, setSpace] = useState<Spaces | null>(null);
  const { session } = useAuth();

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const response = await axios.get<Spaces>(`${BACKEND_URL}/api/spaces/overview/`, {
          headers: {
            Authorization: `Bearer ${session}`
          }
        })

        setSpace(response.data)

      } catch (error) {
        return console.error("error fetching spaces", error)
      }
    }

    if (session) {
      fetchSpaces()
    }
  }, [session])

  return spaces
}
