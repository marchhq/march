"use client"

import React, { useState, useEffect, useCallback } from "react"

import { ItemList } from "@/src/components/atoms/ItemList"
import { RescheduleCalendar } from "@/src/components/Inbox/RescheduleCalendar/RescheduleCalendar"
import { useAuth } from "@/src/contexts/AuthContext"
import { useWebSocket } from "@/src/contexts/WebsocketProvider"
import { useTimezone } from "@/src/hooks/useTimezone"
import { CycleItem } from "@/src/lib/@types/Items/Cycle"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"
import { getUserDate, getWeekDates } from "@/src/utils/datetime"

type ThisWeekItemsProps = {
  startDate: string
  endDate: string
}

export const ThisWeekItems: React.FC<ThisWeekItemsProps> = ({
  startDate,
  endDate,
}) => {
  const { messages } = useWebSocket()
  const timezone = useTimezone()
  const [dateChanged, setDateChanged] = useState(false)
  const [reschedulingItemId, setReschedulingItemId] = useState<string | null>(
    null
  )
  const [reschedulingItemStatus, setReschedulingItemStatus] = useState<
    string | null
  >(null)

  const [date, setDate] = useState<Date | null>(new Date())
  const [cycleDate, setCycleDate] = useState<Date | null>(new Date())

  const {
    thisWeek,
    setCurrentItem,
    updateItem,
    setWeekDates,
    fetchThisWeek,
    updateStateWithNewItem,
    removeItemFromState,
  } = useCycleItemStore()
  const { items } = thisWeek

  const { session } = useAuth()

  useEffect(() => {
    setWeekDates(startDate, endDate)
  }, [startDate, endDate, setWeekDates])

  useEffect(() => {
    fetchThisWeek(session, startDate, endDate)
  }, [session, fetchThisWeek, startDate, endDate])

  useEffect(() => {}, [items])

  const handleExpand = (item: CycleItem) => {
    setCurrentItem(item)
  }

  useEffect(() => {
    if (timezone) {
      setDate(getUserDate(timezone))
      setCycleDate(getUserDate(timezone))
    }
  }, [timezone])

  useEffect(() => {
    if (messages?.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage?.type === "linear" && lastMessage?.item) {
        const { item, action } = lastMessage

        if (action === "delete") {
          removeItemFromState(item)
        } else {
          updateStateWithNewItem({
            ...item,
            id: item.id,
            title: item.title,
            description: item.description,
            status: item.status,
            cycle: item.cycle,
          })
        }
      }
    }
  }, [messages, updateStateWithNewItem, removeItemFromState])

  const handleDone = useCallback(
    (
      event: React.MouseEvent,
      id: string,
      currentStatus: string | undefined
    ) => {
      event.stopPropagation()
      if (id) {
        const newStatus = currentStatus === "done" ? "null" : "done"
        const today = getUserDate(timezone)
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
    [updateItem, session, timezone]
  )

  const handleRescheduleCalendar = (
    e: React.MouseEvent,
    id: string,
    dueDate: Date | string | null
  ) => {
    e.stopPropagation()

    let newDate: Date | null = null

    if (dueDate) {
      if (typeof dueDate === "string") {
        newDate = new Date(dueDate)
      } else {
        newDate = dueDate
      }
    }

    if (newDate && timezone) {
      newDate = getUserDate(timezone)
    }

    setReschedulingItemId(id)
    setDate(newDate)
  }

  useEffect(() => {
    if (dateChanged) {
      if (reschedulingItemId) {
        if (cycleDate !== null) {
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
        } else {
          updateItem(
            session,
            {
              status: date ? "todo" : "null",
              dueDate: date,
              cycle: {
                startsAt: null,
                endsAt: null,
              }, // explicitly set cycle to null
            },
            reschedulingItemId
          )
        }
      }
      setReschedulingItemId(null)
      setDateChanged(false)
    }
  }, [date, cycleDate, updateItem, session, reschedulingItemId, dateChanged])

  return (
    <div>
      <div className="flex flex-col gap-2.5 pb-10 text-sm">
        <ItemList
          items={items}
          handleExpand={handleExpand}
          handleDone={handleDone}
          handleRescheduleCalendar={handleRescheduleCalendar}
          doneLine={true}
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
