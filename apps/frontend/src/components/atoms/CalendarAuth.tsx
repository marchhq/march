"use client"

import useGoogleCalendarLogin from "@/src/hooks/useCalendar"
import { GoogleColored } from "@/src/lib/icons/GoogleColored"

const CalendarAuth = (): JSX.Element => {
  const handleConnect = useGoogleCalendarLogin('/stack');
  return (
    <button
      onClick={handleConnect}
      className="flex w-96 items-center justify-center gap-x-6 rounded-2xl bg-transparent p-3 font-semibold text-gray-color hover:text-gray-100">
      <GoogleColored />
      Authorize with Google
    </button>
  )
}

export default CalendarAuth

