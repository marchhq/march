import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import axios from "axios";
import { BACKEND_URL } from "../lib/constants/urls";
import { Meetings } from "../lib/@types/Items/calendar";

export const useMeetings = () => {
  const [meetings, setMeetings] = useState<Meetings | null>(null)
  const { session } = useAuth();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get<Meetings>(`${BACKEND_URL}/calendar/meetings/upcoming/`, {
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        setMeetings(response.data)
      } catch (error) {
        console.error("failed to fetch upcoming meetings: ", error)
      }
    }

    if (session) {
      fetchMeetings()
    }
  }, [session])

  return meetings
}
