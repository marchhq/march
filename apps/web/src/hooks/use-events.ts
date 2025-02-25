import { getEventsByDate } from "@/actions/calendar"
import { transformGoogleEventToCalendarEvent } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"



export const useEvents = (date: string) => {
  return useQuery({
    queryKey: ["events", date],
    queryFn: () => getEventsByDate(date),
    select: (data) => data.map(transformGoogleEventToCalendarEvent),
  })
}