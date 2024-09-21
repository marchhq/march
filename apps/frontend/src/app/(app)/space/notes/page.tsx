"use client"

import React, { useEffect, useState } from "react"

import { useAuth } from "@/src/contexts/AuthContext"
import { redirectNote } from "@/src/lib/server/actions/redirectNote"
import useNotesStore from "@/src/lib/store/notes.store"

const navLinkClassName =
  "flex items-center gap-2 text-secondary-foreground cursor-pointer hover-text"

const NotesPage: React.FC = () => {
  const { session } = useAuth()

  const [loading, setLoading] = useState(false)
  const [latestNoteId, setLatestNoteId] = useState<string>("")
  const [isFetched, setIsFetched] = useState(false)

  const { getLatestNote, addNote } = useNotesStore()

  const getNoteId = async (): Promise<string | null> => {
    try {
      const note = await getLatestNote(session)
      if (note) {
        setLatestNoteId(note.uuid)
        setIsFetched(true)
      }
      return note?.uuid || ""
    } catch (error) {
      console.error(error)
      setIsFetched(false)
      return null
    }
  }

  useEffect(() => {
    getNoteId()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isFetched) {
      if (latestNoteId) {
        redirectNote(latestNoteId)
      } else {
        addFirstNote()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetched, latestNoteId])

  const addFirstNote = async (): Promise<void> => {
    try {
      setLoading(true)
      const newNote = await addNote(session, "", "<p></p>")
      if (newNote !== null) {
        redirectNote(newNote.uuid)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full">
      {loading && (
        <div className={navLinkClassName}>
          <p>loading...</p>
        </div>
      )}
    </div>
  )
}

export default NotesPage
