"use client"

import { useState, useRef, useEffect, useCallback } from "react"

import { Icon } from "@iconify-icon/react/dist/iconify.mjs"
import { PlusIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { useRouter } from "next/navigation"

import TextEditor from "@/src/components/atoms/Editor"
import { useAuth } from "@/src/contexts/AuthContext"
import useEditorHook from "@/src/hooks/useEditor.hook"
import { Note } from "@/src/lib/@types/Items/Note"
import useNotesStore from "@/src/lib/store/notes.store"
import classNames from "@/src/utils/classNames"
import { formatDateYear, fromNow } from "@/src/utils/datetime"

interface Props {
  noteId: string
}

const NotesPage: React.FC<Props> = ({ noteId }) => {
  const { session } = useAuth()
  const router = useRouter()
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
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const timeoutId = useRef<NodeJS.Timeout | null>(null)
  const [content, setContent] = useState(note?.description ?? "<p></p>")
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
    const noteByParams = notes.filter((n) => n._id === noteId)
    if (noteByParams.length !== 0) {
      editor?.setEditable(true)
      editor?.commands.setContent(noteByParams[0].description)
      setNote(noteByParams[0])
      setTitle(noteByParams[0].title)
      setContent(noteByParams[0].description)
    } else {
      setNotFound(true)
    }
  }, [isFetched, editor, notes, noteId])

  useEffect(() => {
    if (note !== null && !loading) {
      if (!title || title.trim() === "") {
        textareaRef.current?.focus()
      } else {
        editor?.commands.focus()
      }
    }
  }, [note, loading, title, editor])

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

  const addNewNote = async (): Promise<void> => {
    if (!isSaved) {
      if (note) await saveNoteToServer({ ...note, title, description: content })
    }
    try {
      setLoading(true)
      const newNote = await addNote(session, "", "<p></p>")
      if (newNote !== null) {
        router.push(`/space/notes/${newNote._id}`)
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
        const remainingNotes = notes.filter((n_) => n_._id !== n._id)
        if (n._id === note?._id) {
          if (remainingNotes.length <= 0) {
            addNewNote()
            return
          }
          router.push(`/space/notes/${remainingNotes[0]._id}`)
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
    <div className="flex size-full gap-16 bg-background p-10">
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto pr-4">
        <div className="flex w-full items-center justify-between gap-4 text-sm text-secondary-foreground">
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
                  className="hover-bg flex items-center gap-1 truncate rounded-md px-1 text-secondary-foreground"
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
              className="hover-text flex items-center"
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
              className="w-full resize-none overflow-hidden truncate whitespace-pre-wrap break-words bg-background py-2 text-2xl font-bold text-foreground outline-none placeholder:text-secondary-foreground focus:outline-none"
              rows={1}
              /* eslint-disable-next-line jsx-a11y/no-autofocus */
              autoFocus={!title || title.trim() === ""}
            />
            <div className="text-foreground">
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
          "flex max-h-screen w-full max-w-[200px] flex-col gap-8 overflow-y-auto text-sm text-secondary-foreground"
        )}
      >
        <span className="text-foreground">notes</span>
        <div className="flex flex-col gap-2 px-2">
          {notes?.map((n) => (
            <div
              key={n._id}
              className="hover-bg group flex items-center justify-between gap-1 truncate rounded-md"
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
              <Link
                href={`/space/notes/${n._id}`}
                className="flex-1 truncate px-2 py-1"
              >
                {n._id === note?._id ? (
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
                className="hover-text px-2 opacity-0 group-hover:opacity-100"
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
