"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"

import { MeetNotes } from "./MeetNotes"
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
  const { fetchMeets, meets, fetchMeetByid, currentMeeting } = useMeetsStore()
  const [initialLoading, setInitialLoading] = useState(true)
  const [closeToggle, setCloseToggle] = usePersistedState("closeToggle", true)

  const handleClose = useCallback(() => {
    setCloseToggle(!closeToggle)
  }, [closeToggle, setCloseToggle])

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

  if (initialLoading && meets.length === 0) {
    return <div>loading...</div>
  }

  const displayMeeting = currentMeeting || meets.find((m) => m.id === meetId)

  return (
    <main className="flex size-full gap-16 bg-background p-10 pl-60">
      <section className="flex flex-1 flex-col gap-2 overflow-y-auto pr-4">
        <div className="flex w-full items-center justify-between gap-4 text-sm text-secondary-foreground">
          <div className="flex w-full items-center justify-between">
            <ActionHeader closeToggle={closeToggle} onClose={handleClose} />
          </div>
        </div>

        {displayMeeting && <MeetNotes meetData={displayMeeting} />}
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
