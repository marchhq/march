import React from "react"

import { Icon } from "@iconify-icon/react"
import ThisWeekArrows from "@/src/components/ThisWeek/ThisWeekArrows"
import ThisWeekItem from "./ThisWeekItem"
import ThisWeekNewItem from "./ThisWeekNewItem"

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
        <div className="flex flex-col flex-1 gap-4 group/section">
          <div className="flex items-center gap-2 text-xl text-foreground">
            <Icon
              icon="material-symbols:circle-outline"
              className="text-[20px]"
            />
            <h2>to do</h2>
          </div>
          <ThisWeekItem />
          <ThisWeekNewItem />
        </div>
        <div className="flex flex-col flex-1 gap-4 group/section">
          <div className="flex items-center gap-2 text-xl text-foreground">
            <Icon icon="carbon:circle-dash" className="text-[20px]" />
            <h2>in progress</h2>
          </div>
          <ThisWeekItem />
          <ThisWeekNewItem />
        </div>
        <div className="flex flex-col flex-1 gap-4 group/section">
          <div className="flex items-center gap-2 text-xl text-foreground">
            <Icon icon="material-symbols:circle" className="text-[20px]" />
            <h2>done</h2>
          </div>
          <ThisWeekItem />
          <ThisWeekNewItem />
        </div>
      </div>
    </div>
  )
}

export default ThisWeekComponent
