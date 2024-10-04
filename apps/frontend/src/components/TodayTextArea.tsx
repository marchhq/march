"use client"
import { useEffect, useState, useCallback, useRef } from "react"
import TextEditor from "./atoms/Editor"
import useEditorHook from "../hooks/useEditor.hook"
import { useJournal } from "../hooks/useJournal"
import axios from "axios"
import { BACKEND_URL } from "../lib/constants/urls"
import { useAuth } from "../contexts/AuthContext"

interface JournalProps {
  selectedDate: Date
}

const formatDate = (date: Date) => {
  const isoDate = date.toISOString()
  return isoDate.split("T")[0]
}

export const TodayTextArea = ({ selectedDate }: JournalProps): JSX.Element => {
  const [content, setContent] = useState("<p></p>")
  const [isSaved, setIsSaved] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const formattedDate = formatDate(selectedDate)
  const { journal, fetchJournal } = useJournal(formattedDate)
  const { session } = useAuth()
  const lastSavedContent = useRef(content)

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent)
    setHasUnsavedChanges(true)
    setIsSaved(false)
  }, [])

  const editor = useEditorHook({
    content,
    setContent: handleContentChange,
    setIsSaved,
  })

  useEffect(() => {
    fetchJournal()
  }, [formattedDate, fetchJournal])

  useEffect(() => {
    if (journal?.journal?.content) {
      setContent(journal.journal.content)
      editor?.commands.setContent(journal.journal.content)
      lastSavedContent.current = journal.journal.content
    } else {
      setContent("<p></p>")
      editor?.commands.setContent("<p></p>")
      lastSavedContent.current = "<p></p>"
    }
    setHasUnsavedChanges(false)
    setIsSaved(true)
  }, [journal, editor])

  const saveJournal = async () => {
    if (content === lastSavedContent.current) return
    setIsLoading(true)
    setError(null)
    try {
      await axios.post(
        `${BACKEND_URL}/api/journals/create-update/`,
        {
          date: formattedDate,
          content: content,
        },
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )
      setIsSaved(true)
      setHasUnsavedChanges(false)
      lastSavedContent.current = content
    } catch (error) {
      setError("Failed to save journal. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (hasUnsavedChanges && !isLoading) {
      const debounceTimer = setTimeout(saveJournal, 2000)
      return () => clearTimeout(debounceTimer)
    }
  }, [content, hasUnsavedChanges, isLoading])

  return (
    <div className="text-foreground">
      <TextEditor editor={editor} minH="30vh" />
    </div>
  )
}
