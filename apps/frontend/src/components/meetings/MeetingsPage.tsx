"use client"

import React, { useEffect, useState } from "react"
import { MeetNotes } from "./MeetNotes"
import { Stack } from "./Stack"
import useMeetsStore, { MeetsStoreType } from "@/src/lib/store/meets.store"
import { useAuth } from "@/src/contexts/AuthContext"
import { Meet } from "@/src/lib/@types/Items/Meet"
import { getCurrentWeekMeets } from "@/src/utils/meet"

interface MeetingPageProps {
  meetId: string
}

const MeetingPage: React.FC<MeetingPageProps> = ({ meetId }) => {
  const { session } = useAuth()
  const fetchUpcomingMeets = useMeetsStore(
    (state: MeetsStoreType) => state.fetchUpcomingMeets
  )
  const upcomingMeets = useMeetsStore(
    (state: MeetsStoreType) => state.upcomingMeetings
  )
  const [currentWeekMeets, setCurrentWeekMeets] = useState<Meet[]>([])
  const [currentMeet, setCurrentMeet] = useState<Meet | null>(null)

  useEffect(() => {
    fetchUpcomingMeets(session)
  }, [fetchUpcomingMeets, session])

  useEffect(() => {
    const meets = getCurrentWeekMeets(upcomingMeets)
    setCurrentWeekMeets(meets)
    const current = meets.find((meet) => meet._id === meetId)
    setCurrentMeet(current || null)
  }, [upcomingMeets, meetId])

  if (currentWeekMeets.length === 0 || !currentMeet) {
    return <div>loading...</div>
  }

  return (
    <main className="p-16 h-full text-gray-color flex justify-between">
      <section>
        <MeetNotes meetData={currentMeet} />
      </section>
      <section className="max-w-[200px] text-sm w-full text-secondary-foreground">
        <Stack currentWeekMeets={currentWeekMeets} currentMeetId={meetId} />
      </section>
    </main>
  )
}

export default MeetingPage
