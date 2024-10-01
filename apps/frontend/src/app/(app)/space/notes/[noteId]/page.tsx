"use client"

import { useState, useRef, useEffect, useCallback } from "react"

import { Icon } from "@iconify-icon/react/dist/iconify.mjs"
import { PlusIcon } from "@radix-ui/react-icons"
import Link from "next/link"

import TextEditor from "@/src/components/atoms/Editor"
import { useAuth } from "@/src/contexts/AuthContext"
import useEditorHook from "@/src/hooks/useEditor.hook"
import { type Note } from "@/src/lib/@types/Items/Note"
import { redirectNote } from "@/src/lib/server/actions/redirectNote"
import useNotesStore from "@/src/lib/store/notes.store"
import classNames from "@/src/utils/classNames"
import { formatDateYear, fromNow } from "@/src/utils/datetime"

const NotesPage: React.FC = ({ params }: { params: { noteId: string } }) => {
  const { session } = useAuth()
  const {
    isFetched,
    setIsFetched,
    fetchNotes,
    notes,
    updateNote,
    addNote,
    saveNote,
    deleteNote,
  } = useNotesStore()

  const [note, setNote] = useState<Note | null>(null)
  const [title, setTitle] = useState(note?.title ?? "")
  const [savedTitle, setSavedTitle] = useState(note?.title ?? "")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const timeoutId = useRef<NodeJS.Timeout | null>(null)
  const [content, setContent] = useState(note?.description ?? "<p></p>")
  const [savedContent, setSavedContent] = useState(
    note?.description ?? "<p></p>"
  )
  const [isSaved, setIsSaved] = useState(true)
  const editor = useEditorHook({ content, setContent, setIsSaved })
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [closeToggle, setCloseToggle] = useState(false)

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
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }
    }
  }, [])

  const handleClose = () => setCloseToggle(!closeToggle)

  useEffect(() => {
    if (!isFetched || notes.length === 0) {
      editor?.setEditable(false)
      return
    }
    const noteByParams = notes.filter((n) => n.uuid === params.noteId)
    if (noteByParams.length !== 0) {
      editor?.setEditable(true)
      editor?.commands.setContent(noteByParams[0].description)
      setNote(noteByParams[0])
      setTitle(noteByParams[0].title)
      setContent(noteByParams[0].description)
    } else {
      setNotFound(true)
    }
  }, [isFetched, editor, notes, params.noteId])

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
    if (note) {
      saveNoteToServer({ ...note, title, description: content })
    }
  }, [note, saveNoteToServer, savedTitle, savedContent])

  useEffect(() => {
    setIsSaved(false)

    if (note !== null) {
      updateNote({ ...note, title, description: content })
    }

    if (timeoutId.current) {
      clearTimeout(timeoutId.current)
    }

    timeoutId.current = setTimeout(() => {
      setSavedTitle(title)
      setSavedContent(content)
      setIsSaved(true)
    }, 1000)
  }, [title, content])

  const addNewNote = async (): Promise<void> => {
    if (!isSaved) {
      if (note) await saveNoteToServer({ ...note, title, description: content })
    }
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

  const handleDeleteNote = (n: Note): void => {
    if (session && n) {
      try {
        deleteNote(session, n)
        const remainingNotes = notes.filter((n_) => n_.uuid !== n.uuid)
        if (n.uuid === note?.uuid) {
          if (remainingNotes.length <= 0) {
            addNewNote()
            return
          }
          redirectNote(remainingNotes[0].uuid)
        }
      } catch (error) {
        console.error(error)
      }
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

  return (
    <div className="flex size-full gap-16 p-16 bg-background">
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto pr-4">
        <div className="flex items-center justify-between w-full gap-4 text-sm text-secondary-foreground">
          <div className="flex gap-8">
            <div className="flex gap-4">
              {note !== null && (
                <p className="flex items-center">
                  {formatDateYear(note.createdAt)}
                </p>
              )}
              {!loading ? (
                <button
                  onClick={addNewNote}
                  className="flex items-center gap-1 px-1 rounded-md truncate text-secondary-foreground hover-bg"
                >
                  <PlusIcon />
                  <span>Add A New Note</span>
                </button>
              ) : (
                <div className="flex items-center gap-1 rounded-md px-1 text-secondary-foreground">
                  <span>loading...</span>
                </div>
              )}
            </div>
            <button
              className="flex items-center hover-text"
              onClick={handleClose}
            >
              <Icon icon="basil:stack-solid" style={{ fontSize: "15px" }} />
            </button>
          </div>
          {note !== null && (
            <p className="text-xs">edited {fromNow(note.updatedAt)}</p>
          )}
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
              placeholder="Untitled"
              className="w-full py-2 text-2xl font-bold resize-none overflow-hidden bg-background text-foreground placeholder:text-secondary-foreground truncate whitespace-pre-wrap break-words outline-none focus:outline-none"
              rows={1}
            />
            <div className="text-primary-foreground">
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
      <div
        className={classNames(
          closeToggle ? "hidden" : "visible",
          "flex flex-col gap-8 w-full max-w-[200px] max-h-screen text-sm text-secondary-foreground overflow-y-auto"
        )}
      >
        <span className="text-foreground">notes</span>
        <div className="flex flex-col gap-2 px-2">
          {notes?.map((n) => (
            <div
              key={n.uuid}
              className="flex items-center justify-between gap-1 py-1 px-2 rounded-md hover-bg truncate group"
              role="button"
              tabIndex={0}
              onClick={() => {
                if (note)
                  saveNoteToServer({ ...note, title, description: content })
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  if (note) {
                    saveNoteToServer({ ...note, title, description: content })
                  }
                }
              }}
            >
              <Link href={`/space/notes/${n.uuid}`} className="flex-1 truncate">
                {n.uuid === note?.uuid ? (
                  <p className="truncate text-foreground">
                    {title || "Untitled"}
                  </p>
                ) : (
                  <p className="truncate text-secondary-foreground">
                    {n.title || "Untitled"}
                  </p>
                )}
              </Link>
              <button
                className="opacity-0 hover-text group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteNote(n)
                }}
              >
                del
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NotesPage
