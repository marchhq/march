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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeMeeting = async () => {
      try {
        // Fetch single meeting first
        await fetchMeetByid(session, meetId)
        // Then fetch all meetings for the stack
        await fetchMeets(session)
      } finally {
        setLoading(false)
      }
    }

    if (session && meetId) {
      initializeMeeting()
    }
  }, [fetchMeets, fetchMeetByid, session, meetId])

  if (loading || !currentMeeting) {
    return <div>loading...</div>
  }

  return (
    <main className="flex h-full justify-between p-16 text-gray-color">
      <section>
        <MeetNotes meetData={currentMeeting} />
      </section>
      <section className="w-full max-w-[300px] text-sm text-secondary-foreground">
        <Stack meetings={meets} currentMeetId={meetId} />
      </section>
    </main>
  )
}

export default MeetingPage
