"use client"
import React, { useState, useEffect } from "react"

import { SelectBox } from "./Select"
import { Switch } from "./Switch"
import { useUserInfo } from "@/src/hooks/useUserInfo"

export const PreferenceBox = (): JSX.Element => {
  const [is24HourFormat, setIs24HourFormat] = useState(false)
  const [currentDateTime, setCurrentDateTime] = useState(new Date())

  const user = useUserInfo()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: user?.timezone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: !is24HourFormat,
    }

    return date.toLocaleString("en-US", options)
  }

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col space-y-4 text-lg">
        <div className="flex justify-between">
          <p>Time Zone</p>
          <SelectBox placeholder="Asia/Calcutta" item="Asia/Calcutta" />
        </div>
        <div className="flex justify-between">
          <p>First day of the week</p>
          <SelectBox placeholder="Sunday" item="Sunday" item2="Monday" />
        </div>
        <div className="flex justify-between">
          <p>Regional format</p>
          <SelectBox
            placeholder="English (United States)"
            item="English (United States)"
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-end space-y-4 text-sm">
        <p>{formatDate(currentDateTime)}</p>
        <div className="flex  items-center gap-2">
          <span>{is24HourFormat ? "24-hour format" : "12-hour format"}</span>
          <Switch
            checked={is24HourFormat}
            onCheckedChange={(checked) => setIs24HourFormat(checked)}
          />
        </div>
      </div>
    </div>
  )
}
