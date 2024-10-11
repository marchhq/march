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
