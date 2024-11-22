import {
  differenceInWeeks,
  endOfWeek,
  format,
  formatDistanceToNow,
  startOfMonth,
  startOfWeek,
  getWeeksInMonth,
  differenceInDays,
} from "date-fns"

export const getOrdinalSuffix = (day) => {
  if (day > 3 && day < 21) return "th"
  switch (day % 10) {
    case 1:
      return "st"
    case 2:
      return "nd"
    case 3:
      return "rd"
    default:
      return "th"
  }
}

export const getDayPhase = (): string => {
  const hour = parseInt(format(new Date(), "HH"))
  if (hour > 4 && hour < 12) {
    return "Morning"
  } else if (hour > 12 && hour < 16) {
    return "Afternoon"
  } else if (hour > 16 && hour < 20) {
    return "Evening"
  } else if (hour > 20 && hour < 23) {
    return "Night"
  } else {
    return "Late Night"
  }
}

export const getMonthName = (date: Date | string): string => {
  return format(date, "MMMM")
}

export const formatDate = (date: Date | string): string => {
  return format(date, "dd:MMMM")
}

export const formatDateYear = (date: Date | string): string => {
  return format(date, "dd/MM/yy")
}

export const fromNow = (date: Date | string): string => {
  return formatDistanceToNow(date, {
    addSuffix: true,
  })
}

export function getCurrentWeek(date: Date): number {
  const startOfCurrentMonth = startOfMonth(date)
  const weekDiff = differenceInWeeks(date, startOfCurrentMonth)
  return weekDiff + 1
}

export function getFormattedDateRange(date: Date): string {
  const startOfCurrentWeek = startOfWeek(date, { weekStartsOn: 0 })
  const endOfCurrentWeek = endOfWeek(date, { weekStartsOn: 0 })
  return `${format(startOfCurrentWeek, "MMM d")} - ${format(endOfCurrentWeek, "MMM d")}`
}

export function getEndOfCurrentWeek(date: Date): string {
  const startDate = startOfWeek(date, { weekStartsOn: 0 })
  return startDate.toISOString()
}

export { getWeeksInMonth }

export function getTodayISODate(date: Date): string {
  const today = date
  today.setUTCHours(0, 0, 0, 0)
  const year = today.getUTCFullYear()
  const month = String(today.getUTCMonth() + 1).padStart(2, "0")
  const day = String(today.getUTCDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export const getOverdueText = (dueDate: Date | null): string => {
  if (!dueDate) {
    return "" // or some default text like "No due date"
  }

  const now = new Date()
  const diffInDays = differenceInDays(now, dueDate)

  return `since ${diffInDays} ${diffInDays === 1 ? "day" : "days"}`
}

export const getWeekDates = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 0 })
  const end = endOfWeek(date, { weekStartsOn: 0 })
  return {
    startDate: format(start, "yyyy-MM-dd"),
    endDate: format(end, "yyyy-MM-dd"),
  }
}

export const toUtcDate = (date: Date): Date => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
}

export const formatMeetDate = (date: Date) => {
  return format(date, "dd, MMMM yy").toLowerCase()
}

export const formatMeetTime = (date: Date): string => {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

export const formatDateHeader = (date: string) => {
  return format(date, "dd, MMMM yy").toLowerCase()
}

export const getUserDate = (timezone: string | null): Date => {
  if (!timezone) {
    return new Date()
  }

  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }

  try {
    const formatter = new Intl.DateTimeFormat("en-US", options)
    const parts = formatter.formatToParts(new Date())

    const dateObj: { [key: string]: string } = {}
    parts.forEach(({ type, value }) => {
      dateObj[type] = value
    })

    const localDateString = `${dateObj.year}-${dateObj.month}-${dateObj.day}T${dateObj.hour}:${dateObj.minute}:${dateObj.second}`
    return new Date(localDateString)
  } catch (error) {
    console.error("Error formatting date with timezone:", error)
    return new Date()
  }
}
