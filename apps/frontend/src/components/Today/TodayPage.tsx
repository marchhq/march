"use client"

import * as React from "react"

import { DateCycle } from "@/src/components/atoms/Date"
import { ShowAgenda } from "@/src/components/atoms/ShowAgenda"
import { DatePicker } from "@/src/components/DatePicker"
import { TodayItems } from "@/src/components/TodayItems"
import { TodayMeetings } from "@/src/components/TodayMeetings"
import { TodayTextArea } from "@/src/components/TodayTextArea"
import usePersistedState from "@/src/hooks/usePersistedState"

const TodayPage: React.FC = () => {
  const [showAgenda, setShowAgenda] = usePersistedState("showAgenda", false)
  const [selectedDate, setSelectedDate] = React.useState(new Date())

  const handleToggleAgenda = () => {
    setShowAgenda(!showAgenda)
  }

  return (
    <main className="h-full overflow-y-auto bg-background ml-[260px]">
      <section className="mt-4 flex max-w-[96%] items-center justify-end gap-4">
        <span className="text-[11px] font-medium text-white">show agenda</span>
        <ShowAgenda toggle={showAgenda} onToggle={handleToggleAgenda} />
      </section>
      <section className="mt-6 flex justify-between">
        <div className="w-2/3">
          <header className="flex items-center justify-start gap-4">
            <DatePicker
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
            <DateCycle
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </header>
          <section className="mt-6 mb-4">
            <TodayTextArea selectedDate={selectedDate} />
          </section>
          <section className="space-y-8 text-[16px] text-secondary-foreground">
            <TodayItems selectedDate={selectedDate} />
          </section>
        </div>
        {showAgenda && (
          <div className="w-1/4 text-secondary-foreground">
            <TodayMeetings selectedDate={selectedDate} />
          </div>
        )}
      </section>
    </main>
  )
}

export default TodayPage
