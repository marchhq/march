"use client"

import React, { useEffect, useState } from "react"

import { addDays, format } from "date-fns"

import { Input } from "../ui/input"
import { useAuth } from "@/src/contexts/AuthContext"
import useInboxStore from "@/src/lib/store/inbox.store"

interface ScheduleItemProps {
  title: string
  _id: string
  onDateSelect: () => void
}

type DueDate = {
  formatted: string
  dateObj: Date
}

const ScheduleItem = ({ title, _id, onDateSelect }: ScheduleItemProps) => {
  const [inputDate, setInputDate] = useState<string>("")
  const [dueDates, setDueDates] = useState<DueDate[]>([])
  const { session } = useAuth()
  const { moveItemToDate } = useInboxStore()

  const monthMap: { [key: string]: number } = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  }

  const allMonths = Object.keys(monthMap)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let dateInput = e.target.value.toLowerCase()

    if (dateInput.startsWith("on ")) {
      dateInput = dateInput.slice(3)
    }

    setInputDate(dateInput)
  }

  const formatDate = (date: Date): string => {
    const month = date.toLocaleString(undefined, { month: "short" })
    const day = date.getDate()
    const year = date.getFullYear()
    return `${month} ${day}${getOrdinalSuffix(day)}, ${year}`
  }

  const formatDayOfWeek = (date: Date): string => {
    return date.toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  useEffect(() => {
    if (inputDate.length === 0) {
      setDueDates(generateDefaultDates())
    } else {
      generateDueDates(inputDate)
    }
  }, [inputDate])

  const getOrdinalSuffix = (day: number): string => {
    if (day > 3 && day < 21) return "th"
    switch (day % 10) {
      case 1:
        return "st"
      case 2:
        return "nd"
      case 3:
        return "rd"
      default:
        return "th"
    }
  }

  const generateDefaultDates = (): DueDate[] => {
    const now = new Date()
    const tomorrow = addDays(now, 1)
    const nextWeek = addDays(now, 7)
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    return [
      { formatted: `Today: ${format(now, "eee")}`, dateObj: now },
      { formatted: `Tomorrow: ${format(tomorrow, "eee")}`, dateObj: tomorrow },
      {
        formatted: `Next Week: ${formatDayOfWeek(nextWeek)}`,
        dateObj: nextWeek,
      },
      {
        formatted: `Next Month: ${formatDayOfWeek(nextMonth)}`,
        dateObj: nextMonth,
      },
    ]
  }

  const generateDueDates = (dateInput: string) => {
    const [monthPart, dayPart] = dateInput.split(" ")
    const matchingMonths = allMonths.filter((month) =>
      month.startsWith(monthPart)
    )

    if (matchingMonths.length === 0) {
      setDueDates(generateDefaultDates()) // Fallback to default dates
      return
    }

    const generatedDates: DueDate[] = []
    const now = new Date()

    if (dayPart) {
      const day = parseInt(dayPart, 10)

      if (Number.isNaN(day) || day < 1 || day > 31) {
        setDueDates(generateDefaultDates()) // Fallback to default dates
        return
      }

      matchingMonths.forEach((month) => {
        const monthIndex = monthMap[month]
        for (let i = 0; i < 4; i++) {
          const dueDate = new Date(now.getFullYear() + i, monthIndex, day)
          if (dueDate < now) continue // Skip past dates
          if (dueDate.getMonth() !== monthIndex) continue // Skip invalid dates (e.g. Feb 30)
          generatedDates.push({
            formatted: `${formatDate(dueDate)}: ${formatDayOfWeek(dueDate)}`,
            dateObj: dueDate,
          })
        }
      })
    } else {
      matchingMonths.forEach((month) => {
        const monthIndex = monthMap[month]
        const dueDate = new Date(now.getFullYear(), monthIndex, 1)
        generatedDates.push({
          formatted: `${formatDate(dueDate)}: ${formatDayOfWeek(dueDate)}`,
          dateObj: dueDate,
        })
      })
    }

    setDueDates(generatedDates)
  }

  function handleDueDate(date: Date) {
    moveItemToDate(session, _id, date)
    onDateSelect()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      e.stopPropagation() // Stop the event from opening expanded item
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="dark:text-muted">{title}</div>
      <Input
        value={inputDate}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        type="text"
        className="bg-transparent w-full border-none p-0 text-xl text-neutral-100 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <div className="w-full h-px bg-muted"></div>
      <div className="flex flex-col pt-3">
        {dueDates.map((date, index) => (
          <button
            className="w-full cursor-pointer hover:bg-neutral-800 p-2 rounded flex justify-between text-foreground"
            key={index}
            onClick={() => handleDueDate(date.dateObj)}
          >
            <p className="pointer-events-none">
              {date.formatted.split(":")[0]}
            </p>
            <p className="pointer-events-none text-muted">
              {date.formatted.split(":")[1]}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ScheduleItem
