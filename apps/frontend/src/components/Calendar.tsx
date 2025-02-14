"use client"
import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { addDays, format, startOfDay, addHours, isSameDay } from "date-fns"

import { Button } from "@/src/components/ui/button"
import { Separator } from "@/src/components/ui/separator"
import { EventCard } from "@/src/components/calendar/event-card"
import { TimeGrid } from "@/src/components/calendar/time-grid"
import { cn } from "@/src/utils/utils"

interface Event {
  id: string
  title: string
  description?: string
  date: Date
  duration: number
  type: "work" | "personal" | "meeting"
}

interface Props {
  currentDate: Date
  initialEvents: Event[]
}

const DayCalendar: React.FC<Props> = ({ currentDate, initialEvents = [] }) => {
  const [date, setDate] = React.useState<Date>(currentDate)
  const [view, setView] = React.useState<"day" | "week">("day")

  // Sample events data
  const events: Event[] = initialEvents.length > 0 ? initialEvents : [
    {
      id: "1",
      title: "Team Sync",
      description: "Weekly team sync meeting",
      date: addHours(startOfDay(date), 10),
      duration: 60,
      type: "meeting",
    },
    {
      id: "2",
      title: "Project Review",
      description: "Review Q3 project progress",
      date: addHours(startOfDay(date), 13),
      duration: 90,
      type: "work",
    },
    {
      id: "3",
      title: "Lunch with Sarah",
      description: "Catch up over lunch",
      date: addHours(startOfDay(date), 12),
      duration: 60,
      type: "personal",
    },
  ]

  const filteredEvents = events.filter((event) =>
    view === "day" ? isSameDay(event.date, date) : event.date >= date && event.date <= addDays(date, 7),
  )

  return (
    <div className="flex h-full flex-col">
      <div className="calendar-header">
        <div className="calendar-nav">
          <span className="date-text">
            {format(date, "d, MMMM").toLowerCase()} {format(date, "yy")}
          </span>
          <Button
            variant="ghost"
            className="nav-button"
            onClick={() => setDate(addDays(date, -1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="nav-button"
            onClick={() => setDate(addDays(date, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="view-controls">
          <div className="view-button-group">
            <Button
              variant="ghost"
              className={cn(
                "view-button",
                view === "day" ? "view-button-active" : "view-button-inactive"
              )}
              onClick={() => setView("day")}
            >
              Day
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "view-button",
                view === "week" ? "view-button-active" : "view-button-inactive"
              )}
              onClick={() => setView("week")}
            >
              Week
            </Button>
          </div>
        </div>
      </div>

      <div className="calendar-container flex-1">
        <TimeGrid date={date} view={view}>
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} view={view} />
          ))}
        </TimeGrid>
      </div>
    </div>
  )
}

export default DayCalendar
