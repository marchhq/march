"use client"
import * as React from "react"

import { addDays, format, setHours, startOfDay, isSameDay } from "date-fns"

import { cn } from "@/src/utils/utils"

interface TimeGridProps {
  date: Date
  view: "day" | "week"
  children: React.ReactNode
}

export function TimeGrid({ date, view, children }: TimeGridProps) {
  const days =
    view === "day"
      ? [date]
      : Array.from({ length: 7 }, (_, i) => addDays(date, i))
  const hours = Array.from({ length: 13 }, (_, i) => i + 8) // 8 AM to 8 PM
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()

  return (
    <div className="time-grid">
      {/* Time labels */}
      <div className="time-labels">
        {hours.map((hour) => (
          <div key={hour} className="text-xs text-gray-500 sm:text-sm">
            {format(setHours(startOfDay(date), hour), "h a")}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="calendar-grid">
        {view === "week" && (
          <div className="week-header">
            {days.map((day) => (
              <div key={day.toISOString()} className="week-header-day">
                <div className="week-day-name">{format(day, "EEE")}</div>
                <div
                  className={cn(
                    "week-day-number",
                    isSameDay(day, now) && "current"
                  )}
                >
                  {format(day, "d")}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className={cn("relative", view === "week" && "mt-8")}>
          {/* Hour grid lines */}
          <div
            className="hour-grid"
            style={{
              gridTemplateColumns: view === "week" ? "repeat(7, 1fr)" : "1fr",
            }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <React.Fragment key={i}>
                {view === "week" ? (
                  <>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <div key={`${i}-${j}`} className="hour-line" />
                    ))}
                  </>
                ) : (
                  <div className="hour-line" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Current time indicator */}
          {isSameDay(date, now) && (
            <div
              className="current-time-indicator"
              style={{
                top: `${(currentHour - 8) * 60 + currentMinute}px`,
              }}
            />
          )}

          {/* Events */}
          {children}
        </div>
      </div>
    </div>
  )
}
