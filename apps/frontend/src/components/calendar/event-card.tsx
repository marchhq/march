"use client"
import * as React from "react"
import { format } from "date-fns"

interface Event {
  id: string
  title: string
  description?: string
  date: Date
  duration: number
  type: "work" | "personal" | "meeting"
}

interface EventCardProps {
  event: Event
  view: "day" | "week"
}

export function EventCard({ event, view }: EventCardProps) {
  const startTime = event.date
  const duration = event.duration

  const style = {
    top: `${(startTime.getHours() - 8) * 60 + startTime.getMinutes()}px`,
    height: `${duration}px`,
    gridColumn: view === "week" ? `${startTime.getDay() + 1} / span 1` : "1 / -1",
  }

  return (
    <div className={`event-card event-type-${event.type}`} style={style}>
      <div className="event-title">{event.title}</div>
      <div className="event-time">{format(event.date, "h:mm a")}</div>
      {event.description && <div className="event-description">{event.description}</div>}
    </div>
  )
}
