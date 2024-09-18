"use client"

import { useState, useRef, useEffect } from "react"
import TextEditor from "@/src/components/atoms/Editor"
import useEditorHook from "@/src/hooks/useEditor.hook"
import { PlusIcon } from "@radix-ui/react-icons"
import { useAuth } from "@/src/contexts/AuthContext"
import useNotesStore from "@/src/lib/store/notes.store"
import { redirectNote } from "@/src/lib/server/actions/redirectNote"

import { type Note } from "@/src/lib/@types/Items/Note"

const NotesPage: React.FC = ({ params }: { params: { noteId: string } }) => {
  const { session } = useAuth()

  const { getNoteByuuid, addNote, saveNote } = useNotesStore()

  const [note, setNote] = useState<Note | null>(null)

  const [title, setTitle] = useState("")
  const [height, setHeight] = useState("auto")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [content, setContent] = useState(note?.content ?? "<p></p>")
  const editor = useEditorHook({ content, setContent })

  const [loading, setLoading] = useState(false)
  const [isFetched, setIsFetched] = useState(false)

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value)
  }

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      setHeight("auto")
      setHeight(`${textarea.scrollHeight}px`)
    }
  }, [title])

  const getNote = async (): Promise<Note | null> => {
    try {
      const note = await getNoteByuuid(session, params.noteId)
      if (note) {
        setNote(note)
        setTitle(note.title)
        setContent(note.content)
      }
      setIsFetched(true)
      return note
    } catch (error) {
      console.error(error)
      return null
    }
  }

  useEffect(() => {
    getNote()
  }, [])

  useEffect(() => {
    if (isFetched && note) {
      editor?.setEditable(true)
      editor?.commands.setContent(note.content)
    }
  }, [note, isFetched])

  const addNewNote = async (): Promise<void> => {
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

  const saveNoteToServer = async (note: Note): Promise<void> => {
    await saveNote(session, note)
  }

  return (
    <div className="w-full h-full flex flex-col gap-2 p-16 bg-background">
      <div className="w-full flex items-center justify-start gap-4 text-sm text-secondary-foreground">
        <p>testing</p>
        {!loading ? (
          <button
            onClick={addNewNote}
            className="flex items-center gap-1 px-1 rounded-md text-secondary-foreground hover-bg"
          >
            <PlusIcon />
            <span>Add A New Note</span>
          </button>
        ) : (
          <div className="flex items-center gap-1 px-1 rounded-md text-secondary-foreground hover-bg">
            <span>loading...</span>
          </div>
        )}
      </div>
      {isFetched && (
        <div
          onBlur={() => {
            if (note === null) {
              return
            }
            void saveNoteToServer({ ...note, title, content })
          }}
        >
          <textarea
            ref={textareaRef}
            value={title}
            onChange={handleInput}
            placeholder="Untitled"
            className="w-full text-3xl py-2 bg-background text-foreground font-bold placeholder-secondary-foreground resize-none overflow-hidden outline-none focus:outline-none whitespace-pre-wrap break-words"
            style={{ height }}
            rows={1}
          />
          <TextEditor editor={editor} />
        </div>
      )}
    </div>
  )
}

export default NotesPage
