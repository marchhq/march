"use client"

import React, { useState } from "react"

import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
  viewWeek,
} from "@schedule-x/calendar"
import { createCurrentTimePlugin } from "@schedule-x/current-time"
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop"
import { createEventModalPlugin } from "@schedule-x/event-modal"
import { createEventsServicePlugin } from "@schedule-x/events-service"
import { useNextCalendarApp, ScheduleXCalendar } from "@schedule-x/react"
import { createResizePlugin } from "@schedule-x/resize"

import "@schedule-x/theme-shadcn/dist/index.css"
import { EventModal } from "../../modals/EventModal"

function CalendarBlock() {
  const [eventId, setEventId] = useState(1)

  const plugins = [
    createDragAndDropPlugin(),
    createResizePlugin(),
    createCurrentTimePlugin(),
    createEventModalPlugin(),
    createEventsServicePlugin(),
  ]

  const calendar = useNextCalendarApp(
    {
      defaultView: viewWeek.name,
      views: [
        createViewDay(),
        createViewWeek(),
        createViewMonthGrid(),
        createViewMonthAgenda(),
      ],
      theme: "shadcn",
    },
    plugins
  )

  const handleAddEvent = () => {
    const newEvent = {
      id: eventId,
      title: `event ${eventId}`,
      start: "2025-02-11 10:00",
      end: "2025-02-11 11:00",
    }

    calendar?.events.add(newEvent)
    setEventId((prev) => prev + 1)
  }

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
      <EventModal />
    </div>
  )
}

export default CalendarBlock
