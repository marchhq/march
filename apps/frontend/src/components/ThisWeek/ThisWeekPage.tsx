"use client"

import React, { useState } from "react"

import { addWeeks } from "date-fns"

import { CustomKanban } from "./CustomKanban"
import { ThisWeekArrows } from "./ThisWeekArrows"
import { ThisWeekExpandedItem } from "@/src/components/ThisWeek/ThisWeekExpandedItem"
import { CycleItem } from "@/src/lib/@types/Items/Cycle"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"
import {
  getCurrentWeek,
  getFormattedDateRange,
  getWeeksInMonth,
} from "@/src/utils/datetime"

export const ThisWeekPage: React.FC = () => {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(today)
  const weekNumber = getCurrentWeek(currentDate)
  const totalWeeks = getWeeksInMonth(currentDate)
  const formattedDateRange = getFormattedDateRange(currentDate)

  const { items, currentItem } = useCycleItemStore()

  const doneItems = items.filter((item: CycleItem) => item.status === "done")

  const handleWeekChange = (direction: "left" | "right") => {
    setCurrentDate((prevDate) => {
      const newDate = addWeeks(prevDate, direction === "left" ? -1 : 1)
      const newWeekNumber = getCurrentWeek(newDate)
      return newWeekNumber >= 1 && newWeekNumber <= totalWeeks
        ? newDate
        : prevDate
    })
  }

  return (
    <div className="ml-[160px] flex h-full w-[calc(100%-160px)] p-16">
      <div className="relative flex flex-auto flex-col gap-12">
        <div className="flex items-center gap-8 text-sm">
          <h1 className="text-2xl text-foreground">Week {weekNumber}</h1>
          <div className="flex gap-4">
            <p>
              {doneItems.length}/{items.length} completed
            </p>
            <p>
              {items.length > 0
                ? ((doneItems.length / items.length) * 100).toFixed(0)
                : 0}
              %
            </p>
            <p>{formattedDateRange}</p>
          </div>
          <ThisWeekArrows onChangeWeek={handleWeekChange} />
        </div>
        <CustomKanban />
        {currentItem && <ThisWeekExpandedItem />}
      </div>
    </div>
  )
}
