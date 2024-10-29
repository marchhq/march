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
    <main className="ml-[180px] h-full overflow-y-hidden bg-background p-10">
      <section className="flex justify-between">
        <div className="">
          <header className="flex items-center justify-start">
            <DateCycle
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </header>
          <section className="my-3">
            <TodayTextArea selectedDate={selectedDate} />
          </section>
          <section className="space-y-8 text-[16px] text-secondary-foreground">
            <TodayItems selectedDate={selectedDate} />
          </section>
        </div>
        <section className="w-[96%] max-w-[300px]">
          <div className="flex items-center justify-end gap-4">
            <span className="mt-2 text-[11px] font-medium text-foreground">
              show agenda
            </span>
            <ShowAgenda toggle={showAgenda} onToggle={handleToggleAgenda} />
          </div>
          {showAgenda && (
            <div className="my-4 text-secondary-foreground">
              <TodayMeetings selectedDate={selectedDate} />
            </div>
          )}
        </section>
      </section>
    </main>
  )
}

export default TodayPage
