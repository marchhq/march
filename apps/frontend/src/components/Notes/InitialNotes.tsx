"use client"

import React, { useEffect, useCallback } from "react"

import { useRouter } from "next/navigation"

import { useAuth } from "@/src/contexts/AuthContext"
import useNotesStore from "@/src/lib/store/notes.store"

interface InitialNotesProps {
  spaceId: string
  blockId: string
}

const InitialNotes: React.FC<InitialNotesProps> = ({ spaceId, blockId }) => {
  const { session } = useAuth()
  const router = useRouter()
  const { notes, addNote, latestNote, fetchNotes, setIsFetched, isFetched } =
    useNotesStore()

  const fetchTheNotes = useCallback(async (): Promise<void> => {
    try {
      await fetchNotes(session, spaceId, blockId)
      setIsFetched(true)
    } catch (error) {
      setIsFetched(false)
    }
  }, [session, fetchNotes, setIsFetched, spaceId, blockId])

  useEffect(() => {
    if (!isFetched) {
      fetchTheNotes()
    }
  }, [fetchTheNotes, isFetched])

  useEffect(() => {
    if (latestNote) {
      router.push(
        `/spaces/${spaceId}/blocks/${blockId}/items/${latestNote._id}`
      )
    }
  }, [latestNote, router, blockId, spaceId])

  const addNewNote = useCallback(async (): Promise<void> => {
    try {
      const newNote = await addNote(session, "", "<p></p>")
      if (newNote !== null) {
        router.push(`/spaces/${spaceId}/blocks/${blockId}/items/${newNote._id}`)
      }
    } catch (error) {
      console.error(error)
    }
  }, [session, addNote, router, spaceId, blockId])

  useEffect(() => {
    if (notes.length === 0) {
      addNewNote()
    }
  }, [notes, addNewNote])

  return (
    <div className="size-full overflow-auto bg-background">
      <p className="text-secondary-foreground">loading...</p>
    </div>
  )
}

export default InitialNotes
