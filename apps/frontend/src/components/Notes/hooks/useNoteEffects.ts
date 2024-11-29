import { useEffect, useMemo } from "react"

import { Editor } from "@tiptap/react"
import { debounce } from "lodash"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

import { NoteState } from "../reducers/notesReducer"
import { Note } from "@/src/lib/@types/Items/Note"

interface NoteDispatch {
  type: string
  payload: any
}

export const useNoteEffects = (
  state: NoteState,
  dispatch: (action: NoteDispatch) => void,
  editor: Editor | null,
  saveNoteToServer: (note: Note) => Promise<void>,
  notes: Note[],
  isFetched: boolean,
  noteId: string,
  router: AppRouterInstance,
  spaceId: string,
  blockId: string,
  textareaRef: React.RefObject<HTMLTextAreaElement>,
  handleUpdateNote: (note: Note) => void
) => {
  const { note, title, content, loading, isInitialLoad, isSaved } = state

  const debouncedSaveNote = useMemo(
    () =>
      debounce((noteData: Note) => {
        saveNoteToServer(noteData)
        dispatch({ type: "SET_SAVED", payload: true })
      }, 1000),
    [saveNoteToServer]
  )

  const debouncedUpdateNote = useMemo(
    () =>
      debounce((noteData: Note) => {
        handleUpdateNote(noteData)
        dispatch({ type: "SET_SAVED", payload: true })
      }, 1000),
    [handleUpdateNote]
  )

  // Handle initial note loading and editor setup
  useEffect(() => {
    if (!isFetched) {
      editor?.setEditable(false)
      return
    }

    if (notes.length === 0) {
      editor?.setEditable(false)
      return
    }

    const currentNote = notes.find((n) => n._id === noteId)

    if (currentNote) {
      editor?.setEditable(true)
      editor?.commands.setContent(currentNote.description)
      dispatch({ type: "SET_NOTE", payload: currentNote })
      dispatch({ type: "SET_TITLE", payload: currentNote.title })
      dispatch({ type: "SET_CONTENT", payload: currentNote.description })
      dispatch({ type: "SET_NOT_FOUND", payload: false })
    } else {
      const firstNote = notes[0]
      router.push(`/spaces/${spaceId}/blocks/${blockId}/items/${firstNote._id}`)
    }
  }, [isFetched, editor, notes, noteId, router, blockId, spaceId])

  // Handle initial focus
  useEffect(() => {
    if (note !== null && !loading && isInitialLoad) {
      if (!title || title.trim() === "") {
        textareaRef.current?.focus()
      } else {
        editor?.commands.focus()
      }
      dispatch({ type: "SET_INITIAL_LOAD", payload: false })
    }
  }, [note, loading, title, editor, isInitialLoad])

  // Auto-save effect
  useEffect(() => {
    if (note && isSaved) {
      debouncedSaveNote({ ...note, title, description: content })
    }
  }, [note, isSaved, title, content, debouncedSaveNote])

  // Unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isSaved) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [isSaved])

  // Title update effect
  useEffect(() => {
    if (note !== null) {
      dispatch({ type: "SET_SAVED", payload: false })
      debouncedUpdateNote({ ...note, title })
    }
  }, [title, note, debouncedUpdateNote])

  // Content update effect
  useEffect(() => {
    if (note !== null) {
      dispatch({ type: "SET_SAVED", payload: false })
      debouncedUpdateNote({ ...note, description: content })
    }
  }, [content, note, debouncedUpdateNote])

  // Cleanup debounced functions
  useEffect(() => {
    return () => {
      debouncedSaveNote.cancel()
      debouncedUpdateNote.cancel()
    }
  }, [debouncedSaveNote, debouncedUpdateNote])

  // Handle textarea height
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [title])
}
