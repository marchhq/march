"use client"

import * as React from "react"

import { CalendarDot, CalendarDots, CalendarX } from "@phosphor-icons/react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon, SquareChevronRightIcon } from "lucide-react"

import { Calendar } from "@/src/components/Inbox/RescheduleCalendar/Calendar"
import DateSelectionButton from "@/src/components/Inbox/RescheduleCalendar/DateSelectionButton"

interface RescheduleCalendarProps {
  date: Date | null
  setDate: (date: Date | null) => void
  scheduleItemId: string
  setScheduleItemId: (date: string | null) => void
  icon?: React.ReactNode
}

export function RescheduleCalendar({
  date,
  setDate,
  scheduleItemId,
  setScheduleItemId,
}: RescheduleCalendarProps) {
  const [noDate, setNoDateFlag] = React.useState<boolean>(false)

  const setToday = () => {
    setNoDateFlag(false)
    setDate(new Date())
    setScheduleItemId(scheduleItemId)
  }
  const setTomorrow = () => {
    setNoDateFlag(false)
    setDate(addDays(new Date(), 1))
    setScheduleItemId(scheduleItemId)
  }
  const setNextWeek = () => {
    setNoDateFlag(false)
    setDate(addDays(new Date(), 7))
    setScheduleItemId(scheduleItemId)
  }
  const setNoDate = () => {
    setNoDateFlag(true)
    setDate(null)
    setScheduleItemId(scheduleItemId)
  }

  const todayFormatted = format(new Date(), "eee")
  const tomorrowFormatted = format(addDays(new Date(), 1), "eee")
  const nextWeekFormatted = format(addDays(new Date(), 7), "eee MMM dd")

  const dueDateFormatted = noDate
    ? "No Date Assigned"
    : date
      ? format(date, "eee MMM dd")
      : "No Date Assigned"

  return (
    <div className="flex flex-row-reverse overflow-hidden rounded-lg bg-background text-secondary-foreground">
      <div className="border-l border-border p-4 text-sm">
        <div className="mb-2 text-primary-foreground">
          Due Date:{" "}
          <strong className="text-foreground">{dueDateFormatted}</strong>
        </div>
        <div>
          <DateSelectionButton
            label="Today"
            icon={CalendarDot}
            formattedDate={todayFormatted}
            onClick={setToday}
          />
          <DateSelectionButton
            label="Tomorrow"
            icon={SquareChevronRightIcon}
            formattedDate={tomorrowFormatted}
            onClick={setTomorrow}
          />
          <DateSelectionButton
            label="Next Week"
            icon={CalendarDots}
            formattedDate={nextWeekFormatted}
            onClick={setNextWeek}
          />
          <DateSelectionButton
            label="No Date"
            icon={CalendarX}
            formattedDate={""}
            onClick={setNoDate}
          />
        </div>
      </div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={(selectedDate) => {
          setNoDateFlag(false)
          setDate(selectedDate)
          setScheduleItemId(scheduleItemId)
        }}
        initialFocus
      />
    </div>
  )
}
