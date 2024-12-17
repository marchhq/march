"use client"

import React, { useState, useEffect, useCallback } from "react"

import { format } from "date-fns"

import { TodayExpandedAgenda } from "./TodayExpandedAgenda"
import { ItemExpandModal } from "@/src/components/atoms/ItemExpandModal"
import { ItemList } from "@/src/components/atoms/ItemList"
import { RescheduleCalendar } from "@/src/components/Inbox/RescheduleCalendar/RescheduleCalendar"
import { useAuth } from "@/src/contexts/AuthContext"
import { useWebSocket } from "@/src/contexts/WebsocketProvider"
import { useTimezone } from "@/src/hooks/useTimezone"
import { CycleItem } from "@/src/lib/@types/Items/Cycle"
import { Event } from "@/src/lib/@types/Items/event"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"
import { useEventsStore } from "@/src/lib/store/events.store"
import { getUserDate, getWeekDates } from "@/src/utils/datetime"

interface TodayEventsProps {
  selectedDate: Date
}

export const TodayItems: React.FC<TodayEventsProps> = ({
  selectedDate,
}): JSX.Element => {
  const { session } = useAuth()

  const { messages } = useWebSocket()

  const timezone = useTimezone()
  const [isControlHeld, setIsControlHeld] = useState(false)
  const [dateChanged, setDateChanged] = useState(false)
  const [reschedulingItemId, setReschedulingItemId] = useState<string | null>(
    null
  )
  const [date, setDate] = useState<Date | null>(new Date())
  const [cycleDate, setCycleDate] = useState<Date | null>(new Date())
  const {
    byDate,
    overdue,
    fetchByDate,
    fetchOverdue,
    updateItem,
    error,
    currentItem,
    setCurrentItem,
    updateStateWithNewItem,
    removeItemFromState,
  } = useCycleItemStore()

  const { events, fetchEventsByDate, currentEvent, setCurrentEvent } =
    useEventsStore()

  const {
    items: byDateItems,
    error: byDateError,
    isLoading: byDateIsLoading,
  } = byDate
  const {
    items: overdueItems,
    error: overdueError,
    isLoading: overdueIsLoading,
  } = overdue

  useEffect(() => {
    const date = format(selectedDate, "yyyy-MM-dd").toLowerCase()
    fetchEventsByDate(session, date)
    fetchByDate(session, date)
    fetchOverdue(session, date)
  }, [session, selectedDate, fetchOverdue, fetchByDate, fetchEventsByDate])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Control" && event.location === 1) {
        setIsControlHeld(true)
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Control" && event.location === 1) {
        setIsControlHeld(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

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

  const handleExpand = useCallback(
    (item: CycleItem) => {
      if (isControlHeld && item.type === "link") {
        window.open(item.metadata?.url, "_blank")
      } else if (!currentItem || currentItem._id !== item._id) {
        setCurrentItem(item)
      }
    },
    [currentItem, setCurrentItem, isControlHeld]
  )

  const handleMeetingExpand = (item: Event) => {
    if (!currentEvent || currentEvent.id !== item.id) {
      setCurrentEvent(item)
    }
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

  if (byDateItems.length + overdueItems.length + events.length > 0) {
    return (
      <div className="no-scrollbar flex h-full flex-col gap-4 pb-5">
        <div>
          {byDateError && (
            <div className="mb-2.5 truncate pl-5 text-xs text-danger-foreground">
              <span>{byDateError}</span>
            </div>
          )}
          {error && (
            <div className="mb-2.5 truncate pl-5 text-xs text-danger-foreground">
              <span>{error}</span>
            </div>
          )}
          <div className="flex flex-col gap-2.5">
            <ItemList
              items={events}
              handleExpand={handleExpand}
              handleMeetingExpand={handleMeetingExpand}
            />
            <ItemList
              items={byDateItems}
              handleExpand={handleExpand}
              handleDone={handleDone}
              handleRescheduleCalendar={handleRescheduleCalendar}
              doneLine={true}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 text-secondary-foreground">
          <div>
            <div className="mt-1">
              {overdueError && (
                <div className="mb-2.5 truncate pl-5 text-xs text-danger-foreground">
                  <span>{overdueError}</span>
                </div>
              )}
              <div className="flex flex-col gap-2.5">
                <ItemList
                  items={overdueItems}
                  handleExpand={handleExpand}
                  handleDone={handleDone}
                  handleRescheduleCalendar={handleRescheduleCalendar}
                  isOverdue={true}
                />
              </div>
            </div>
          </div>
        </div>

        {reschedulingItemId !== null && (
          <div>
            <div
              className="fixed inset-0 z-50 cursor-default bg-black/80"
              role="button"
              onClick={() => setReschedulingItemId(null)}
              onKeyDown={(e) => {
                if (e.key === "Escape" || e.key === "Esc") {
                  setReschedulingItemId(null)
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
        )}
        <ItemExpandModal />
        <TodayExpandedAgenda />
      </div>
    )
  }

  return <div></div>
}
