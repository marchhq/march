import React, { useEffect, useState } from "react"

import { CalendarIcon, Link2Icon } from "lucide-react"

import { RescheduleCalendar } from "../Inbox/RescheduleCalendar/RescheduleCalendar"
import ImageWithFallback from "../ui/ImageWithFallback"
import { useAuth } from "@/src/contexts/AuthContext"
import { type ReadingItem } from "@/src/lib/@types/Items/Reading"
import useReadingStore from "@/src/lib/store/reading.store"
import { getWeekDates } from "@/src/utils/datetime"
import { truncateString } from "@/src/utils/helpers"

interface ItemsListProps {
  blockId: string
  spaceId: string
  items: ReadingItem[]
  handleExpand: (item: ReadingItem) => void
}

const ItemsList: React.FC<ItemsListProps> = ({
  blockId,
  spaceId,
  items,
  handleExpand,
}) => {
  const { session } = useAuth()
  const { updateItem } = useReadingStore()
  const [date, setDate] = useState<Date | null>(new Date())
  const [dateChanged, setDateChanged] = useState(false)
  const [cycleDate, setCycleDate] = useState<Date | null>(new Date())
  const [reschedulingItemId, setReschedulingItemId] = useState<string | null>(
    null
  )

  useEffect(() => {
    if (dateChanged) {
      if (reschedulingItemId) {
        if (date && blockId) {
          updateItem(session, spaceId, blockId, reschedulingItemId, {
            status: "todo",
            dueDate: date,
          })
        }
        if (cycleDate && blockId) {
          const { startDate, endDate } = getWeekDates(cycleDate)
          updateItem(session, blockId, spaceId, reschedulingItemId, {
            status: "todo",
            dueDate: date,
            cycle: {
              startsAt: startDate,
              endsAt: endDate,
            },
          })
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
    dateChanged,
    blockId,
  ])

  const handleRescheduleCalendar = (
    e: React.MouseEvent,
    id: string,
    dueDate?: Date | null
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

  if (items.length === 0) {
    return <p>Reading list is empty </p>
  }

  return (
    <div className="flex w-3/4 flex-col gap-2">
      {[...items].reverse().map((item: ReadingItem) => {
        const url = item?.metadata?.url
        const favicon = item?.metadata?.favicon
        return (
          <button
            key={item?._id}
            className="group flex flex-col justify-center gap-2 rounded-lg py-1"
            onClick={() => handleExpand(item)}
          >
            <div className="flex items-center gap-2">
              <div className="grow overflow-hidden">
                <p className="flex flex-wrap items-center gap-2 text-primary-foreground">
                  <span className="break-all text-[16px] leading-[23px]">
                    {truncateString(item?.title, 50)}
                  </span>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block ${url ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <span>
                      {favicon ? (
                        <ImageWithFallback
                          src={favicon}
                          FallbackIcon={Link2Icon}
                          alt="Favicon"
                          width={16}
                          height={16}
                          className="mt-0.5 size-3.5 shrink-0"
                        />
                      ) : (
                        ""
                      )}
                    </span>
                  </a>
                  <span className="invisible group-hover:visible">
                    <CalendarIcon
                      size={13}
                      className="hover-text"
                      onClick={(e) => {
                        handleRescheduleCalendar(e, item._id, item?.dueDate)
                      }}
                    />
                  </span>
                </p>
              </div>
            </div>
          </button>
        )
      })}

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

export default ItemsList
