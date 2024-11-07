import React from "react"

import Link from "next/link"

import { SkeletonCard } from "./atoms/SkeletonCard"
import { useMeetings } from "../hooks/useMeetings"
import { Event } from "../lib/@types/Items/event"

interface TodayAgendaProps {
  selectedDate: Date
}

interface AgendaItem {
  title: string
}

export const TodayMeetings: React.FC<TodayAgendaProps> = ({ selectedDate }) => {
  const { meetings, isLoading } = useMeetings(selectedDate.toISOString())

  const agendaItems: AgendaItem[] =
    meetings?.map((event: Event) => {
      return {
        title: event.summary,
      }
    }) || []

  if (isLoading) {
    return (
      <ol>
        <li className="text-lg font-medium text-[#DCDCDD]/80">
          <SkeletonCard />
        </li>
      </ol>
    )
  }

  return (
    <div className="mt-2 flex flex-col">
      {agendaItems.map((item, index) => (
        <div
          key={index}
          className="border-l border-border pl-2 hover:border-l-secondary-foreground"
        >
          <Link
            href="/space/meetings/"
            key={index}
            className="hover-text cursor-pointer"
          >
            {item.title}
          </Link>
        </div>
      ))}
    </div>
  )
}
