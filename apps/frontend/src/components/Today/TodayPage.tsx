"use client"

import * as React from "react"

import { DateCycle } from "@/src/components/atoms/Date"
import { ShowAgenda } from "@/src/components/atoms/ShowAgenda"
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
    <main className="h-full bg-background p-10">
      <section className="flex justify-between">
        <div className="">
          <header className="flex items-center justify-start">
            <DateCycle
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </header>
          <section className="no-scrollbar my-3 h-[30vh] max-w-[700px] overflow-y-scroll">
            <TodayTextArea selectedDate={selectedDate} />
          </section>
          <section className="no-scrollbar h-[30vh] max-w-[700px] space-y-8 overflow-y-scroll text-[16px] text-secondary-foreground">
            <TodayItems selectedDate={selectedDate} />
          </section>
        </div>
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
      </section>
    </main>
  )
}

export default TodayPage
