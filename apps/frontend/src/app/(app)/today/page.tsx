"use client"
import * as React from "react"

import { ShowAgenda } from "@/src/components/atoms/ShowAgenda"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/atoms/Tooltip"
import { TodayTextArea } from "@/src/components/TodayTextArea"
import { Box, CheckedBox } from "@/src/lib/icons/Box"
import { TodayCal } from "@/src/lib/icons/Calendar"
import { GithubToday } from "@/src/lib/icons/Github"
import { Link } from "@/src/lib/icons/Link"
import { Space } from "@/src/lib/icons/Space"
import { DateCycle } from "@/src/components/atoms/Date"
import { TodayMeetings } from "@/src/components/TodayMeetings"
import { TodayEvents } from "@/src/components/TodayEvents"

const todos = [
  {
    icon: <Link />,
    description: "how to get product market fit",
    completion: false,
  },
  {
    icon: <GithubToday />,
    description: "SAT 23: Revert back to normal auth",
    completion: true,
    due: "since Friday",
  },
]


const TodayPage: React.FC = () => {
  const [showAgenda, setShowAgenda] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const handleToggleAgenda = () => {
    setShowAgenda((prev) => !prev)
  }

  return (
    <main className="ml-36 text-gray-color">
      <section className=" mt-4 flex max-w-[96%] items-center justify-end gap-4">
        <span className="text-[11px] font-medium text-white">show agenda</span>
        <ShowAgenda toggle={showAgenda} onToggle={handleToggleAgenda} />
      </section>

      <section className="mt-6 flex justify-between">
        <div className="w-2/3">
          <header className="flex items-center justify-start gap-4">
            <TodayCal />
            <DateCycle onDateChange={setSelectedDate} />
          </header>

          <section className="mt-6">
            <TodayTextArea />
          </section>

          <section className="space-y-8 text-[16px]">
            <TodayEvents selectedDate={selectedDate} />
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
