"use client"

import React, { useState } from "react"

import { DateCycle } from "@/src/components/atoms/Date"
import { ShowAgenda } from "@/src/components/atoms/ShowAgenda"
import { TodayItems } from "@/src/components/Today/TodayItems"
import { TodayMeetings } from "@/src/components/Today/TodayMeetings"
import { TodayTextArea } from "@/src/components/Today/TodayTextArea"
import usePersistedState from "@/src/hooks/usePersistedState"

export const TodayPage: React.FC = () => {
  const [showAgenda, setShowAgenda] = usePersistedState("showAgenda", false)
  const [selectedDate, setSelectedDate] = useState(new Date())

  const handleToggleAgenda = () => {
    setShowAgenda(!showAgenda)
  }

  return (
    <main className="h-full bg-background p-10 pl-5">
      <section className="flex h-full items-start gap-10">
        <div className="no-scrollbar flex h-full flex-1 flex-col gap-5 overflow-y-scroll text-sm">
          <header>
            <DateCycle
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </header>
          <TodayTextArea selectedDate={selectedDate} />
          <TodayItems selectedDate={selectedDate} />
        </div>
        <div className="flex w-[250px] max-w-[250px] flex-col gap-4 text-sm text-secondary-foreground">
          <div className="flex items-center justify-end gap-2 truncate">
            <span className="truncate">show agenda</span>
            <ShowAgenda toggle={showAgenda} onToggle={handleToggleAgenda} />
          </div>
          {showAgenda && (
            <div className="no-scrollbar h-[90vh] overflow-y-scroll text-secondary-foreground">
              <TodayMeetings selectedDate={selectedDate} />
            </div>
          )}
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
