"use client"

import { useEffect, useRef, useCallback, useMemo } from "react"

import { useLogSnag } from "@logsnag/next"
import debounce from "lodash/debounce"
import { usePathname } from "next/navigation"

import { useUserInfo } from "./useUserInfo"

export function useTrackUserInsights() {
  const { track } = useLogSnag()
  const pathname = usePathname()
  const { user } = useUserInfo()
  const userId = user?.userName || ""

  const startTimeRef = useRef<number | null>(null)
  const totalTimeRef = useRef<number>(0)
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isActiveRef = useRef(true)

  const logTimeSpent = useCallback(async () => {
    if (!isActiveRef.current) return

    const endTime = Date.now()
    if (startTimeRef.current) {
      try {
        totalTimeRef.current += endTime - startTimeRef.current
        startTimeRef.current = null

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
      } catch (error) {
        console.error("Failed to log time spent:", error)
      }
    }
  }, [track, pathname, userId])

  const handleInactivity = useCallback(() => {
    if (!isActiveRef.current) return

    track({
      channel: "user-activity",
      event: "Inactivity",
      description: `User became inactive on ${pathname}`,
      tags: { user: userId, page: pathname },
    })
  }, [track, pathname, userId])

  const handleActivity = useMemo(
    () =>
      debounce(() => {
        if (!isActiveRef.current) return

        if (inactivityTimeoutRef.current) {
          clearTimeout(inactivityTimeoutRef.current)
        }
        inactivityTimeoutRef.current = setTimeout(handleInactivity, 300000)
      }, 150),
    [handleInactivity]
  )

  const handleVisibilityChange = useCallback(() => {
    if (!isActiveRef.current) return

    if (document.visibilityState === "hidden") {
      logTimeSpent()
      track({
        channel: "user-activity",
        event: "Tab Left",
        description: `User left ${pathname}`,
        tags: { user: userId, page: pathname },
      })
    } else if (document.visibilityState === "visible") {
      startTimeRef.current = Date.now()
      track({
        channel: "user-activity",
        event: "Tab Returned",
        description: `User returned to ${pathname}`,
        tags: { user: userId, page: pathname },
      })
    }
  }, [logTimeSpent, track, pathname, userId])

  useEffect(() => {
    startTimeRef.current = Date.now()
    isActiveRef.current = true

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("mousemove", handleActivity)
    window.addEventListener("keydown", handleActivity)
    window.addEventListener("beforeunload", logTimeSpent)

    return () => {
      isActiveRef.current = false
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("mousemove", handleActivity)
      window.removeEventListener("keydown", handleActivity)
      window.removeEventListener("beforeunload", logTimeSpent)

      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current)
      }
      handleActivity.cancel()
    }
  }, [handleVisibilityChange, handleActivity, logTimeSpent])

  useEffect(() => {
    totalTimeRef.current = 0
    startTimeRef.current = Date.now()
  }, [pathname])
}
