import * as React from "react"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/atoms/Resizable"
import Calendar from "@/components/Calendar"
import DayView from "@/components/DayView"

const TodayPage: React.FC = () => {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel>
        <DayView />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <Calendar />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default TodayPage
