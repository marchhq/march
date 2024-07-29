import { format, formatDistanceToNow } from "date-fns"

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
  return format(date, "dd MMMM yy")
}

export const fromNow = (date: Date | string): string => {
  return formatDistanceToNow(date, {
    addSuffix: true,
  })
}
