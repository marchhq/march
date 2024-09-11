"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon, SquareChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "../atoms/Popover"
import { Calendar } from "./Calendar"
import { CalendarDot, CalendarDots, CalendarX } from "@phosphor-icons/react"
import DateSelectionButton from "./DateSelectionButton"

interface RescheduleCalendarProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export function RescheduleCalendar({ date, setDate }: RescheduleCalendarProps) {
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
            "w-10 p-3 rounded-lg border hover:bg-primary-foreground hover:text-primary",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex flex-row-reverse rounded-xl overflow-hidden bg-white text-black dark:bg-black dark:text-white">
          <div className="p-4 text-sm border-l">
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
