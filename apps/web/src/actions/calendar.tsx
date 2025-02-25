"use server";

import { apiClient } from "@/lib/api";
import { EventResponse } from "@/types/calendar";

export async function getEventsByDate(date: string) {
  const response = await apiClient.get<EventResponse>(
    `/calendar/events/${date}/`
  );

  if (!response) {
    throw new Error("Failed to fetch events");
  }

  return response.events;
}
