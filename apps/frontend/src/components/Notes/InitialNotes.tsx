"use client"

import React, { useEffect, useCallback } from "react"

import { useRouter } from "next/navigation"

import { useAuth } from "@/src/contexts/AuthContext"
import { useCreateNote, useNotes } from "@/src/lib/queries/note.query"
import { useNoteStore } from "@/src/lib/store/note.store"

interface InitialNotesProps {
  spaceId: string
  blockId: string
}

const InitialNotes: React.FC<InitialNotesProps> = ({ spaceId, blockId }) => {
  const { session } = useAuth()
  const router = useRouter()
  const { notes, setSelectedNoteId, setCurrentNote } = useNoteStore()

  const { data, isLoading } = useNotes(session, spaceId, blockId)

  const createNote = useCreateNote(session, spaceId, blockId)

  // Separate useEffect for handling redirection
  useEffect(() => {
    if (notes && notes.length > 0) {
      const latestNote = notes[0] // Already sorted in useNotes
      router.push(
        `/spaces/${spaceId}/blocks/${blockId}/items/${latestNote._id}`
      )
      setSelectedNoteId(latestNote._id)
      setCurrentNote(latestNote)
    }
  }, [notes, router, spaceId, blockId, setSelectedNoteId, setCurrentNote])

  const addNewNote = useCallback(async () => {
    try {
      const newNote = await createNote.mutateAsync({
        title: "",
        content: "<p></p>",
      })

      if (newNote) {
        router.push(`/spaces/${spaceId}/blocks/${blockId}/items/${newNote._id}`)
      }
    } catch (error) {
      console.error("Error creating new note:", error)
    }
  }, [createNote, router, spaceId, blockId])

  useEffect(() => {
    if (!isLoading && notes && notes.length === 0) {
      console.log("No notes found, creating new note") // Debug log
      addNewNote()
    }
  }, [isLoading, notes, addNewNote])

  return (
    <div className="size-full overflow-auto bg-background p-16">
      <p className="text-secondary-foreground">loading...</p>
    </div>
  )
}

export default InitialNotes
