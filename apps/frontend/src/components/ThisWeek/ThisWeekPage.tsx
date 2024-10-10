"use client"

import React, { useEffect, useState } from "react"
import { ThisWeekArrows } from "./ThisWeekArrows"
import { ThisWeekSection } from "./ThisWeekSection"
import { addWeeks } from "date-fns"
import {
  getCurrentWeek,
  getFormattedDateRange,
  getWeeksInMonth,
} from "@/src/utils/datetime"
import { useAuth } from "@/src/contexts/AuthContext"
import useItemsStore, { ItemStoreType } from "@/src/lib/store/items.store"
import { Item } from "@/src/lib/@types/Items/Items"

export const ThisWeekPage: React.FC = () => {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(today)
  const weekNumber = getCurrentWeek(currentDate)
  const totalWeeks = getWeeksInMonth(currentDate)
  const formattedDateRange = getFormattedDateRange(currentDate)

  const { session } = useAuth()
  const fetchItems = useItemsStore((state: ItemStoreType) => state.fetchItems)
  const items = useItemsStore((state: ItemStoreType) => state.items)

  useEffect(() => {
    const filter = "this-week"
    fetchItems(session, filter)
  }, [fetchItems])

  const todo = items.filter((item: Item) => item.status === "todo")
  const inProgress = items.filter((item: Item) => item.status === "in progress")
  const done = items.filter((item: Item) => item.status === "done")

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
    <div className="w-9/12 flex flex-col gap-8">
      <div className="flex items-center gap-8 text-sm">
        <h1 className="text-foreground text-2xl">Week {weekNumber}</h1>
        <div className="flex gap-4">
          <p>
            {done.length}/{items.length} completed
          </p>
          <p>{((done.length / items.length) * 100).toFixed(0)}%</p>
          <p>{formattedDateRange}</p>
        </div>
        <ThisWeekArrows onChangeWeek={handleWeekChange} />
      </div>
      <div className="flex w-full max-w-screen-xl gap-8">
        <ThisWeekSection
          icon="material-symbols:circle-outline"
          title="to do"
          items={todo}
        />
        <ThisWeekSection
          icon="carbon:circle-dash"
          title="in progress"
          items={inProgress}
        />
        <ThisWeekSection
          icon="material-symbols:circle"
          title="done"
          items={done}
        />
      </div>
    </div>
  )
}
