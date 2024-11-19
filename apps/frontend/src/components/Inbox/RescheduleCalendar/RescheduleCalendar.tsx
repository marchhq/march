"use client"

import React, { useState } from "react"

import { addDays, startOfWeek, endOfWeek, format } from "date-fns"

import { Calendar } from "@/src/components/Inbox/RescheduleCalendar/Calendar"
import DateSelectionButton from "@/src/components/Inbox/RescheduleCalendar/DateSelectionButton"

interface RescheduleCalendarProps {
  date: Date | null
  setDate: (date: Date | null) => void
  cycleDate: Date | null
  setCycleDate: (date: Date | null) => void
  dateChanged: boolean
  setDateChanged: (state: boolean) => void
  icon?: React.ReactNode
  [key: string]: any
}

export function RescheduleCalendar({
  date,
  setDate,
  cycleDate,
  setCycleDate,
  dateChanged,
  setDateChanged,
  ...props
}: RescheduleCalendarProps) {
  const [noDate, setNoDateFlag] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const setToday = () => {
    setNoDateFlag(false)
    setDate(new Date())
    setDateChanged(true)
  }
  const setTomorrow = () => {
    setNoDateFlag(false)
    setDate(addDays(new Date(), 1))
    setDateChanged(true)
  }
  const setThisWeek = () => {
    setNoDateFlag(false)
    setDate(null)
    setCycleDate(startOfWeek(new Date()))
    setDateChanged(true)
  }
  const setNextWeek = () => {
    setNoDateFlag(false)
    setDate(null)
    setCycleDate(startOfWeek(addDays(new Date(), 7)))
    setDateChanged(true)
  }
  const setNoDate = () => {
    setDate(null)
    setCycleDate(null)
    setDateChanged(true)
  }

  const todayFormatted = format(new Date(), "dd [eee]").toLowerCase()
  const tomorrowFormatted = format(
    addDays(new Date(), 1),
    "dd [eee]"
  ).toLowerCase()

  const thisWeekStartFormatted = format(
    startOfWeek(new Date()),
    "dd"
  ).toLowerCase()
  const thisWeekEndFormatted = format(endOfWeek(new Date()), "dd").toLowerCase()
  const thisWeekFormatted =
    thisWeekStartFormatted + " - " + thisWeekEndFormatted

  const nextWeekStartFormatted = format(
    startOfWeek(addDays(new Date(), 7)),
    "dd"
  ).toLowerCase()
  const nextWeekEndFormatted = format(
    endOfWeek(addDays(new Date(), 7)),
    "dd"
  ).toLowerCase()
  const nextWeekFormatted =
    nextWeekStartFormatted + " - " + nextWeekEndFormatted

  const dueDateFormatted = noDate
    ? "no date assigned"
    : date
      ? format(date, "eee MMM dd")
      : "no date assigned"

  const handleOpenCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen)
  }

  return (
    <div
      className="flex items-center gap-5 bg-transparent text-secondary-foreground"
      {...props}
    >
      <div className="flex h-fit min-w-[350px] flex-col gap-5 overflow-hidden rounded-lg bg-background p-5 text-sm">
        <div className="flex justify-between gap-2 text-xs text-secondary-foreground">
          <span className="flex-1 truncate text-primary-foreground">
            {dueDateFormatted}
          </span>
          <button className="hover-text" onClick={handleOpenCalendar}>
            calendar {isCalendarOpen ? "<-" : "->"}
          </button>
        </div>
        <div className="flex flex-col gap-1.5">
          <DateSelectionButton
            label="today"
            formattedDate={todayFormatted}
            onClick={setToday}
          />
          <DateSelectionButton
            label="tomorrow"
            formattedDate={tomorrowFormatted}
            onClick={setTomorrow}
          />
          <DateSelectionButton
            label="this week"
            formattedDate={thisWeekFormatted}
            onClick={setThisWeek}
          />
          <DateSelectionButton
            label="next week"
            formattedDate={nextWeekFormatted}
            onClick={setNextWeek}
          />
          <DateSelectionButton
            label="no date"
            formattedDate={""}
            onClick={setNoDate}
          />
        </div>
      </div>
      {isCalendarOpen && (
        <Calendar
          className="overflow-hidden rounded-lg bg-background"
          mode="single"
          selected={date || undefined}
          onSelect={(selectedDate) => {
            setNoDateFlag(false)
            setDate(selectedDate || null)
            setDateChanged(true)
          }}
          initialFocus
        />
      )}
    </div>
  )
}
