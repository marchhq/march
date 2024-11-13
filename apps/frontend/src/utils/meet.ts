import { startOfWeek, endOfWeek, isWithinInterval, format } from "date-fns"

import { Meet } from "../lib/@types/Items/Meet"

export function getCurrentWeekMeets(meets: Meet[] = []): Meet[] {
  const weekStart = startOfWeek(new Date())
  const weekEnd = endOfWeek(new Date())

  return meets.filter((meet) =>
    isWithinInterval(new Date(meet.metadata.start.dateTime), {
      start: weekStart,
      end: weekEnd,
    })
  )
}

export function formatMeetDate(date: string): string {
  return format(new Date(date), "EEE, MMM dd")
}

export const formatMeetTime = (startTime: Date, endTime: Date): string => {
  const formatOptionsWithPeriod: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }

  const start = startTime
    .toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    .replace(/ AM| PM/, "")
  const end = endTime.toLocaleTimeString([], formatOptionsWithPeriod)

  return `${start} - ${end}`
}

export const calculateMeetDuration = (start: Date, end: Date): number => {
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60))
}

export const getMeetingLink = (event) => {
  if (!event) return null

  // Prioritized link sources
  const sources = [
    // 1. Video conference link from entryPoints
    () =>
      event.conferenceData?.entryPoints?.find(
        (entry) => entry.entryPointType === "video"
      )?.uri,

    // 2. First available entryPoint
    () => event.conferenceData?.entryPoints?.[0]?.uri,

    // 3. Location field
    () => event.location,

    // 4. Hangout link
    () => event.hangoutLink,
  ]

  // Return the first available link
  return sources.reduce((link, getLink) => link || getLink(), null)
}
