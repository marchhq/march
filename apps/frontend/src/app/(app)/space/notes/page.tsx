"use client"

import React, { useEffect, useCallback } from "react"

import { useAuth } from "@/src/contexts/AuthContext"
import { redirectNote } from "@/src/lib/server/actions/redirectNote"
import useNotesStore from "@/src/lib/store/notes.store"

const NotesPage: React.FC = () => {
  const { session } = useAuth()
  const { latestNote, fetchNotes, setIsFetched, isFetched } = useNotesStore()

  const fetchTheNotes = useCallback(async (): Promise<void> => {
    try {
      await fetchNotes(session)
      setIsFetched(true)
    } catch (error) {
      setIsFetched(false)
    }
  }, [session, fetchNotes, setIsFetched])

  useEffect(() => {
    if (!isFetched) {
      fetchTheNotes()
    }
  }, [fetchTheNotes, isFetched])

  useEffect(() => {
    if (latestNote) {
      redirectNote(latestNote._id)
    }
  }, [latestNote])

  return (
    <div className="size-full overflow-auto bg-background p-16">
      <p className="text-secondary-foreground">loading...</p>
    </div>
  )
}

export default NotesPage
