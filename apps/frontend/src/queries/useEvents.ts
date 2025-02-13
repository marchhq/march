import { useQuery } from "@tanstack/react-query"

import { Event } from "../lib/@types/Items/event"
import { getEventsByDate } from "../lib/server/actions/events"

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
