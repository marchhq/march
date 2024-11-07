"use client"

import { useEffect, useState, useCallback, useRef } from "react"

import axios from "axios"
import { ArrowUpLeftIcon, ArrowDownRightIcon } from "lucide-react"

import TextEditor from "@/src/components/atoms/Editor"
import { useAuth } from "@/src/contexts/AuthContext"
import useEditorHook from "@/src/hooks/useEditor.hook"
import { useJournal } from "@/src/hooks/useJournal"
import { BACKEND_URL } from "@/src/lib/constants/urls"

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
  const [toggle, setToggle] = useState(true)
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
      editor?.commands.focus()
      lastSavedContent.current = journal.journal.content
    } else {
      setContent("<p></p>")
      editor?.commands.setContent("<p></p>")
      editor?.commands.focus()
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
      console.error("failed to save journal", error)
      setError("failed to save journal")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (hasUnsavedChanges && !isLoading) {
      const debounceTimer = setTimeout(saveJournal, 500)
      return () => clearTimeout(debounceTimer)
    }
  }, [content, hasUnsavedChanges, isLoading])

  const handleToggle = () => {
    setToggle(!toggle)
  }

  return (
    <div className="flex flex-col gap-3 pl-5">
      {toggle && (
        <section className="no-scrollbar min-h-[10vh] max-w-[700px] overflow-y-scroll">
          {error && (
            <div className="mb-2.5 truncate text-xs text-danger-foreground">
              <span>{error}</span>
            </div>
          )}
          <div className="text-foreground">
            <TextEditor editor={editor} minH="10vh" />
          </div>
        </section>
      )}
      {toggle ? (
        <div className="flex justify-end text-secondary-foreground">
          <ArrowUpLeftIcon
            size={14}
            className="hover-text mr-1"
            onClick={handleToggle}
          />
        </div>
      ) : (
        <div className="flex justify-start text-secondary-foreground">
          <ArrowDownRightIcon
            size={14}
            className="hover-text"
            onClick={handleToggle}
          />
        </div>
      )}
    </div>
  )
}
