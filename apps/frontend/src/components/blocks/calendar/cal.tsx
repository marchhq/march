"use client"

import React from "react"

import Calendar from "@/src/components/Calendar"
import { useAuth } from "@/src/contexts/AuthContext"
import { useDateStore } from "@/src/lib/store/date.store"
import { useEvents } from "@/src/queries/useEvents"

function CalendarBlock() {
  const { session } = useAuth()
  const { currentDate, dateString } = useDateStore()
  const { data: events, isLoading } = useEvents(session, dateString)

  return (
    <div className="size-full overflow-hidden bg-white">
      <Calendar initialEvents={events ?? []} />
    </div>
  )
}

export default CalendarBlock
