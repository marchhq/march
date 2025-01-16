"use client"

import React, { useState } from "react"

import { DateCycle } from "@/src/components/atoms/Date"
import { TodayItems } from "@/src/components/Today/TodayItems"
import { TodayTextArea } from "@/src/components/Today/TodayTextArea"

export const TodayPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())

  return (
    <div className="space-y-5">
      <header>
        <DateCycle selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </header>
      <div className="space-y-5">
        <TodayTextArea selectedDate={selectedDate} />
        <TodayItems selectedDate={selectedDate} />
      </div>
    </div>
  )
}
