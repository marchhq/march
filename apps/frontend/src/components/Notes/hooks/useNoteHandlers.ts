import { useCallback } from "react"

import { useRouter } from "next/navigation"

import { useAuth } from "@/src/contexts/AuthContext"
import type { Note } from "@/src/lib/@types/Items/Note"
import { useCreateNote, useUpdateNote } from "@/src/lib/queries/note.query"
import { useNoteStore } from "@/src/lib/store/note.store"

export const useNoteHandlers = (
  state: {
    note: Note | null
    title: string
    content: string
    isSaved: boolean
  },
  dispatch: React.Dispatch<any>,
  spaceId: string,
  blockId: string
) => {
  const { session } = useAuth()
  const router = useRouter()
  const { notes, setSelectedNoteId } = useNoteStore()

  // TanStack Query mutations
  const createNote = useCreateNote(session, spaceId, blockId)
  const updateNote = useUpdateNote(session, spaceId, blockId)

  const saveNoteToServer = useCallback(
    async (note: Note) => {
      if (!state.isSaved) {
        await updateNote.mutateAsync({
          noteId: note._id,
          title: note.title,
          description: note.description,
        })
        dispatch({ type: "SET_SAVED", payload: true })
      }
    },
    [updateNote, state.isSaved, dispatch]
  )

  const handleUpdateNote = useCallback(
    async (noteData: Note) => {
      dispatch({ type: "SET_SAVED", payload: false })
      setSelectedNoteId(noteData._id)
    },
    [dispatch, setSelectedNoteId]
  )

  const addNewNote = useCallback(async (): Promise<Note | null> => {
    if (!state.isSaved && state.note) {
      await saveNoteToServer({
        ...state.note,
        title: state.title,
        description: state.content,
      })
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const newNote = await createNote.mutateAsync({
        title: "",
        content: "<p></p>",
      })

      if (newNote) {
        router.push(`/spaces/${spaceId}/blocks/${blockId}/items/${newNote._id}`)
        setSelectedNoteId(newNote._id)
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
    state.isSaved,
    state.note,
    state.title,
    state.content,
    saveNoteToServer,
    createNote,
    router,
    dispatch,
    spaceId,
    blockId,
    setSelectedNoteId,
  ])

  return {
    saveNoteToServer,
    addNewNote,
    handleUpdateNote,
    isCreating: createNote.isPending,
    isUpdating: updateNote.isPending,
  }
}
