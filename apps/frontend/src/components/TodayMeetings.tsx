import React, { useCallback, useEffect } from "react"

import { useAuth } from "../contexts/AuthContext"
import { Event } from "../lib/@types/Items/event"
import { useEventsStore } from "../lib/store/events.store"

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

  {
    /* if (isLoading) {
    return (
      <ol>
        <li className="text-lg font-medium text-[#DCDCDD]/80">
          <SkeletonCard />
        </li>
      </ol>
    )
  } */
  }

  const handleExpand = (item: Event) => {
    if (!currentEvent || currentEvent.id !== item.id) {
      setCurrentEvent(item)
    }
  }

  return (
    <div className="mt-2 flex flex-col">
      {events.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            handleExpand(item)
          }}
          className="border-l border-border pl-2 text-start hover:border-l-secondary-foreground"
        >
          {item.summary}
        </button>
      ))}
    </div>
  )
}
