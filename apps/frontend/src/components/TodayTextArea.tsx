"use client"
import { useEffect, useState, useCallback, useRef } from "react"

import TextEditor from "./atoms/Editor"
import { useAuth } from "../contexts/AuthContext"
import useEditorHook from "../hooks/useEditor.hook"
import { useCycleItemStore } from "../lib/store/cycle.store"
import { getTodayISODate } from "../utils/datetime"

interface JournalProps {
  selectedDate: Date
}

export const TodayTextArea = ({ selectedDate }: JournalProps): JSX.Element => {
  const [content, setContent] = useState("<p></p>")
  const [isSaved, setIsSaved] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const date = getTodayISODate(selectedDate)
  const { session } = useAuth()
  const lastSavedContent = useRef(content)
  const { currentItem, fetchItemByDate, updateItem, createItem } =
    useCycleItemStore()

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
    if (session) {
      fetchItemByDate(session, date)
    }
  }, [session, date, fetchItemByDate])

  useEffect(() => {
    if (editor && currentItem) {
      console.log("Current Item:", currentItem)
      const content = currentItem.description || "<p></p>"
      setContent(content)
      editor.commands.setContent(content)
      lastSavedContent.current = content
    } else {
      setContent("<p></p>")
      editor?.commands.setContent("<p></p>")
      lastSavedContent.current = "<p></p>"
    }
    setHasUnsavedChanges(false)
    setIsSaved(true)
  }, [currentItem, editor])

  const saveJournal = async () => {
    if (content === lastSavedContent.current) return
    setIsLoading(true)
    setError(null)
    try {
      if (currentItem) {
        await updateItem(
          session,
          {
            dueDate: date,
            description: content,
          },
          currentItem._id
        )
      } else {
        await createItem(session, {
          dueDate: date,
          description: content,
        })
      }
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
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}
