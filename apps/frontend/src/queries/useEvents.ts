import { useMutation, useQuery } from "@tanstack/react-query"

import { queryClient } from "../app/(app)/providers"
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
  return useMutation({
    mutationKey: ["createEvent"],
    mutationFn: (eventData: CreateEventInput) =>
      createEvent(session, eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventsByDate"] })
    },
  })
}
