import React from "react"

import { Icon } from "@iconify-icon/react/dist/iconify.mjs"

import { SkeletonCard } from "./atoms/SkeletonCard"
import { useMeetings } from "../hooks/useMeetings"
import { Link as LinkIcon } from "../lib/icons/Link"
import { MeetMuted } from "../lib/icons/Meet"

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

const formatTime = (date: Date): string => {
  return date
    .toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(" ", "")
    .toUpperCase()
}

const calculateDuration = (start: Date, end: Date): number => {
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60))
}

interface TodayAgendaProps {
  selectedDate: Date
}

export const TodayMeetings: React.FC<TodayAgendaProps> = ({ selectedDate }) => {
  const { meetings, isLoading } = useMeetings()

  const todayMeetings = meetings?.meetings.filter((meeting) =>
    isSameDay(new Date(meeting.start.dateTime), selectedDate)
  )

  const agendaItems =
    todayMeetings?.map((meeting) => {
      const startTime = new Date(meeting.start.dateTime)
      const endTime = new Date(meeting.end.dateTime)
      return {
        title: meeting.summary,
        link: meeting.hangoutLink,
        time: `${formatTime(startTime)}`,
        duration: calculateDuration(startTime, endTime),
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
    <div>
      {agendaItems.length === 0 ? (
        <li>no agenda items</li>
      ) : (
        <ol className="relative min-h-[150px] border-s border-border">
          {agendaItems.map((item, index) => (
            <li key={index} className="mb-8 ms-4">
              {/* White line highlight only for first item */}
              {index === 0 && (
                <div
                  className="absolute -start-[1px] h-4 w-px bg-white"
                  style={{ top: "calc(0.75rem + 38px)" }}
                ></div>
              )}
              <span
                className={`absolute -start-12 bg-background p-3 ${index === 0 ? "text-primary-foreground" : "text-secondary-foreground"}`}
              >
                {item.time}
              </span>
              <a href={item.link}>
                <div className="pt-11">
                  <h1
                    className={`text-[16px] font-medium ${index === 0 ? "text-primary-foreground" : "text-secondary-foreground"}`}
                  >
                    {item.title}
                  </h1>
                  <p className="flex gap-2 text-[16px] font-medium text-secondary-foreground">
                    {item.duration} min
                    <span>
                      {index === 0 ? (
                        <Icon
                          icon="logos:google-meet"
                          className="text-[12px]"
                        />
                      ) : (
                        <div className="mt-[4px]">
                          <MeetMuted />
                        </div>
                      )}
                    </span>
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
