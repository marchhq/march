"use client"

import { useEffect, useState } from "react"

import { AxiosError } from "axios"
import { useRouter } from "next/navigation"

import { useAuth } from "@/src/contexts/AuthContext"
import { Meet } from "@/src/lib/@types/Items/Meet"
import useMeetsStore, { MeetsStoreType } from "@/src/lib/store/meets.store"
import useUserStore from "@/src/lib/store/user.store"

export default function InitialMeetings() {
  const { session } = useAuth()
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const fetchLatestMeet = useMeetsStore(
    (state: MeetsStoreType) => state.fetchLatestMeet
  )

  const { user } = useUserStore()

  useEffect(() => {
    const getMeetId = async () => {
      try {
        if (!user?.integrations?.googleCalendar?.connected) {
          setLoading(false)
          return
        }

        const meet: Meet | null = await fetchLatestMeet(session)

        if (meet && meet._id) {
          router.push(`/space/meetings/${meet._id}`)
        } else {
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
  }, [
    fetchLatestMeet,
    session,
    router,
    user?.integrations?.googleCalendar?.connected,
  ])

  return (
    <>
      {loading && <p>loading...</p>}
      {!loading && (
        <section className="size-full overflow-auto bg-background px-8 py-16">
          <p className="text-secondary-foreground">
            Please connect your calendar.
          </p>
        </section>
      )}
    </>
  )
}
