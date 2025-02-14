import { useRef, useState } from "react"

import {
  CalendarEvent,
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
  viewDay,
} from "@schedule-x/calendar"
import { createCalendarControlsPlugin } from "@schedule-x/calendar-controls"
import { createCurrentTimePlugin } from "@schedule-x/current-time"
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop"
import { createEventModalPlugin } from "@schedule-x/event-modal"
import { createEventsServicePlugin } from "@schedule-x/events-service"
import { useNextCalendarApp } from "@schedule-x/react"
import { createResizePlugin } from "@schedule-x/resize"

interface UseCalendarProps {
  events?: CalendarEvent[]
  defaultView?: string
  theme?: string
}

const useCalendar = ({
  events = [],
  defaultView = viewDay.name,
  theme = "shadcn",
}: UseCalendarProps = {}) => {
  const calendarRef = useRef<HTMLDivElement>(null)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const calendarControls = createCalendarControlsPlugin()

  const plugins = [
    createDragAndDropPlugin(),
    createResizePlugin(),
    createCurrentTimePlugin(),
    createEventModalPlugin(),
    createEventsServicePlugin(),
    calendarControls,
  ]

  const calendar = useNextCalendarApp(
    {
      defaultView,
      views: [
        createViewDay(),
        createViewWeek(),
        createViewMonthGrid(),
        createViewMonthAgenda(),
      ],
      events,
      theme,
      callbacks: {
        onRender($app) {
          const date = calendarControls.getDate()
          console.log("Calendar initialized with date:", date)
        },
        onSelectedDateUpdate($app) {
          const newDate = calendarControls.getDate()
          setSelectedDate(newDate)
          console.log("Date changed to:", newDate)
        },
      },
    },
    plugins
  )

  return {
    calendar,
    calendarControls,
    calendarRef,
    selectedDate,
  }
}

export default useCalendar
