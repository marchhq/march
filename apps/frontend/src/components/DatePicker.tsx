"use client"
import * as React from "react"

import { DynamicDate } from "./atoms/DynamicDate"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { TodayCal } from "../lib/icons/Calendar"

interface Props {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export function DatePicker({ selectedDate, onDateChange }: Props) {
  const handleDoubleClick = (event: React.MouseEvent) => {
    event.preventDefault()
    const currentDate = new Date()
    onDateChange(currentDate)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button onDoubleClick={handleDoubleClick}>
          <DynamicDate selectedDate={selectedDate} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            if (date) {
              onDateChange(date)
            }
          }}
          className="rounded-md border"
        />
      </PopoverContent>
    </Popover>
  )
}
