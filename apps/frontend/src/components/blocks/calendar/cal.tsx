"use client"

import React, { useEffect, useRef } from "react"

import { ScheduleXCalendar } from "@schedule-x/react"

import "@schedule-x/theme-shadcn/dist/index.css"
import { EventModal } from "../../modals/EventModal"
import useCalendar from "@/src/hooks/useCalendar.hook"

function CalendarBlock() {
  const { calendar, handleAddEvent } = useCalendar()
  const calendarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (calendarRef.current) {
        const { width, height } = calendarRef.current.getBoundingClientRect()
        calendarRef.current.style.setProperty(
          "--sx-calendar-width",
          `${width}px`
        )
        calendarRef.current.style.setProperty(
          "--sx-calendar-height",
          `${height}px`
        )
      }
    })

    if (calendarRef.current) {
      resizeObserver.observe(calendarRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div ref={calendarRef} className="size-full overflow-hidden">
      <ScheduleXCalendar calendarApp={calendar} />
      <EventModal onAddEvent={handleAddEvent} />
    </div>
  )
}

export default CalendarBlock
