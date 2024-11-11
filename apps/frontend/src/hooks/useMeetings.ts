import { useEffect, useState } from "react"

import axios from "axios"

import { useAuth } from "../contexts/AuthContext"
import { Event, Events } from "../lib/@types/Items/event"
import { BACKEND_URL } from "../lib/constants/urls"
import useUserStore from "../lib/store/user.store"

export const useMeetings = (selectedDate: string) => {
  const [meetings, setMeetings] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, fetchUser } = useUserStore()
  const { session } = useAuth()

  const fetchMeetings = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get<Events>(
        `${BACKEND_URL}/calendar/events/${selectedDate}/`,
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )
      setMeetings(response.data.events)
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
  }, [
    session,
    user?.integrations?.googleCalendar?.connected,
    fetchUser,
    selectedDate,
  ])

  return { meetings, isLoading }
}
