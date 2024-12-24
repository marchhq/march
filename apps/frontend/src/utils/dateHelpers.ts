import { getUserDate } from "./datetime"

export const formatRescheduleDate = (
  dueDate: Date | string | null,
  timezone: string | null
): Date | null => {
  let newDate: Date | null = null

  if (dueDate) {
    if (typeof dueDate === "string") {
      newDate = new Date(dueDate)
    } else {
      newDate = dueDate
    }
  }

  if (newDate && timezone) {
    newDate = getUserDate(timezone)
  }

  return newDate
}
