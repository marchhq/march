import React from "react"

import { format } from "date-fns"

import { LeftChevron, RightChevron } from "@/src/lib/icons/Navigation"
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

  const formatedDateHeader = format(selectedDate, "eeee, MMMM dd").toLowerCase()
  const formatedDateTitle = format(selectedDate, "eee").toLowerCase()

  const isToday =
    String(selectedDate.getDate()) === String(new Date().getDate())

  return (
    <div className="flex flex-1 flex-col gap-4 pl-5 text-sm">
      <div className="flex w-full items-center justify-between gap-5">
        <div className="flex items-center gap-2 text-secondary-foreground">
          <span className="text-sm">{formatedDateHeader}</span>
        </div>
        <div className="flex items-center gap-2 text-secondary-foreground">
          <button onClick={goToPreviousDay} className="px-1">
            <LeftChevron className="hover-text" />
          </button>
          <button onClick={goToToday}>
            <span className="hover-text">today</span>
          </button>
          <button onClick={goToNextDay} className="px-1">
            <RightChevron className="hover-text" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <h1 className="font-semibold text-foreground">
          {isToday ? "today" : formatedDateTitle}
        </h1>
        <div className="flex gap-1 text-secondary-foreground">
          <span title={`total items by ${selectedDate}`}>
            {totalByDateItems}
          </span>
          <span title="total items by date + overdue">[{totalItems}]</span>
        </div>
      </div>
    </div>
  )
}
