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
  const plugins = [
    createDragAndDropPlugin(),
    createResizePlugin(),
    createCurrentTimePlugin(),
    createEventModalPlugin(),
    createEventsServicePlugin(),
    createCalendarControlsPlugin(),
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

  return {
    calendar,
  }
}

export default useCalendar
