import { useEffect, useState } from "react"

import axios from "axios"

import { useAuth } from "../contexts/AuthContext"
import { Meetings } from "../lib/@types/Items/calendar"
import { BACKEND_URL } from "../lib/constants/urls"
import useUserStore from "../lib/store/user.store"

export const useMeetings = () => {
  const [meetings, setMeetings] = useState<Meetings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user, fetchUser } = useUserStore()
  const { session } = useAuth()

  const fetchMeetings = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get<Meetings>(
        `${BACKEND_URL}/calendar/meetings/upcoming/`,
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )
      setMeetings(response.data)
    } catch (error) {
      console.error("failed to fetch upcoming meetings: ", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!session) return

    const initializeData = async () => {
      await fetchUser(session)

      if (user?.integrations?.googleCalendar?.connected === true) {
        await fetchMeetings()
      } else {
        setIsLoading(false)
      }
    }

    initializeData()
  }, [session, user?.integrations?.googleCalendar?.connected, fetchUser])

  return { meetings, isLoading }
}
