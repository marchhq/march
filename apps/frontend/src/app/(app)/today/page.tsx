import { Metadata } from "next"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/src/components/atoms/Resizable"
import CalendarBlock from "@/src/components/blocks/calendar/cal"
import { TodayPage } from "@/src/components/Today/TodayPage"
import generateMetadataHelper from "@/src/utils/seo"

export const metadata: Metadata = generateMetadataHelper({
  path: "/today",
  title: "Today",
  description: "engineered for makers",
})

const Today: React.FC = () => {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={25} minSize={20}>
          <TodayPage />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75} minSize={30}>
          <CalendarBlock />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default Today
