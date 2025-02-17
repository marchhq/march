import { CalendarEvent } from "../lib/@types/Items/event"

// Function to transform Google Calendar events to your format
export const transformEvents = (googleEvents: any[]): CalendarEvent[] => {
  return googleEvents.map((event) => ({
    id: event.id,
    title: event.summary,
    date: new Date(event.start.dateTime),
    start: {
      dateTime: new Date(event.start.dateTime),
      timeZone: event.start.timeZone,
    },
    end: {
      dateTime: new Date(event.end.dateTime),
      timeZone: event.end.timeZone,
    },
    type: "default",
    description: event.hangoutLink ? `${event.hangoutLink}` : undefined,
  }))
}
