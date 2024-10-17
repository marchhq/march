import {
  differenceInWeeks,
  endOfWeek,
  format,
  formatDistanceToNow,
  startOfMonth,
  startOfWeek,
  getWeeksInMonth,
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

export { getWeeksInMonth }

export function getTodayISODate(date: Date): string {
  const today = date
  today.setUTCHours(0, 0, 0, 0)
  const year = today.getUTCFullYear()
  const month = String(today.getUTCMonth() + 1).padStart(2, "0")
  const day = String(today.getUTCDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}
