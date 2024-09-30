import { useEffect, useState } from "react"
import { Journal } from "../lib/@types/Items/Journal"
import { useAuth } from "../contexts/AuthContext"
import axios from "axios"
import { BACKEND_URL } from "../lib/constants/urls"

export const useJournal = () => {
  const [journal, setJournal] = useState<Journal | null>(null)

  const { session } = useAuth();

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const response = await axios.get<Journal>(`${BACKEND_URL}/api/journals/today/`, {
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        setJournal(response.data)
      } catch (error) {
        console.error('failed to fetch todays journal: ', error)
      }
    }

    if (session) {
      fetchJournal()
    }
  }, [session])

  return journal;
}
