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

const todayStr = new Date().toISOString().replace(/T.*$/, "") // YYYY-MM-DD of today
const INITIAL_EVENTS = [
  {
    id: "1",
    title: "All-day event",
    start: todayStr,
  },
  {
    id: "2",
    title: "Timed event",
    start: todayStr + "T12:00:00",
  },
]

const DayView: React.FC = () => {
  const [dateChangeCounter, setDateChangeCounter] = React.useState(0) // used to remount the element when date is changed for Animation
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const prevDay = (): void => {
    setCurrentDate(subDays(currentDate, 1))
    setDateChangeCounter(dateChangeCounter + 1)
  }
  const nextDay = (): void => {
    setCurrentDate(addDays(currentDate, 1))
    setDateChangeCounter(dateChangeCounter + 1)
  }

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={60} minSize={30}>
        <DayTasks
          currentDate={currentDate}
          prevDay={prevDay}
          nextDay={nextDay}
          dateChangeCounter={dateChangeCounter}
        />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={40} minSize={30}>
        <Calendar currentDate={currentDate} initialEvents={INITIAL_EVENTS} />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default DayView
