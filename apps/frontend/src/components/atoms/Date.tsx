import React, { useState } from "react"

import { addDays, startOfWeek, endOfWeek, format } from "date-fns"
import { ListFilter } from "lucide-react"

import { LeftChevron, RightChevron } from "@/src/lib/icons/Navigation"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"

const formatDate = (date: Date) => {
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" })
  const month = date.toLocaleDateString("en-US", { month: "short" })
  const day = date.getDate()

  return `${weekday}, ${month} ${day}`.toLowerCase()
}

interface DateCycleProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export const DateCycle: React.FC<DateCycleProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const { today, overdue } = useCycleItemStore()
  const { items: todayItems } = today
  const { items: overdueItems } = overdue

  const totalTodayItems = todayItems.length
  const totalOverdueItems = overdueItems.length

  const totalItems = totalTodayItems + totalOverdueItems

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() - 1)
    onDateChange(newDate)
  }

  const goToToday = () => {
    const today = new Date()
    const localToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    )
    onDateChange(localToday)
  }

  const goToNextDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 1)
    onDateChange(newDate)
  }

  const formatedDateTitle = format(selectedDate, "eee").toLowerCase()

  const isToday = selectedDate.toDateString() === new Date().toDateString()

  return (
    <div className="flex w-full flex-col gap-4 pl-5 text-sm">
      <div className="flex w-full items-center justify-between gap-5">
        <div className="flex items-center gap-2 text-secondary-foreground">
          <span className="text-sm">{formatDate(selectedDate)}</span>
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
        <p className="text-secondary-foreground">{totalItems}</p>
      </div>
    </div>
  )
}
