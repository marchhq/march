import React, { useCallback, useEffect } from "react"

import { TodayExpandedAgenda } from "./TodayExpandedAgenda"
import { useAuth } from "@/src/contexts/AuthContext"
import { Event } from "@/src/lib/@types/Items/event"
import { useEventsStore } from "@/src/lib/store/events.store"

interface TodayAgendaProps {
  selectedDate: Date
}

interface AgendaItem {
  title: string
}

export const TodayMeetings: React.FC<TodayAgendaProps> = ({ selectedDate }) => {
  const { session } = useAuth()
  const { events, fetchEventsByDate, currentEvent, setCurrentEvent } =
    useEventsStore()

  useEffect(() => {
    fetchEventsByDate(session, selectedDate.toISOString())
  }, [fetchEventsByDate, selectedDate])

  const handleExpand = (item: Event) => {
    if (!currentEvent || currentEvent.id !== item.id) {
      setCurrentEvent(item)
    }
  }

  return (
    <div>
      <div className="mt-2 flex flex-col gap-2 border-l border-border">
        {events.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              handleExpand(item)
            }}
            className="hover-text -ml-px truncate border-l border-border pl-2 text-start hover:border-l-secondary-foreground"
          >
            {item.summary}
          </button>
        ))}
      </div>
      <TodayExpandedAgenda />
    </div>
  )
}
