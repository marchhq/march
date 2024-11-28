"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"

import { PlusIcon } from "@radix-ui/react-icons"
import { Layers } from "lucide-react"
import { useRouter } from "next/navigation"

import { NoteStackModal } from "./components/NoteModal/NotesModal"
import NoteDetails from "../header/note-details"
import TextEditor from "@/src/components/atoms/Editor"
import { useAuth } from "@/src/contexts/AuthContext"
import useEditorHook from "@/src/hooks/useEditor.hook"
import usePersistedState from "@/src/hooks/usePersistedState"
import { Note } from "@/src/lib/@types/Items/Note"
import useNotesStore from "@/src/lib/store/notes.store"
import { formatDateHeader, fromNow } from "@/src/utils/datetime"

interface Props {
  noteId: string
  spaceId: string
  blockId: string
}

const NotesPage: React.FC<Props> = ({ noteId, spaceId, blockId }) => {
  const { session } = useAuth()
  const router = useRouter()
  const { isFetched, notes, updateNote, addNote, saveNote, deleteNote } =
    useNotesStore()

  const [note, setNote] = useState<Note | null>(null)
  const [title, setTitle] = useState(note?.title ?? "")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const timeoutId = useRef<NodeJS.Timeout | null>(null)
  const [content, setContent] = useState(note?.description ?? "<p></p>")
  const [isSaved, setIsSaved] = useState(true)
  const editor = useEditorHook({ content, setContent, setIsSaved })
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [closeToggle, setCloseToggle] = usePersistedState("closeToggle", true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [isEditingTitle, setIsEditingTitle] = useState(false)

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }
    }
  }, [])

  const handleClose = () => setCloseToggle(!closeToggle)

  useEffect(() => {
    // Wait for data to be ready
    if (!isFetched) {
      editor?.setEditable(false)
      return
    }

    // Handle case where we're waiting for a new note to be created
    if (notes.length === 0) {
      editor?.setEditable(false)
      return
    }

    const currentNote = notes.find((n) => n._id === noteId)

    if (currentNote) {
      // Note exists - set it up
      editor?.setEditable(true)
      editor?.commands.setContent(currentNote.description)
      setNote(currentNote)
      setTitle(currentNote.title)
      setContent(currentNote.description)
      setNotFound(false)
    } else {
      // Note doesn't exist - redirect to first note
      // This handles the case when returning to a deleted note's URL
      const firstNote = notes[0]
      router.push(`/spaces/${spaceId}/blocks/${blockId}/items/${firstNote._id}`)
    }
  }, [isFetched, editor, notes, noteId, router, blockId, spaceId])

  useEffect(() => {
    if (note !== null && !loading && isInitialLoad) {
      if (!title || title.trim() === "") {
        textareaRef.current?.focus()
      } else {
        editor?.commands.focus()
      }
      setIsInitialLoad(false)
    }
  }, [note, loading, title, editor, isInitialLoad])

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [title])

  const saveNoteToServer = useCallback(
    async (note: Note): Promise<void> => {
      await saveNote(session, note)
    },
    [session, saveNote]
  )

  useEffect(() => {
    if (note && isSaved) {
      saveNoteToServer({ ...note, title, description: content })
    }
  }, [note, saveNoteToServer, isSaved])

  useEffect(() => {
    setIsSaved(false)

    if (note !== null) {
      updateNote({ ...note, title })
    }

    if (timeoutId.current) {
      clearTimeout(timeoutId.current)
    }

    timeoutId.current = setTimeout(() => {
      setIsSaved(true)
    }, 1000)
  }, [title])

  useEffect(() => {
    if (note !== null) {
      updateNote({ ...note, description: content })
    }
  }, [content])

  const addNewNote = async (): Promise<Note | null> => {
    if (!isSaved) {
      if (note) await saveNoteToServer({ ...note, title, description: content })
    }
    try {
      setLoading(true)
      const newNote = await addNote(session, "", "<p></p>")
      if (newNote !== null) {
        router.push(`/spaces/${spaceId}/blocks/${blockId}/items/${newNote._id}`)
        return newNote // Return the new note
      }
      return null
    } catch (error) {
      console.error(error)
      return null
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteNote = async (n: Note): Promise<void> => {
    if (!session || !n) return

    try {
      await deleteNote(session, n)
      const remainingNotes = notes.filter((n_) => n_._id !== n._id)

      if (n._id === note?._id) {
        if (remainingNotes.length <= 0) {
          const newNote = await addNewNote()
          // No need to redirect here since addNewNote already does the routing
        } else {
          router.push(
            `/spaces/${spaceId}/blocks/${blockId}/items/${remainingNotes[0]._id}`
          )
        }
      }
    } catch (error) {
      console.error("Error deleting note:", error)
    }
  }

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isSaved) {
        e.preventDefault()
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [isSaved])

  const handleTextareaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
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
  }

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

  return (
    <div className="flex size-full gap-16 bg-background p-10 pl-60">
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto pr-4">
        <div className="flex w-full items-center justify-between gap-4 text-sm text-secondary-foreground">
          <div className="flex w-full items-center justify-between">
            <div className="flex w-full items-center justify-end gap-4">
              {!loading ? (
                <button
                  onClick={addNewNote}
                  className="hover-bg flex items-center gap-1 truncate rounded-md px-1 text-secondary-foreground"
                >
                  <PlusIcon />
                </button>
              ) : (
                <div className="flex items-center gap-1 rounded-md px-1 text-secondary-foreground">
                  <span>loading...</span>
                </div>
              )}
              <button
                className={`hover-text flex items-center ${!closeToggle ? "text-foreground" : ""}`}
                onClick={handleClose}
              >
                <Layers size={16} />
              </button>
            </div>
          </div>
        </div>
        {note !== null ? (
          <div
            onBlur={() => {
              saveNoteToServer({ ...note, title, description: content })
            }}
          >
            <textarea
              ref={textareaRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleTextareaKeyDown}
              placeholder="Untitled"
              className="w-full resize-none overflow-hidden truncate whitespace-pre-wrap break-words bg-background py-2 text-[21px] font-bold text-foreground outline-none placeholder:text-secondary-foreground focus:outline-none"
              rows={1}
              /* eslint-disable-next-line jsx-a11y/no-autofocus */
              autoFocus={!title || title.trim() === ""}
              onFocus={() => setIsEditingTitle(true)}
              onBlur={() => setIsEditingTitle(false)}
            />
            <div className="ml-2 flex items-center gap-4 text-secondary-foreground">
              <NoteDetails
                createdAt={note.createdAt}
                updatedAt={note.updatedAt}
                formatDateHeader={formatDateHeader}
                fromNow={fromNow}
              />
            </div>
            <div className="mt-4 max-w-6xl text-foreground">
              <TextEditor editor={editor} />
            </div>
          </div>
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
