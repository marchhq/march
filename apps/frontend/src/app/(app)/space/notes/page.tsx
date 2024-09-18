"use client"

import { useState, useRef, useEffect } from "react"
import TextEditor from "@/src/components/atoms/Editor"
import useEditorHook from "@/src/hooks/useEditor.hook"
import { PlusIcon } from "@radix-ui/react-icons"
import { useAuth } from "@/src/contexts/AuthContext"
import useNotesStore from "@/src/lib/store/notes.store"

import { type Note } from "@/src/lib/@types/Items/Note"

const NotesPage: React.FC = () => {
  const { session } = useAuth()
  const {
    fetchNotes,
    notes,
    isFetched,
    setIsFetched,
    updateNote,
    saveNote,
    addNote,
    deleteNote,
  } = useNotesStore()

  const [note, setNote] = useState<Note | null>(null)

  const [title, setTitle] = useState("initial state title")
  const [height, setHeight] = useState("auto")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [content, setContent] = useState("<p>initial state content</p>")
  const editor = useEditorHook({ content, setContent })

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

  const addNewNote = async (): Promise<void> => {
    const newNote = await addNote(session, "", "<p></p>")
  }

  return (
    <div className="w-full h-full flex flex-col gap-2 p-16 bg-background">
      <button
        onClick={addNewNote}
        className="w-fit flex items-center gap-1 px-1 rounded-md text-secondary-foreground hover-bg"
      >
        <PlusIcon />
        <span>Add A New Note</span>
      </button>{" "}
    </div>
  )
}

export default NotesPage
