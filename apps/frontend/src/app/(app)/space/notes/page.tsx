"use client"

import React, { useEffect } from "react"

import { redirectNote } from "@/src/lib/server/actions/redirectNote"
import useNotesStore from "@/src/lib/store/notes.store"

const NotesPage: React.FC = () => {
  const { latestNote } = useNotesStore()

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
