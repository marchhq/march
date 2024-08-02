"use client"

import React from "react"

import { Calendar } from "@phosphor-icons/react"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/atoms/Resizable"

const MeetingPage: React.FC = () => {
  const recents = [
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
  ]

  const upcomings = [
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

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={75} minSize={40}>
        <div className="h-full overflow-auto rounded-xl border border-white/10 bg-white/10 px-6 py-5 shadow-lg backdrop-blur-lg">
          <div className="px-3 font-semibold text-zinc-300">Meetings</div>
          <div className="mt-12 px-3">
            <div className="flex flex-col gap-y-8">
              {recents.map((meet) => (
                <div
                  key={meet.time}
                  className="flex max-w-screen-sm justify-between gap-x-6 rounded-lg border border-white/5 p-3 text-sm backdrop-blur-lg"
                >
                  <div>
                    <div className="flex items-center gap-x-2 text-zinc-400">
                      <Calendar size={24} weight="duotone" />
                      <p className="text-zinc-300">{meet.title}</p>
                    </div>
                    <p className="mt-2 text-xs text-zinc-400">
                      {meet.description}
                    </p>
                  </div>
                  <div className="min-w-24">
                    <p className="text-zinc-300">{meet.date}</p>
                    <span className="text-xs text-zinc-400">{meet.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={25} minSize={25}>
        <div className="h-full overflow-auto rounded-xl border border-white/10 bg-white/10 p-5 shadow-lg backdrop-blur-lg">
          <div className="px-3 font-semibold text-zinc-300">Upcoming</div>
          <div className="mt-12 flex flex-col gap-y-6 px-3">
            {upcomings.map((meet) => (
              <div key={meet.time}>
                <div className="flex items-center justify-start gap-x-3 text-sm text-zinc-300">
                  <Calendar size={16} weight="duotone" />
                  <p>{meet.title}</p>
                </div>
                <p className="ml-8 mt-1 text-xs text-zinc-500">
                  {meet.date} · {meet.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default MeetingPage
