"use client"
import type { JSX } from "react"

import { Icon } from "@iconify-icon/react"

import { Button } from "../button/Button"
import useGoogleCalendarLogin from "@/src/hooks/useCalendar"

const CalendarLogin = (): JSX.Element => {
  const { handleLogin } = useGoogleCalendarLogin("/stack")

  return (
    <Button onClick={handleLogin}>
      <Icon icon="flat-color-icons:google" className="text-[14px]" />
      <span className="pr-1">Authorize with google</span>
    </Button>
  )
}

export default CalendarLogin
