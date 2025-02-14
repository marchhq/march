"use client"

import React from "react"

import Calendar from "@/src/components/Calendar"
import { useEvents } from "@/src/hooks/useEvents"

function CalendarBlock() {
  const { events, addEvent, updateEvent, deleteEvent } = useEvents()
  const currentDate = new Date()

  return (
    <div className="size-full overflow-hidden bg-white">
      <Calendar 
        currentDate={currentDate}
        initialEvents={events}
      />
    </div>
  )
}

export default CalendarBlock
