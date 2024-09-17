"use client"

import React, { useState } from "react"

import { Switch } from "./Switch"

export const TimeZoneOnboard = (): JSX.Element => {
  const [format, setFormat] = useState(false)

  const getCurrentTime = (): string => {
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: !format, // Toggle between 12-hour and 24-hour format
    }
    return new Intl.DateTimeFormat("en-US", options).format(now)
  }

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col space-y-8 text-black">
        <div className="flex items-center">
          <h1 className="ml-32 mr-64 w-64 text-left text-xl">Time zone</h1>
          <div className="w-72 rounded-lg bg-[#F7F5F8] p-4 text-left text-xl">
            Asia/Calcutta
          </div>
        </div>
        <div className="flex items-center">
          <h1 className="ml-32 mr-64 w-64 text-left text-xl">
            First day of the week
          </h1>
          <div className="w-72 rounded-lg bg-[#F7F5F8] p-4 text-left text-xl">
            Sunday
          </div>
        </div>
        <div className="flex items-center">
          <h1 className="ml-32 mr-64 w-64 text-left text-xl">
            Regional format
          </h1>
          <div className="w-72 rounded-lg bg-[#F7F5F8] p-4 text-left text-xl">
            English (United States)
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <div className="flex flex-col items-end space-y-2">
          <p className="text-xl">{getCurrentTime()}</p>
          <Switch
            checked={format}
            onCheckedChange={() => {
              setFormat(!format)
            }}
          />
        </div>
      </div>
    </div>
  )
}
