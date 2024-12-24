"use client"

import React, { useCallback, useEffect, useState } from "react"

import { usePathname } from "next/navigation"

import { ItemList } from "../../atoms/ItemList"
import { RescheduleCalendar } from "../../Inbox/RescheduleCalendar/RescheduleCalendar"
import { Modal } from "../../modals/RescheduleModal"
import { useAuth } from "@/src/contexts/AuthContext"
import { useTimezone } from "@/src/hooks/useTimezone"
import { Item } from "@/src/lib/@types/Items/Items"
import { useItemStore } from "@/src/lib/store/item.store"
import { useItems } from "@/src/queries/useItem"
import { formatRescheduleDate } from "@/src/utils/dateHelpers"
import { getUserDate } from "@/src/utils/datetime"
import { useCtrlKey } from "@/src/utils/useKeyPress"

export const TodoItems: React.FC = () => {
  const { session } = useAuth()
  const pathname = usePathname()
  const slug = pathname?.split("/objects/")[1]?.replace("/", "")

  const { data: items, isLoading } = useItems(session, slug)
  const { currentItem, setCurrentItem } = useItemStore()

  const timezone = useTimezone()
  const isCTRLPressed = useCtrlKey()
  const [reschedulingItemId, setReschedulingItemId] = useState<string | null>(
    null
  )
  const [dateChanged, setDateChanged] = useState(false)
  const [date, setDate] = useState<Date | null>(new Date())
  const [cycleDate, setCycleDate] = useState<Date | null>(new Date())

  useEffect(() => {
    if (timezone) {
      setDate(getUserDate(timezone))
      setCycleDate(getUserDate(timezone))
    }
  }, [timezone])

  const handleExpand = useCallback(
    (item: Item) => {
      if (isCTRLPressed && item.type === "bookmark") {
        window.open(item.metadata?.url, "_blank")
      } else if (!currentItem || currentItem._id !== item._id) {
        setCurrentItem(item)
      }
    },
    [currentItem, setCurrentItem, isCTRLPressed]
  )

  const handleCalendarClick = (
    e: React.MouseEvent,
    _id: string,
    dueDate: Date | string | null
  ) => {
    e.stopPropagation()
    const newDate = formatRescheduleDate(dueDate, timezone)
    setReschedulingItemId(_id)
    setDate(newDate)
  }

  if (!items) {
    return null
  }
  return (
    <section className="no-scrollbar flex h-full flex-col gap-2 overflow-y-auto">
      <section className="flex flex-col gap-2.5">
        <ItemList
          items={items}
          handleExpand={handleExpand}
          handleRescheduleCalendar={handleCalendarClick}
        />
      </section>

      {reschedulingItemId !== null && (
        <Modal
          isOpen={Boolean(reschedulingItemId)}
          onClose={() => setReschedulingItemId(null)}
        >
          <RescheduleCalendar
            date={date}
            setDate={setDate}
            cycleDate={cycleDate}
            setCycleDate={setCycleDate}
            dateChanged={dateChanged}
            setDateChanged={setDateChanged}
          />
        </Modal>
      )}
    </section>
  )
}
