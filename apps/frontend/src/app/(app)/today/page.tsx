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
import { LeftChevron, RightChevron } from "@/src/lib/icons/Navigation"
import { Space } from "@/src/lib/icons/Space"

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

const formatDate = () => {
  const date = new Date()

  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "2-digit",
  }
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" })
  const day = date.getDate() // Get day of the month
  const month = date.toLocaleDateString("en-US", { month: "short" })
  const year = date.toLocaleDateString("en-US", { year: "2-digit" })

  return `${weekday}, ${day} ${month} ${year}`
}

const TodayPage: React.FC = () => {
  return (
    <main className="ml-36 text-gray-color">
      <section className=" mt-4 flex max-w-[96%] items-center justify-end gap-4">
        <span className="text-[11px] font-medium text-white">show agenda</span>
        <ShowAgenda />
      </section>
      <section>
        <header className="flex items-center justify-start gap-4">
          <TodayCal />
          <div>
            <h1 className="text-xl font-medium text-white">Today</h1>
            <p className="text-sm">{formatDate()}</p>
          </div>
          <div className=" ml-20 flex items-center justify-between gap-4">
            <LeftChevron />
            <RightChevron />
          </div>
        </header>
      </section>
      <section className="mt-6">
        <TodayTextArea />
      </section>

      <section className="space-y-8 text-[16px]">
        <div className="max-w-xs border-b border-[#3A3A3A] opacity-30"></div>
        {todos.map((todo, index) => (
          <div
            key={index}
            className="group flex items-center justify-start gap-2"
          >
            {todo.completion ? <CheckedBox /> : <Box />}
            <p
              className={`${todo.completion ? "text-gray-color" : "text-white"}`}
            >
              {todo.description}
            </p>
            <span>{todo.icon}</span>
            {todo.due && (
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-red-600"></div>{" "}
                {/* Red dot */}
                <span>{todo.due}</span>
              </div>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="invisible ml-2 cursor-pointer group-hover:visible">
                  <Space />
                </TooltipTrigger>
                <TooltipContent>
                  <p>add to space</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </section>
    </main>
  )
}

export default TodayPage
