"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"

import { MeetNotes } from "./MeetNotes"
import { useMeetState } from "./useMeetState"
import ActionHeader from "../header/action-header"
import { StackModal } from "../modals/StackModal"
import { useAuth } from "@/src/contexts/AuthContext"
import usePersistedState from "@/src/hooks/usePersistedState"
import { useMeetsStore } from "@/src/lib/store/meets.store"

interface MeetingPageProps {
  meetId: string
  spaceId: string
  blockId: string
}

const MeetingPage: React.FC<MeetingPageProps> = ({
  meetId,
  spaceId,
  blockId,
}) => {
  const { session } = useAuth()
  const { fetchMeets, meets, fetchMeetByid } = useMeetsStore()
  const [closeToggle, setCloseToggle] = usePersistedState("closeToggle", true)
  const { state, setLoading, setIsInitialLoad } = useMeetState()
  const { isLoading } = state

  const handleClose = useCallback(() => {
    setCloseToggle(!closeToggle)
  }, [closeToggle, setCloseToggle])

  useEffect(() => {
    let mounted = true

    const initialize = async () => {
      if (!session || !meetId) return

      setLoading(true)
      try {
        // Fetch meets list if needed
        if (meets.length === 0) {
          await fetchMeets(session)
        }
        // Fetch specific meet
        await fetchMeetByid(session, meetId)
      } finally {
        if (mounted) {
          setLoading(false)
          setIsInitialLoad(false)
        }
      }
    }

    initialize()
    return () => {
      mounted = false
    }
  }, [session, meetId])

  const simplifiedNotes = useMemo(() => {
    return meets
      ? meets.map((m) => ({
          id: m.id,
          title: m.title || "Untitled",
          href: `/spaces/${spaceId}/blocks/${blockId}/items/${m.id}`,
          createdAt: m.createdAt,
          isActive: m.id === meetId,
        }))
      : []
  }, [meets, spaceId, blockId, meetId])

  if (isLoading && meets.length === 0) {
    return <div>loading...</div>
  }

  const displayMeeting = meets.find((m) => m.id === meetId)

  return (
    <main className="flex size-full gap-16 bg-background">
      <section className="flex flex-1 flex-col gap-2 overflow-y-auto pr-4">
        {displayMeeting && (
          <MeetNotes key={displayMeeting.id} meetData={displayMeeting} />
        )}
      </section>

      <section>
        {!closeToggle && (
          <StackModal notes={simplifiedNotes} handleClose={handleClose} />
        )}
      </section>
    </main>
  )
}

export default MeetingPage
