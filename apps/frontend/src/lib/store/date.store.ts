import { addDays } from "date-fns"
import { create } from "zustand"

interface DateState {
  currentDate: Date
  dateString: string
  setDate: (date: Date) => void
  nextDay: () => void
  previousDay: () => void
}

export const useDateStore = create<DateState>((set) => ({
  currentDate: new Date(),
  dateString: new Date().toISOString().split("T")[0],
  setDate: (date: Date) =>
    set(() => ({
      currentDate: date,
      dateString: date.toISOString().split("T")[0],
    })),
  nextDay: () =>
    set((state) => {
      const newDate = addDays(state.currentDate, 1)
      return {
        currentDate: newDate,
        dateString: newDate.toISOString().split("T")[0],
      }
    }),
  previousDay: () =>
    set((state) => {
      const newDate = addDays(state.currentDate, -1)
      return {
        currentDate: newDate,
        dateString: newDate.toISOString().split("T")[0],
      }
    }),
}))
