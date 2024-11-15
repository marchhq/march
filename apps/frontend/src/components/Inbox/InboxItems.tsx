"use client"

import React, { useEffect, useCallback, useState } from "react"

import { RescheduleCalendar } from "./RescheduleCalendar/RescheduleCalendar"
import { ItemList } from "@/src/components/atoms/ItemList"
import { useAuth } from "@/src/contexts/AuthContext"
import { useWebSocket } from "@/src/hooks/useWebSocket"
import { CycleItem } from "@/src/lib/@types/Items/Cycle"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"
import { getWeekDates } from "@/src/utils/datetime"

export const InboxItems: React.FC = () => {
  const { session } = useAuth()

  const [isControlHeld, setIsControlHeld] = useState(false)
  const [dateChanged, setDateChanged] = useState(false)
  const [reschedulingItemId, setReschedulingItemId] = useState<string | null>(
    null
  )
  const [date, setDate] = useState<Date | null>(new Date())
  const [cycleDate, setCycleDate] = useState<Date | null>(new Date())
  const {
    inbox,
    currentItem,
    setCurrentItem,
    fetchInbox,
    updateItem,
    updateStateWithNewItem,
    error,
  } = useCycleItemStore()

  const { items: fetchedItems, error: inboxError } = inbox
  const { messages } = useWebSocket()

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (session) fetchInbox(session)
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [fetchInbox, session])

  // Handle WebSocket messages
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage?.type === "linear" && lastMessage?.item) {
        const { item } = lastMessage
        // Update the item through the store
        updateStateWithNewItem({
          ...item,
          _id: item._id,
          title: item.title,
          description: item.description,
          status: item.status,
          cycle: item.cycle,
        })
      }
    }
  }, [messages, updateStateWithNewItem])

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

  const filteredItems =
    fetchedItems?.filter((item) => item?.status !== "done") || []

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

  if (filteredItems.length > 0) {
    return (
      <div className="no-scrollbar flex h-full flex-col gap-2 overflow-y-auto">
        <div>
          {inboxError && (
            <div className="mb-2.5 truncate pl-5 text-xs text-danger-foreground">
              <span>{inboxError}</span>
            </div>
          )}
          {error && (
            <div className="mb-2.5 truncate pl-5 text-xs text-danger-foreground">
              <span>{error}</span>
            </div>
          )}
          <div className="flex flex-col gap-2.5">
            <ItemList
              items={filteredItems}
              handleExpand={handleExpand}
              handleDone={handleDone}
              handleRescheduleCalendar={handleRescheduleCalendar}
            />
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
      </div>
    )
  }
}
