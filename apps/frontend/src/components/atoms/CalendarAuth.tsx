"use client"

import { Icon } from "@iconify-icon/react"

import useGoogleCalendarLogin from "@/src/hooks/useCalendar"

const CalendarAuth = (): JSX.Element => {
  const { handleLogin } = useGoogleCalendarLogin("/stack")

  return (
    <button
      onClick={handleLogin}
      className="hover-text flex w-fit items-center justify-center gap-2 bg-transparent p-1 font-semibold text-secondary-foreground"
    >
      <Icon icon="flat-color-icons:google" className="text-[20px]" />
      <span className="pr-1">authorize with google</span>
    </button>
  )
}

export default CalendarAuth
