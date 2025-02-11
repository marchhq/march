import { useState } from "react"

import {
  CalendarEventExternal,
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
import { useNextCalendarApp } from "@schedule-x/react"
import { createResizePlugin } from "@schedule-x/resize"

interface UseCalendarProps {
  defaultView?: string
  theme?: string
}

const useCalendar = ({
  defaultView = viewWeek.name,
  theme = "shadcn",
}: UseCalendarProps = {}) => {
  const [events, setEvents] = useState<CalendarEventExternal[]>([])
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
      defaultView,
      views: [
        createViewDay(),
        createViewWeek(),
        createViewMonthGrid(),
        createViewMonthAgenda(),
      ],
      events,
      theme,
    },
    plugins
  )

  const handleAddEvent = (eventData: Omit<CalendarEventExternal, "id">) => {
    const newEvent = {
      id: eventId,
      ...eventData,
    }
    calendar?.events.add(newEvent)
    setEvents((prev) => [...prev, newEvent])
    setEventId((prev) => prev + 1)
  }

  return {
    calendar,
    events,
    handleAddEvent,
  }
}

export default useCalendar
