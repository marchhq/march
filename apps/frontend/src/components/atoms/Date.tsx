import React from "react"

import { format } from "date-fns"
import { ChevronLeft, ChevronRight, Undo2 } from "lucide-react"

import { Button } from "../ui/button"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"

interface DateCycleProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export const DateCycle: React.FC<DateCycleProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const { byDate, overdue } = useCycleItemStore()
  const { items: byDateItems } = byDate
  const { items: overdueItems } = overdue

  const totalByDateItems = byDateItems.length
  const totalOverdueItems = overdueItems.length

  const totalItems = totalByDateItems + totalOverdueItems

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() - 1)
    onDateChange(newDate)
  }

  const goToToday = () => {
    const today = new Date()
    onDateChange(today)
  }

  const goToNextDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 1)
    onDateChange(newDate)
  }

  const formatedDateHeader = format(selectedDate, "dd, MMMM yy").toLowerCase()
  const formatedDateTitle = format(selectedDate, "eeee").toLowerCase()

  const isToday =
    String(selectedDate.getDate()) === String(new Date().getDate())
  const isTomorrow =
    String(selectedDate.getDate()) === String(new Date().getDate() + 1)
  const isYesterday =
    String(selectedDate.getDate()) === String(new Date().getDate() - 1)

  const displayDateTitle = isToday
    ? "today"
    : isTomorrow
      ? "tomorrow"
      : isYesterday
        ? "yesterday"
        : formatedDateTitle

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div className="flex items-center justify-between text-secondary-foreground">
        <span>{formatedDateHeader}</span>
      </div>
      <div className="flex items-center gap-2">
        <h1 className="font-semibold text-foreground">{displayDateTitle}</h1>
        <div className="flex gap-1 text-secondary-foreground">
          <span title={`total items by ${selectedDate.toDateString()}`}>
            {totalByDateItems}
          </span>
          <span title="total items by date + overdue">[{totalItems}]</span>
        </div>
      </div>
      <div className="group relative">
        <div className="flex items-center gap-2 text-secondary-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="size-7 border border-border hover:border-primary-foreground hover:text-primary-foreground"
            onClick={goToPreviousDay}
          >
            <ChevronLeft className="size-4" />
            <span className="sr-only">Previous day</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 border border-border hover:border-primary-foreground hover:text-primary-foreground"
            onClick={goToNextDay}
          >
            <ChevronRight className="size-4" />
            <span className="sr-only">Next day</span>
          </Button>
          {!isToday && (
            <Button
              variant="ghost"
              size="icon"
              className="size-7 border border-border hover:border-primary-foreground hover:text-primary-foreground"
              onClick={goToToday}
            >
              <Undo2 className="size-4" />
              <span className="sr-only">Go to today</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
