"use client"

import { useEffect, useRef } from "react"

import { useLogSnag } from "@logsnag/next"
import { usePathname } from "next/navigation"

import { useUserInfo } from "./useUserInfo"

export function useTrackUserInsights() {
  const { track } = useLogSnag()
  const pathname = usePathname()
  const { user } = useUserInfo()

  const userId = user?.userName || ""
  const startTimeRef = useRef<number | null>(null) // Start time of the visit
  const totalTimeRef = useRef<number>(0) // Accumulated time on page
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const logTimeSpent = async () => {
    const endTime = Date.now()
    if (startTimeRef.current) {
      totalTimeRef.current += endTime - startTimeRef.current
      startTimeRef.current = null // Reset start time

      // Log time spent
      await track({
        channel: "user-activity",
        event: "Time Spent",
        description: `User spent ${Math.round(totalTimeRef.current / 1000)} seconds on ${pathname}`,
        tags: {
          user: userId || "",
          page: pathname,
          time_spent: `${Math.round(totalTimeRef.current / 1000)}s`,
        },
      })
    }
  }

  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      logTimeSpent() // Log time spent when the user leaves the tab
      track({
        channel: "user-activity",
        event: "Tab Left",
        description: `User left ${pathname}`,
        tags: { user: userId, page: pathname },
      })
    } else if (document.visibilityState === "visible") {
      startTimeRef.current = Date.now() // Resume tracking time when they return
      track({
        channel: "user-activity",
        event: "Tab Returned",
        description: `User returned to ${pathname}`,
        tags: { user: userId, page: pathname },
      })
    }
  }

  const handleInactivity = () => {
    track({
      channel: "user-activity",
      event: "Inactivity",
      description: `User became inactive on ${pathname}`,
      tags: { user: userId, page: pathname },
    })
  }

  const handleActivity = () => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current)
    }

    inactivityTimeoutRef.current = setTimeout(() => {
      handleInactivity()
    }, 300000) // 5 minutes of inactivity
  }

  useEffect(() => {
    // Track time spent on page
    startTimeRef.current = Date.now()

    // visibility change listeners
    document.addEventListener("visibilitychange", handleVisibilityChange)

    // inactivity listeners
    window.addEventListener("mousemove", handleActivity)
    window.addEventListener("keydown", handleActivity)

    // Handle page unload (e.g., refresh or close tab)
    const handlePageUnload = () => logTimeSpent()
    window.addEventListener("beforeunload", handlePageUnload)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("mousemove", handleActivity)
      window.removeEventListener("keydown", handleActivity)
      window.removeEventListener("beforeunload", handlePageUnload)

      // Clear inactivity timeout
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current)
      }
    }
  }, [pathname, userId, track])

  useEffect(() => {
    // Reset timers on route change
    totalTimeRef.current = 0
    startTimeRef.current = Date.now()
  }, [pathname])
}
