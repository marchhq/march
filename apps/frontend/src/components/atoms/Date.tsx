import React, { useState } from "react"

import { ListFilter } from "lucide-react"

import { LeftChevron, RightChevron } from "@/src/lib/icons/Navigation"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"

const formatDate = (date: Date) => {
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" })
  const month = date.toLocaleDateString("en-US", { month: "short" })
  const day = date.getDate()

  return `${weekday}, ${month} ${day}` // Desired format
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

  const goToNextDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 1)
    onDateChange(newDate)
  }

  const isToday = selectedDate.toDateString() === new Date().toDateString()

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex w-48 items-center gap-2 text-secondary-foreground">
          <ListFilter size={16} />
          <p className="text-sm">{formatDate(selectedDate)}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={goToPreviousDay} className="p-2">
            <LeftChevron />
          </button>
          <button onClick={goToNextDay} className="p-2">
            <RightChevron />
          </button>
        </div>
      </div>
      {isToday && (
        <div className="flex items-center gap-2 text-sm">
          <h1 className="font-semibold text-foreground">Today</h1>
          <p className="text-secondary-foreground">{totalItems}</p>
        </div>
      )}
    </div>
  )
}
