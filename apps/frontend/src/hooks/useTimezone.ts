"use client"

import { useState, useEffect } from "react"

export const useTimezone = () => {
  const [timezone, setTimezone] = useState<string | null>(null)

  useEffect(() => {
    const cookieTimezone = document.cookie
      .split("; ")
      .find((row) => row.startsWith("USER_TIMEZONE="))
      ?.split("=")[1]

    if (cookieTimezone) {
      // Decode the cookie value when retrieving
      const decodedTimezone = decodeURIComponent(
        decodeURIComponent(cookieTimezone)
      )
      setTimezone(decodedTimezone)
      return
    }

    // Fallback to system timezone
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])

  return timezone
}
