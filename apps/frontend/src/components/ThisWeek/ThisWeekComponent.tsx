import React from "react"

import ThisWeekArrows from "@/src/components/ThisWeek/ThisWeekArrows"
import ThisWeekSection from "./ThisWeekSection"

const ThisWeekComponent: React.FC = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-8 text-xs">
        <h1 className="text-foreground text-2xl">Week 1</h1>
        <div className="flex gap-4">
          <p>0/6 completed</p>
          <p>0%</p>
          <p>aug 19th - aug 26th</p>
        </div>
        <ThisWeekArrows />
      </div>
      <div className="flex w-full max-w-screen-xl gap-8">
        <ThisWeekSection icon="material-symbols:circle-outline" title="to do" />
        <ThisWeekSection icon="carbon:circle-dash" title="in progress" />
        <ThisWeekSection icon="material-symbols:circle" title="done" />
      </div>
    </div>
  )
}

export default ThisWeekComponent
