"use client"

import React from "react"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/atoms/Resizable"
import EachMeet from "@/components/EachMeet"
import PageSection from "@/components/PageSection"

const MeetingPage: React.FC = () => {
  const meets = [
    {
      title: "Interview Meeting",
      date: "4th August",
      time: "10:00 AM",
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia iste molestiae esse!",
    },
    {
      title: "Meeting with Persona",
      date: "5th August",
      time: "3:00 PM",
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia iste molestiae esse!",
    },
    {
      title: "Interview Meeting",
      date: "6th August",
      time: "10:00 AM",
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia iste molestiae esse!",
    },
    {
      title: "Meeting with Persona",
      date: "6th August",
      time: "3:00 PM",
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia iste molestiae esse!",
    },
    {
      title: "Team Meeting",
      date: "7th August",
      time: "11:00 AM",
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia iste molestiae esse!",
    },
  ]

  const [activeMeet, setActiveMeet] = React.useState<number>(0);

  const handleMeetClick = (index: number): void => {
    setActiveMeet(index)
  }

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={70} minSize={40}>
        <div className="h-full overflow-auto rounded-xl border border-white/10 bg-white/10 px-6 py-5 shadow-lg backdrop-blur-lg">
          <div className="mt-4 px-3">
            <div>
              <div className="flex items-center gap-x-2 text-sm text-zinc-300">
                <div className="size-4 rounded-full border border-white/30 bg-white/10" />
                <span>{meets[activeMeet].date}</span>
                <div className="size-1 rounded-full bg-zinc-300" />
                <span>{meets[activeMeet].time}</span>
              </div>
              <div className="my-5 text-2xl font-semibold text-zinc-200">
                {meets[activeMeet].title}
              </div>
              <PageSection />
            </div>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={30} minSize={30}>
        <div className="h-full overflow-auto rounded-xl border border-white/10 bg-white/10 px-2 py-5 shadow-lg backdrop-blur-lg">
          <div className="px-3 font-semibold text-zinc-300">Upcoming</div>
          <div className="mt-12 flex flex-col gap-y-2 px-3">
            {meets.map((meet, index) => (
              <EachMeet
                key={meet.title}
                activeMeet={activeMeet}
                setActiveMeet={handleMeetClick}
                meet={meets[index]}
                index={index}
              />
            ))}
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default MeetingPage
