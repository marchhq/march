"use client"

import React, { useEffect, useRef } from "react"

import { ScheduleXCalendar } from "@schedule-x/react"

import "@schedule-x/theme-shadcn/dist/index.css"
import { EventModal } from "../../modals/EventModal"
import { useAuth } from "@/src/contexts/AuthContext"
import useCalendar from "@/src/hooks/useCalendar.hook"
import { useEvents } from "@/src/queries/useEvents"
import { formatEventDate } from "@/src/utils/datetime"

function CalendarBlock() {
  const { session } = useAuth()

  const { calendar } = useCalendar()
  const calendarRef = useRef<HTMLDivElement>(null)
  const date = new Date().toISOString().split("T")[0]

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

  const { data: events, isLoading, error } = useEvents(session, date)

  useEffect(() => {
    if (Array.isArray(events)) {
      const formattedEvents = events.map((event) => ({
        id: event.id,
        title: event.summary,
        start: formatEventDate(event.start.dateTime),
        end: formatEventDate(event.end.dateTime),
      }))

      calendar?.events.set(formattedEvents)
    }
  }, [events, calendar])

  return (
    <div ref={calendarRef} className="size-full overflow-hidden">
      <ScheduleXCalendar calendarApp={calendar} />
      <EventModal />
    </div>
  )
}

export default CalendarBlock
