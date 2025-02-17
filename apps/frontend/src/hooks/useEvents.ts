import { useCallback, useEffect, useState } from "react"

import axios from "axios"

import { useAuth } from "../contexts/AuthContext"

interface Event {
  id: string
  title: string
  start: string
  end?: string
  type?: "task" | "meeting" | "personal"
  allDay?: boolean
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const { session } = useAuth()

  const fetchEvents = useCallback(async () => {
    if (!session) return
    try {
      const response = await axios.get("/api/calendar/events", {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      })
      setEvents(
        response.data.events.map((event: any) => ({
          ...event,
          type: event.type || determineEventType(event.title),
        }))
      )
    } catch (error) {
      console.error("Failed to fetch events:", error)
    }
  }, [session])

  const addEvent = useCallback(
    async (event: Omit<Event, "id">) => {
      if (!session) return
      try {
        const response = await axios.post("/api/calendar/events", event, {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        })
        setEvents((prev) => [...prev, response.data])
        return response.data
      } catch (error) {
        console.error("Failed to add event:", error)
      }
    },
    [session]
  )

  const updateEvent = useCallback(
    async (event: Event) => {
      if (!session) return
      try {
        await axios.put(`/api/calendar/events/${event.id}`, event, {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        })
        setEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)))
      } catch (error) {
        console.error("Failed to update event:", error)
      }
    },
    [session]
  )

  const deleteEvent = useCallback(
    async (eventId: string) => {
      if (!session) return
      try {
        await axios.delete(`/api/calendar/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        })
        setEvents((prev) => prev.filter((e) => e.id !== eventId))
      } catch (error) {
        console.error("Failed to delete event:", error)
      }
    },
    [session]
  )

  // Determine event type based on title keywords
  const determineEventType = (
    title: string
  ): "task" | "meeting" | "personal" => {
    const lowerTitle = title.toLowerCase()
    if (
      lowerTitle.includes("meet") ||
      lowerTitle.includes("call") ||
      lowerTitle.includes("sync")
    ) {
      return "meeting"
    }
    if (
      lowerTitle.includes("task") ||
      lowerTitle.includes("todo") ||
      lowerTitle.includes("review")
    ) {
      return "task"
    }
    return "personal"
  }

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
  }
}
