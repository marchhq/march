"use client"

import * as React from "react"

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Calendar } from "./ui/calendar"
import { TodayCal } from "../lib/icons/Calendar"

interface Props {
  selectedDate: Date
  onDateChange: (date: Date) => void;
}

export function DatePicker({ selectedDate, onDateChange }: Props) {

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>
          <TodayCal />
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
