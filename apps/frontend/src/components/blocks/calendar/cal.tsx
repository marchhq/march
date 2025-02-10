"use client"

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
import { useNextCalendarApp, ScheduleXCalendar } from "@schedule-x/react"
import { createResizePlugin } from "@schedule-x/resize"

import "@schedule-x/theme-shadcn/dist/index.css"

function CalendarBlock() {
  const plugins = [
    createDragAndDropPlugin(),
    createResizePlugin(),
    createCurrentTimePlugin(),
    createEventModalPlugin(),
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
      events: [
        {
          id: "1",
          title: "march stand up",
          start: "2025-02-10 10:00",
          end: "2025-02-10 11:00",
        },
      ],
      theme: "shadcn",
    },
    plugins
  )
  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  )
}

export default CalendarBlock
