"use client"

import React, { useState } from "react"

import { DateCycle } from "@/src/components/atoms/Date"
import { TodayItems } from "@/src/components/Today/TodayItems"
import { TodayTextArea } from "@/src/components/Today/TodayTextArea"

export const TodayPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())

  return (
    <main className="h-full bg-background">
      <section className="flex h-full items-start gap-10">
        <div className="no-scrollbar flex h-full flex-1 flex-col gap-5 overflow-y-scroll text-sm">
          <header className="pl-5">
            <DateCycle
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </header>
          <TodayTextArea selectedDate={selectedDate} />
          <TodayItems selectedDate={selectedDate} />
        </div>
      </section>
    </main>
  )
}
