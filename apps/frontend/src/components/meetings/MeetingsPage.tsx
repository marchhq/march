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
  const { fetchMeets, meets } = useMeetsStore()
  const [currentMeet, setCurrentMeet] = useState<Meet | null>(null)

  useEffect(() => {
    fetchMeets(session)
  }, [fetchMeets, session])

  useEffect(() => {
    const current = meets.find((meet) => meet.id === meetId)
    setCurrentMeet(current || null)
  }, [meetId])

  if (meets.length === 0 || !currentMeet) {
    return <div>loading...</div>
  }

  return (
    <main className="flex h-full justify-between p-16 text-gray-color">
      <section>
        <MeetNotes meetData={currentMeet} />
      </section>
      <section className="w-full max-w-[300px] text-sm text-secondary-foreground">
        <Stack meetings={meets} currentMeetId={meetId} />
      </section>
    </main>
  )
}

export default MeetingPage
