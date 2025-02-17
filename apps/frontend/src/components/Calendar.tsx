"use client"
import * as React from "react"

import { format, isSameDay } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Event } from "../lib/@types/Items/event"
import { useDateStore } from "../lib/store/date.store"
import { transformEvents } from "../utils/event"
import { EventCard } from "@/src/components/calendar/event-card"
import { TimeGrid } from "@/src/components/calendar/time-grid"
import { Button } from "@/src/components/ui/button"

interface Props {
  initialEvents: Event[]
}

const DayCalendar: React.FC<Props> = ({ initialEvents = [] }) => {
  const { currentDate, nextDay, previousDay } = useDateStore()
  const [view, setView] = React.useState<"day" | "week">("day")

  // Transform the initial events
  const events = React.useMemo(
    () => transformEvents(initialEvents),
    [initialEvents]
  )

  const filteredEvents = events.filter((event) =>
    isSameDay(event.date, currentDate)
  )
  return (
    <div className="flex h-full flex-col">
      <div className="calendar-header">
        <div className="calendar-nav">
          <span className="date-text">
            {format(currentDate, "d, MMMM").toLowerCase()}{" "}
            {format(currentDate, "yy")}
          </span>
          <Button variant="ghost" className="nav-button" onClick={previousDay}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="ghost" className="nav-button" onClick={nextDay}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="calendar-container flex-1">
        <TimeGrid date={currentDate} view={view}>
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} view={view} />
          ))}
        </TimeGrid>
      </div>
    </div>
  )
}

export default DayCalendar
