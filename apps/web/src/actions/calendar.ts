"use server";

import { apiClient } from "@/lib/api";
import { CreateEventResponse, Event, EventResponse } from "@/types/calendar";

export async function getEventsByDate(date: string) {
  const response = await apiClient.get<EventResponse>(
    `/calendar/events/${date}/`
  );

  if (!response) {
    throw new Error("Failed to fetch events");
  }

  return response.events;
}

export async function createEvent(event: Partial<Event>) {
  const response = await apiClient.post<CreateEventResponse, Partial<Event>>(
    "/calendar/events",
    event
  );
  return response.newEvent;
}

export async function deleteEvent(eventId: string) {
  await apiClient.delete(`/calendar/events/${eventId}/`);
}
