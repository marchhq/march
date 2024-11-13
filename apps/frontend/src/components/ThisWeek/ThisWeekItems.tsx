"use client"

import React, { useState, useEffect, useCallback } from "react"

import { ItemList } from "@/src/components/atoms/ItemList"
import { RescheduleCalendar } from "@/src/components/Inbox/RescheduleCalendar/RescheduleCalendar"
import { useAuth } from "@/src/contexts/AuthContext"
import { CycleItem } from "@/src/lib/@types/Items/Cycle"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"
import { getWeekDates } from "@/src/utils/datetime"

type ThisWeekItemsProps = {
  startDate: string
  endDate: string
}

export const ThisWeekItems: React.FC<ThisWeekItemsProps> = ({
  startDate,
  endDate,
}) => {
  const [dateChanged, setDateChanged] = useState(false)
  const [reschedulingItemId, setReschedulingItemId] = useState<string | null>(
    null
  )
  const [reschedulingItemStatus, setReschedulingItemStatus] = useState<
    string | null
  >(null)

  const [date, setDate] = useState<Date | null>(new Date())
  const [cycleDate, setCycleDate] = useState<Date | null>(new Date())

  const { thisWeek, setCurrentItem, updateItem, setWeekDates, fetchThisWeek } =
    useCycleItemStore()
  const { items } = thisWeek

  const { session } = useAuth()

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
    dueDate: Date | null,
    currentStatus?: string
  ) => {
    e.stopPropagation()

    const newDate = dueDate
      ? typeof dueDate === "string"
        ? new Date(dueDate)
        : dueDate
      : null

    setReschedulingItemId(id)
    if (currentStatus) {
      setReschedulingItemStatus(currentStatus)
    }
    setDate(newDate) // Ensure this is a Date or null
  }

  useEffect(() => {
    if (dateChanged) {
      if (reschedulingItemId) {
        if (date) {
          updateItem(
            session,
            { status: reschedulingItemStatus || "null", dueDate: date },
            reschedulingItemId
          )
        }
        if (cycleDate) {
          const { startDate, endDate } = getWeekDates(cycleDate)
          updateItem(
            session,
            {
              status: reschedulingItemStatus || "null",
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
  }, [
    date,
    cycleDate,
    updateItem,
    session,
    reschedulingItemId,
    reschedulingItemStatus,
    dateChanged,
  ])

  useEffect(() => {
    setWeekDates(startDate, endDate)
  }, [startDate, endDate, setWeekDates])

  useEffect(() => {
    fetchThisWeek(session, startDate, endDate)
  }, [session, fetchThisWeek, startDate, endDate])

  useEffect(() => {}, [items])

  return (
    <div>
      <div className="flex flex-col gap-2.5 text-sm">
        <ItemList
          items={items}
          handleExpand={handleExpand}
          handleInProgress={handleInProgress}
          handleDone={handleDone}
          handleRescheduleCalendar={handleRescheduleCalendar}
          doneLine={true}
          inProgressAction={true}
        />
      </div>
      {reschedulingItemId !== null && (
        <div>
          <div
            className="fixed inset-0 z-50 cursor-default bg-black/80"
            role="button"
            onClick={() => {
              setReschedulingItemId(null)
              setReschedulingItemStatus(null)
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape" || e.key === "Esc") {
                setReschedulingItemId(null)
                setReschedulingItemStatus(null)
              }
            }}
            tabIndex={0}
          ></div>
          <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 shadow-lg">
            <RescheduleCalendar
              date={date}
              setDate={setDate}
              cycleDate={cycleDate}
              setCycleDate={setCycleDate}
              dateChanged={dateChanged}
              setDateChanged={setDateChanged}
            />
          </div>
        </div>
      )}{" "}
    </div>
  )
}
