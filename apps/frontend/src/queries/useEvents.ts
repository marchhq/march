import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { Event, EventFormData, EventPayload } from "../lib/@types/Items/event"
import { createEvent, getEventsByDate } from "../lib/server/actions/events"

export const useEvents = (session: string, date: string) => {
  return useQuery<Event[]>({
    queryKey: ["eventsByDate", session, date],
    queryFn: async () => {
      const res = await getEventsByDate(session!, date)
      return res.events
    },
    enabled: !!session,
  })
}

export const useEventMutation = (session: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["createEvent"],
    mutationFn: async (formData: EventFormData) => {
      const startDateTime = new Date(
        `${formData.date}T${formData["start-time"]}`
      )

      const endDateTime = new Date(`${formData.date}T${formData["end-time"]}`)

      const eventPayload: EventPayload = {
        summary: formData.title,
        description: formData.description || undefined,
        location: formData.location || undefined,
        start: {
          dateTime: startDateTime.toISOString(),
        },
        end: {
          dateTime: endDateTime.toISOString(),
        },
      }

      const response = await createEvent(session, eventPayload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventsByDate"] })
    },
  })
}
