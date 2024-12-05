import { useCallback } from "react"

import { useRouter } from "next/navigation"

import { useAuth } from "@/src/contexts/AuthContext"
import { Note } from "@/src/lib/@types/Items/Note"
import useNotesStore from "@/src/lib/store/notes.store"

export const useNoteHandlers = (state, dispatch, spaceId, blockId) => {
  const { session } = useAuth()
  const router = useRouter()
  const { addNote, saveNote, updateNote, deleteNote, notes } = useNotesStore()
  const { note, title, content, isSaved } = state

  const saveNoteToServer = useCallback(
    async (note: Note): Promise<void> => {
      await saveNote(session, note)
    },
    [session, saveNote]
  )

  const handleUpdateNote = useCallback(
    async (noteData: Note) => {
      dispatch({ type: "SET_SAVED", payload: false })
      updateNote(noteData)
    },
    [updateNote, dispatch]
  )

  const addNewNote = useCallback(async (): Promise<Note | null> => {
    if (!isSaved && note) {
      await saveNoteToServer({ ...note, title, description: content })
    }
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const newNote = await addNote(session, "", "<p></p>")
      if (newNote !== null) {
        router.push(`/spaces/${spaceId}/blocks/${blockId}/items/${newNote._id}`)
        return newNote
      }
      return null
    } catch (error) {
      console.error(error)
      return null
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [
    isSaved,
    note,
    title,
    content,
    saveNoteToServer,
    session,
    addNote,
    router,
    dispatch,
    spaceId,
    blockId,
  ])

  const handleDeleteNote = useCallback(
    async (n: Note): Promise<void> => {
      if (!session || !n) return

      try {
        await deleteNote(session, n)
        const remainingNotes = notes.filter((n_) => n_._id !== n._id)

        if (n._id === note?._id) {
          if (remainingNotes.length <= 0) {
            await addNewNote()
          } else {
            router.push(
              `/spaces/${spaceId}/blocks/${blockId}/items/${remainingNotes[0]._id}`
            )
          }
        }
      } catch (error) {
        console.error("Error deleting note:", error)
      }
    },
    [session, deleteNote, notes, note, addNewNote, router, spaceId, blockId]
  )

  return {
    saveNoteToServer,
    addNewNote,
    handleDeleteNote,
    handleUpdateNote,
  }
}
