"use client"

import React, { useEffect, useState } from "react"

import { MeetNotes } from "./MeetNotes"
import { Stack } from "./Stack"
import { useAuth } from "@/src/contexts/AuthContext"
import { Meet } from "@/src/lib/@types/Items/Meet"
import { useMeetsStore } from "@/src/lib/store/meets.store"

interface MeetingPageProps {
  meetId: string
}

const MeetingPage: React.FC<MeetingPageProps> = ({ meetId }) => {
  const { session } = useAuth()
  const { fetchMeets, meets, fetchMeetByid, currentMeeting } = useMeetsStore()
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const initializeMeeting = async () => {
      if (meets.length === 0) {
        setInitialLoading(true)
      }

      try {
        await Promise.all([
          !currentMeeting || currentMeeting.id !== meetId
            ? fetchMeetByid(session, meetId)
            : Promise.resolve(),
          meets.length === 0 ? fetchMeets(session) : Promise.resolve(),
        ])
      } finally {
        setInitialLoading(false)
      }
    }

    if (session && meetId) {
      initializeMeeting()
    }
  }, [fetchMeets, fetchMeetByid, session, meetId, currentMeeting, meets])

  if (initialLoading && meets.length === 0) {
    return <div>loading...</div>
  }

  const displayMeeting = currentMeeting || meets.find((m) => m.id === meetId)

  return (
    <main className="flex h-full justify-between p-10 text-gray-color">
      <section>
        {displayMeeting && <MeetNotes meetData={displayMeeting} />}
      </section>
      <section className="w-full max-w-[300px] text-[16px] text-secondary-foreground">
        <Stack meetings={meets} currentMeetId={meetId} />
      </section>
    </main>
  )
}

export default MeetingPage
