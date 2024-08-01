"use client"
import * as React from "react"

import { addDays, subDays } from "date-fns"

import DayTasks from "./DayTasks"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/atoms/Resizable"
import Calendar from "@/components/Calendar"

const DayView: React.FC = () => {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const prevDay = (): void => {
    setCurrentDate(subDays(currentDate, 1))
  }
  const nextDay = (): void => {
    setCurrentDate(addDays(currentDate, 1))
  }

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel>
        <DayTasks
          currentDate={currentDate}
          prevDay={prevDay}
          nextDay={nextDay}
        />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <Calendar currentDate={currentDate} />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default DayView
