import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { CreateEventInput, Event } from "../lib/@types/Items/event"
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

export const useCreateEvent = (session: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["createEvent"],
    mutationFn: (eventData: CreateEventInput) =>
      createEvent(session, eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventsByDate"] })
    },
  })
}
