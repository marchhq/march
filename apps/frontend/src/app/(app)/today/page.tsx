"use client"
import * as React from "react"

import { ShowAgenda } from "@/src/components/atoms/ShowAgenda"
import { TodayTextArea } from "@/src/components/TodayTextArea"
import { TodayMeetings } from "@/src/components/TodayMeetings"
import { DateCycle } from "@/src/components/atoms/Date"
import { TodayItems } from "@/src/components/TodayItems"
import { DynamicDate } from "@/src/components/atoms/DynamicDate"

const TodayPage: React.FC = () => {
  const [showAgenda, setShowAgenda] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const handleToggleAgenda = () => {
    setShowAgenda((prev) => !prev)
  }

  return (
    <main className="ml-36 text-foreground">
      <section className=" mt-4 flex max-w-[96%] items-center justify-end gap-4">
        <span className="text-[11px] font-medium text-white">show agenda</span>
        <ShowAgenda toggle={showAgenda} onToggle={handleToggleAgenda} />
      </section>

      <section className="mt-6 flex justify-between">
        <div className="w-2/3">
          <header className="flex items-center justify-start gap-4">
            <span
              onClick={() => setSelectedDate(new Date())}
              className="cursor-pointer">
              <DynamicDate selectedDate={selectedDate} />
            </span>
            <DateCycle selectedDate={selectedDate} onDateChange={setSelectedDate} />
          </header>

          <section className="mt-6 mb-4">
            <TodayTextArea selectedDate={selectedDate} />
            <div className="border-b border-[#3A3A3A] max-w-sm"></div>
          </section>

          <section className="space-y-8 text-[16px]">
            <TodayItems selectedDate={selectedDate} />
          </section>
        </div>
        {showAgenda && (
          <div className="w-1/4">
            <TodayMeetings selectedDate={selectedDate} />
          </div>
        )}
      </section>
    </main>
  )
}

export default TodayPage
