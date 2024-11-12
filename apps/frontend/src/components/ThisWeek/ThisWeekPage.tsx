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
  getWeekDates,
  getWeeksInMonth,
} from "@/src/utils/datetime"

export const ThisWeekPage: React.FC = () => {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(today)
  const weekNumber = getCurrentWeek(currentDate)
  const totalWeeks = getWeeksInMonth(currentDate)
  const formattedDateRange = getFormattedDateRange(currentDate).toLowerCase()

  const { items, currentItem } = useCycleItemStore()

  const doneItems = items.filter((item: CycleItem) => item.status === "done")
  const inProgressItems = items.filter(
    (item: CycleItem) => item.status === "in progress"
  )

  const handleWeekChange = (direction: "left" | "right" | "this") => {
    setCurrentDate((prevDate) => {
      if (direction === "this") {
        const currentDate = new Date()
        const currentWeekNumber = getCurrentWeek(currentDate)
        return currentWeekNumber >= 1 && currentWeekNumber <= totalWeeks
          ? currentDate
          : prevDate
      }

      const newDate = addWeeks(prevDate, direction === "left" ? -1 : 1)
      const newWeekNumber = getCurrentWeek(newDate)
      return newWeekNumber >= 1 && newWeekNumber <= totalWeeks
        ? newDate
        : prevDate
    })
  }

  const { startDate, endDate } = getWeekDates(currentDate)

  return (
    <div className="flex h-full w-[calc(100%-160px)]">
      <div className="relative flex flex-auto flex-col gap-12">
        <header>
          <div className="flex flex-1 flex-col gap-4 pl-5 text-sm text-foreground">
            <div className="flex w-full items-center justify-between gap-5">
              <div className="flex items-center gap-2 text-secondary-foreground">
                <span className="text-secondary-foreground">
                  {doneItems.length} / {inProgressItems.length} / {items.length}{" "}
                  completed
                </span>
                <span>
                  {items.length > 0
                    ? ((doneItems.length / items.length) * 100).toFixed(0)
                    : 0}
                  %
                </span>
                <span>{formattedDateRange}</span>
              </div>
              <ThisWeekArrows onChangeWeek={handleWeekChange} />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold">week {weekNumber}</h1>
              <span className="text-secondary-foreground">
                {doneItems.length}/{items.length}
              </span>
            </div>
          </div>
        </header>
        <CustomKanban startDate={startDate} endDate={endDate} />
        {currentItem && <ThisWeekExpandedItem />}
      </div>
    </div>
  )
}
