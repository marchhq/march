"use client"

import { useEffect, useState } from "react"

import { AxiosError } from "axios"
import { useRouter } from "next/navigation"

import { useAuth } from "@/src/contexts/AuthContext"
import { isIntegrationConnected } from "@/src/lib/@types/auth/user"
import { Meet } from "@/src/lib/@types/Items/Meet"
import useMeetsStore, { MeetsStoreType } from "@/src/lib/store/meets.store"
import useUserStore from "@/src/lib/store/user.store"

export default function InitialMeetings() {
  const { session } = useAuth()
  const [loading, setLoading] = useState(true)
  const [hasMeetings, setHasMeetings] = useState<boolean | null>(null)
  const router = useRouter()
  const fetchLatestMeet = useMeetsStore(
    (state: MeetsStoreType) => state.fetchLatestMeet
  )
  const { user, isLoading: userLoading, fetchUser } = useUserStore()

  const isLoading = loading || userLoading
  const isCalendarConnected = isIntegrationConnected(user, "googleCalendar")

  useEffect(() => {
    if (!user && session && !userLoading) {
      fetchUser(session)
    }
  }, [user, session, userLoading, fetchUser])

  useEffect(() => {
    const getMeetId = async () => {
      try {
        if (!user || userLoading) {
          return
        }

        if (!isCalendarConnected) {
          setLoading(false)
          return
        }

        const meet: Meet | null = await fetchLatestMeet(session)

        if (meet && meet._id) {
          router.push(`/space/meetings/${meet._id}`)
        } else {
          setHasMeetings(false)
          setLoading(false)
        }
      } catch (error) {
        const e = error as AxiosError
        console.error(e.cause)
        setLoading(false)
      }
    }

    if (session) {
      getMeetId()
    } else {
      setLoading(false)
    }
  }, [fetchLatestMeet, session, router, isCalendarConnected, userLoading, user])

  if (isLoading) {
    return <p>loading...</p>
  }

  // Only show calendar connection message when we have user data
  if (user && !isCalendarConnected) {
    return (
      <section className="size-full overflow-auto bg-background px-8 py-16">
        <p className="text-secondary-foreground">
          Please connect your calendar.
        </p>
      </section>
    )
  }

  // Only show no meetings when we have user data and calendar is connected
  if (user && isCalendarConnected && hasMeetings === false) {
    return (
      <section className="size-full overflow-auto bg-background px-8 py-16">
        <p className="text-secondary-foreground">No meetings found.</p>
      </section>
    )
  }

  // Show loading while waiting for user data
  return <p>loading...</p>
}
