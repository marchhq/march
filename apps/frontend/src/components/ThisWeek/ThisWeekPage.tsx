"use client"

import React, { useState, useEffect, useCallback } from "react"

import { addWeeks } from "date-fns"

import { ThisWeekArrows } from "./ThisWeekArrows"
import { ItemList } from "@/src/components/atoms/ItemList"
import { RescheduleCalendar } from "@/src/components/Inbox/RescheduleCalendar/RescheduleCalendar"
import { ThisWeekExpandedItem } from "@/src/components/ThisWeek/ThisWeekExpandedItem"
import { ThisWeekItems } from "@/src/components/ThisWeek/ThisWeekItems"
import { useAuth } from "@/src/contexts/AuthContext"
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
  const [dateChanged, setDateChanged] = useState(false)
  const [reschedulingItemId, setReschedulingItemId] = useState<string | null>(
    null
  )
  const [date, setDate] = useState<Date | null>(new Date())
  const [cycleDate, setCycleDate] = useState<Date | null>(new Date())

  const weekNumber = getCurrentWeek(currentDate)
  const totalWeeks = getWeeksInMonth(currentDate)
  const formattedDateRange = getFormattedDateRange(currentDate).toLowerCase()

  const { thisWeek, setCurrentItem, updateItem, setWeekDates, fetchThisWeek } =
    useCycleItemStore()
  const { items } = thisWeek

  const { session } = useAuth()

  const nullItems = items.filter((item: CycleItem) => item.status === "null")
  const todoItems = items.filter((item: CycleItem) => item.status === "todo")
  const todoAndNullItemsLength = nullItems.length + todoItems.length
  const inProgressItems = items.filter(
    (item: CycleItem) => item.status === "in progress"
  )
  const doneItems = items.filter((item: CycleItem) => item.status === "done")

  const handleExpand = (item: CycleItem) => {
    setCurrentItem(item)
  }

  const handleDone = useCallback(
    (
      event: React.MouseEvent,
      id: string,
      currentStatus: string | undefined
    ) => {
      event.stopPropagation()
      if (id) {
        const newStatus = currentStatus === "done" ? "null" : "done"
        const today = new Date()
        const { startDate, endDate } = getWeekDates(today)
        updateItem(
          session,
          {
            status: newStatus,
            dueDate: today,
            cycle: {
              startsAt: startDate,
              endsAt: endDate,
            },
          },
          id
        )
      }
    },
    [updateItem, session]
  )

  const handleInProgress = useCallback(
    (
      event: React.MouseEvent,
      id: string,
      currentStatus: string | undefined
    ) => {
      event.stopPropagation()
      if (id) {
        const newStatus =
          currentStatus === "in progress" ? "todo" : "in progress"
        updateItem(
          session,
          {
            status: newStatus,
          },
          id
        )
      }
    },
    [updateItem, session]
  )

  const handleRescheduleCalendar = (
    e: React.MouseEvent,
    id: string,
    dueDate: Date | null
  ) => {
    e.stopPropagation()

    const newDate = dueDate
      ? typeof dueDate === "string"
        ? new Date(dueDate)
        : dueDate
      : null

    setReschedulingItemId(id)
    setDate(newDate) // Ensure this is a Date or null
  }

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

  useEffect(() => {
    if (dateChanged) {
      if (reschedulingItemId) {
        if (date) {
          updateItem(
            session,
            { status: "todo", dueDate: date },
            reschedulingItemId
          )
        }
        if (cycleDate) {
          const { startDate, endDate } = getWeekDates(cycleDate)
          updateItem(
            session,
            {
              status: "todo",
              dueDate: date,
              cycle: {
                startsAt: startDate,
                endsAt: endDate,
              },
            },
            reschedulingItemId
          )
        }
      }
      setReschedulingItemId(null)
      setDateChanged(false)
    }
  }, [date, cycleDate, updateItem, session, reschedulingItemId, dateChanged])

  const { startDate, endDate } = getWeekDates(currentDate)

  useEffect(() => {
    setWeekDates(startDate, endDate)
  }, [startDate, endDate, setWeekDates])

  useEffect(() => {
    fetchThisWeek(session, startDate, endDate)
  }, [session, fetchThisWeek, startDate, endDate])

  useEffect(() => {}, [items])

  return (
    <div className="flex h-full w-[calc(100%-160px)]">
      <div className="relative flex flex-auto flex-col gap-12">
        <header>
          <div className="flex flex-1 flex-col gap-4 pl-5 text-sm text-foreground">
            <div className="flex w-full items-center justify-between gap-5">
              <div className="flex items-center gap-2 text-secondary-foreground">
                <span className="text-secondary-foreground">
                  {todoAndNullItemsLength} todo / {inProgressItems.length} in
                  progress / {doneItems.length} done / {items.length} total
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
        <ThisWeekItems startDate={startDate} endDate={endDate} />
        <ThisWeekExpandedItem />
      </div>
    </div>
  )
}
