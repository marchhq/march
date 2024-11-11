"use client"

import React, { useEffect, useCallback } from "react"

import { useRouter } from "next/navigation"

import { useAuth } from "@/src/contexts/AuthContext"
import useNotesStore from "@/src/lib/store/notes.store"

const NotesPage: React.FC = () => {
  const { session } = useAuth()
  const router = useRouter()
  const { notes, addNote, latestNote, fetchNotes, setIsFetched, isFetched } =
    useNotesStore()

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
      router.push(`/space/notes/${latestNote._id}`)
    }
  }, [latestNote, router])

  const addNewNote = useCallback(async (): Promise<void> => {
    try {
      const newNote = await addNote(session, "", "<p></p>")
      if (newNote !== null) {
        router.push(`/space/notes/${newNote._id}`)
      }
    } catch (error) {
      console.error(error)
    }
  }, [session, addNote, router])

  useEffect(() => {
    if (notes.length === 0) {
      addNewNote()
    }
  }, [notes, addNewNote])

  return (
    <div className="size-full overflow-auto bg-background p-16">
      <p className="text-secondary-foreground">loading...</p>
    </div>
  )
}

export default NotesPage
