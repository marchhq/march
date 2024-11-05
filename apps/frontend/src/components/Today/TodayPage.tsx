"use client"

import React, { useState } from "react"

import { DateCycle } from "@/src/components/atoms/Date"
import { ShowAgenda } from "@/src/components/atoms/ShowAgenda"
import { TodayItems } from "@/src/components/TodayItems"
import { TodayMeetings } from "@/src/components/TodayMeetings"
import { TodayTextArea } from "@/src/components/TodayTextArea"
import usePersistedState from "@/src/hooks/usePersistedState"

export const TodayPage: React.FC = () => {
  const [showAgenda, setShowAgenda] = usePersistedState("showAgenda", false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  console.log("selectedDate", selectedDate)

  const handleToggleAgenda = () => {
    setShowAgenda(!showAgenda)
  }

  return (
    <main className="h-full bg-background p-10 pl-5">
      <section className="flex gap-10">
        <div className="flex flex-1 flex-col gap-5">
          <header className="flex items-start justify-start gap-10">
            <DateCycle
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
            <div className="flex items-center gap-2 truncate text-sm text-secondary-foreground">
              <span className="truncate">show agenda</span>
              <ShowAgenda toggle={showAgenda} onToggle={handleToggleAgenda} />
            </div>
          </header>
          <section className="no-scrollbar h-[30vh] max-w-[700px] overflow-y-scroll pl-5">
            <TodayTextArea selectedDate={selectedDate} />
          </section>
          <section className="max-w-[700px] space-y-8 overflow-y-auto text-[16px] text-secondary-foreground">
            <TodayItems selectedDate={selectedDate} />
          </section>
        </div>
        {/*
        <section className="w-[96%] max-w-[400px]">
          <div className="flex items-center justify-end gap-4">
            <span className="mt-2 text-[11px] font-medium text-foreground">
              show agenda
            </span>
            <ShowAgenda toggle={showAgenda} onToggle={handleToggleAgenda} />
          </div>
          {showAgenda && (
            <div className="no-scrollbar h-[90vh] overflow-y-scroll text-secondary-foreground">
              <TodayMeetings selectedDate={selectedDate} />
            </div>
          )}
        </section>
        */}
      </section>
    </main>
  )
}
