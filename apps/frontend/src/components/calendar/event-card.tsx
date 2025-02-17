"use client"
import * as React from "react"

import { format } from "date-fns"
import Link from "next/link"

import { CalendarEvent } from "@/src/lib/@types/Items/event"

interface EventCardProps {
  event: CalendarEvent
  view: "day" | "week"
}

export function EventCard({ event, view }: EventCardProps) {
  const startTime = event.start.dateTime

  // Calculate duration in minutes
  const endTime = event.end.dateTime
  const duration = (endTime.getTime() - startTime.getTime()) / (60 * 1000)

  const style = {
    top: `${(startTime.getHours() - 8) * 60 + startTime.getMinutes()}px`,
    height: `${duration}px`,
    gridColumn: "1 / -1", // Always full width for day view
  }

  return (
    <div
      className={`event-card event-type-${event.type || "default"}`}
      style={style}
    >
      <div className="event-title">{event.title}</div>
      <div className="event-time">{format(startTime, "h:mm a")}</div>
      {event.description && (
        <Link
          href={event.description}
          target="_blank"
          className="event-description hover:underline"
        >
          {" "}
          join with meet
        </Link>
      )}
    </div>
  )
}
