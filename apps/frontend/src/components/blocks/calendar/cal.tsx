"use client"

import React from "react"

import { ScheduleXCalendar } from "@schedule-x/react"

import "@schedule-x/theme-shadcn/dist/index.css"
import { EventModal } from "../../modals/EventModal"
import useCalendar from "@/src/hooks/useCalendar.hook"

function CalendarBlock() {
  const { calendar, handleAddEvent } = useCalendar()

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
      <EventModal onAddEvent={handleAddEvent} />
    </div>
  )
}

export default CalendarBlock
