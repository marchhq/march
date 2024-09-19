"use client"
import axios from "axios"
import { useRouter } from "next/navigation"

import { useAuth } from "@/src/contexts/AuthContext"
import { BACKEND_URL } from "@/src/lib/constants/urls"
import { GoogleColored } from "@/src/lib/icons/GoogleColored"

const CalendarAuth = (): JSX.Element => {
  return (
    <button className="flex w-96 items-center justify-center gap-x-6 rounded-2xl bg-transparent p-3 font-semibold text-gray-color hover:text-gray-100">
      <GoogleColored />
      Authorize with Google
    </button>
  )
}

export default CalendarAuth

export const ConnectCalendarBtn = (): JSX.Element => {
  const router = useRouter()
  const { session } = useAuth()

  const handleConnect = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/calendar/connect`, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
        withCredentials: true,
      })
      // router.push(response.data.authUrl)
      window.location.href = response.data.authUrl
    } catch (error) {
      return error
    }
  }

  return (
    <button
      onClick={handleConnect}
      className="rounded-md border border-gray-color p-1 text-sm hover:text-gray-100"
    >
      Connect
    </button>
  )
}
