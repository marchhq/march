"use client"
import * as React from "react"

import { ChevronLeft, ChevronRight, Square, SquareCheck } from "lucide-react"

import { ShowAgenda } from "@/src/components/atoms/ShowAgenda"
import { TodayTextArea } from "@/src/components/TodayTextArea"
import { TodayCal } from "@/src/lib/icons/Calendar"
import { LeftChevron, RightChevron } from "@/src/lib/icons/Navigation"

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
        <div className="flex items-center justify-start gap-2 text-white">
          <Square />
          <span>how to get product market fit </span>
        </div>
        <div className="flex items-center justify-start gap-2">
          <SquareCheck />
          <span> SAT 23: Revert back to normal auth </span>
        </div>
      </section>
    </main>
  )
}

export default TodayPage
