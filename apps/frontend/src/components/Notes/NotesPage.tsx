"use client"

import { useRef, useCallback, useMemo, useEffect } from "react"

import { useRouter } from "next/navigation"

import NoteEditor from "./components/NoteEditor/NoteEditor"
import NoteHeader from "./components/NoteHeader/NoteHeader"
import { NoteStackModal } from "./components/NoteModal/NotesModal"
import { useNoteEffects } from "./hooks/useNoteEffects"
import { useNoteHandlers } from "./hooks/useNoteHandlers"
import { useNoteState } from "./hooks/useNoteState"
import useEditorHook from "@/src/hooks/useEditor.hook"
import usePersistedState from "@/src/hooks/usePersistedState"
import useNotesStore from "@/src/lib/store/notes.store"

interface Props {
  noteId: string
  spaceId: string
  blockId: string
}

const NotesPage: React.FC<Props> = ({ noteId, spaceId, blockId }) => {
  const router = useRouter()
  const { isFetched, notes } = useNotesStore()

  const { state, dispatch, setTitle, setContent, setIsSaved } = useNoteState()

  const { note, title, content, loading, notFound } = state

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const editor = useEditorHook({ content, setContent, setIsSaved })
  const [closeToggle, setCloseToggle] = usePersistedState("closeToggle", true)

  const { saveNoteToServer, addNewNote, handleUpdateNote } = useNoteHandlers(
    state,
    dispatch,
    spaceId,
    blockId
  )

  useNoteEffects(
    state,
    dispatch,
    editor,
    saveNoteToServer,
    notes,
    isFetched,
    noteId,
    router,
    spaceId,
    blockId,
    textareaRef,
    handleUpdateNote
  )

  const handleClose = useCallback(() => {
    setCloseToggle(!closeToggle)
  }, [closeToggle, setCloseToggle])

  const handleTextareaKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter") {
        e.preventDefault()

        if (e.shiftKey) {
          const textarea = e.currentTarget
          const cursorPosition = textarea.selectionStart
          const newValue =
            title.slice(0, cursorPosition) + "\n" + title.slice(cursorPosition)

          setTitle(newValue)

          requestAnimationFrame(() => {
            textarea.selectionStart = cursorPosition + 1
            textarea.selectionEnd = cursorPosition + 1
          })
        } else {
          editor?.commands.focus()
          editor?.commands.setTextSelection(0)
        }
      }
    },
    [editor, title, setTitle]
  )

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newTitle = e.target.value
      setTitle(newTitle)
    },
    [setTitle]
  )

  const handleTitleFocus = useCallback(() => {
    dispatch({ type: "SET_EDITING_TITLE", payload: true })
  }, [dispatch])

  const handleTitleBlur = useCallback(() => {
    dispatch({ type: "SET_EDITING_TITLE", payload: false })
  }, [dispatch])

  const simplifiedNotes = useMemo(() => {
    return notes
      ? notes.map((n) => ({
          id: n._id,
          title: n.title || "Untitled",
          href: `/spaces/${spaceId}/blocks/${blockId}/items/${n._id}`,
          createdAt: n.createdAt,
          isActive: n._id === note?._id,
        }))
      : []
  }, [notes, spaceId, blockId, note])

  const handleSaveNote = useCallback(() => {
    if (note) {
      saveNoteToServer({ ...note, title, description: content })
    }
  }, [note, title, content, saveNoteToServer])

  return (
    <div className="flex size-full gap-16 bg-background p-10 pl-60">
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto pr-4">
        <div className="flex w-full items-center justify-between gap-4 text-sm text-secondary-foreground">
          <div className="flex w-full items-center justify-between">
            <NoteHeader
              closeToggle={closeToggle}
              loading={loading}
              addNewNote={addNewNote}
              handleClose={handleClose}
            />
          </div>
        </div>

        {note !== null ? (
          <NoteEditor
            note={note}
            title={title}
            editor={editor}
            handleTitleChange={handleTitleChange}
            handleTextareaKeyDown={handleTextareaKeyDown}
            handleTitleFocus={handleTitleFocus}
            handleTitleBlur={handleTitleBlur}
            handleSaveNote={handleSaveNote}
            textareaRef={textareaRef}
          />
        ) : notFound ? (
          <div className="mt-4 text-secondary-foreground">
            <p>note not found</p>
          </div>
        ) : (
          <div className="mt-4 text-secondary-foreground">
            <p>loading...</p>
          </div>
        )}
      </div>

      <div>
        {!closeToggle && (
          <NoteStackModal notes={simplifiedNotes} handleClose={handleClose} />
        )}
      </div>
    </div>
  )
}

export default NotesPage
