"use client"

import * as React from "react"

import { CalendarDot, CalendarDots, CalendarX } from "@phosphor-icons/react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon, SquareChevronRightIcon } from "lucide-react"

import { Calendar } from "./Calendar"
import DateSelectionButton from "./DateSelectionButton"
import { Popover, PopoverContent, PopoverTrigger } from "../atoms/Popover"
import { cn } from "@/lib/utils"

interface RescheduleCalendarProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  icon?: React.ReactNode
}

export function RescheduleCalendar({
  date,
  setDate,
  icon,
}: RescheduleCalendarProps) {
  const [noDate, setNoDateFlag] = React.useState<boolean>(false)

  // Helper functions to set date
  const setToday = () => {
    setNoDateFlag(false)
    setDate(new Date())
  }
  const setTomorrow = () => {
    setNoDateFlag(false)
    setDate(addDays(new Date(), 1))
  }
  const setNextWeek = () => {
    setNoDateFlag(false)
    setDate(addDays(new Date(), 7))
  }
  const setNoDate = () => {
    setNoDateFlag(true)
    setDate(undefined)
  }

  // Format dates for display
  const todayFormatted = format(new Date(), "eee")
  const tomorrowFormatted = format(addDays(new Date(), 1), "eee")
  const nextWeekFormatted = format(addDays(new Date(), 7), "eee MMM dd")

  // Format the selected date
  const dueDateFormatted = noDate
    ? "No Date Assigned"
    : date
      ? format(date, "eee MMM dd")
      : "No Date Assigned"

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "p-2 rounded-full hover:bg-secondary-foreground hover:text-primary",
            !date && "text-muted-foreground"
          )}
        >
          {icon ? icon : <CalendarIcon className="mr-2 size-4" />}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto border-none p-0">
        <div className="flex flex-row-reverse overflow-hidden rounded-xl bg-white text-black dark:border dark:border-border dark:bg-background-active dark:text-white">
          <div className="border-l border-border p-4 text-sm">
            <div className="mb-2 font-semibold">
              Due Date: {dueDateFormatted}
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
            }}
            initialFocus
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
