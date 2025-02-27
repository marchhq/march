import { CalendarEvent, Event } from "@/types/calendar";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const extractMessageData = (response: any) => {
  if (response?.data?.data) {
    return response.data.data;
  }
  return null;
};

export function transformGoogleEventToCalendarEvent(event: Event): CalendarEvent {
  return {
    id: event.id,
    title: event.summary,
    start: event.start.dateTime,
    end: event.end.dateTime,
    backgroundColor: "#E3F2FD", // You can customize these colors
    textColor: "#0D47A1",      // based on your needs
    borderColor: "#E3F2FD",
    allDay: !event.start.dateTime, // If dateTime is missing, it's an all-day event
  }
}