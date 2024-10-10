"use client"

import { Icon } from "@iconify-icon/react"

import useGoogleCalendarLogin from "@/src/hooks/useCalendar"

const CalendarAuth = (): JSX.Element => {
  const handleConnect = useGoogleCalendarLogin("/stack")

  return (
    <button
      onClick={handleConnect}
      className="flex items-center justify-center gap-2 bg-transparent w-fit p-1 font-semibold text-secondary-foreground hover-text"
    >
      <Icon icon="ri:google-fill" className="text-[20px]" />
      <span className="pr-1">authorize with google</span>
    </button>
  )
}

export default CalendarAuth
