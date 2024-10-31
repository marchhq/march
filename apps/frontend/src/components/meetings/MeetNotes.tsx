"use client"

import { useState, useEffect, useRef, useCallback } from "react"

import TextEditor from "../atoms/Editor"
import { useAuth } from "@/src/contexts/AuthContext"
import useEditorHook from "@/src/hooks/useEditor.hook"
import { Link as LinkIcon } from "@/src/lib/icons/Link"
import useMeetsStore, { MeetsStoreType } from "@/src/lib/store/meets.store"

const formatDate = (date: Date) => {
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" })
  const day = date.getDate()
  return `${weekday}, ${day.toString().padStart(2, "0")}`
}

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

export const MeetNotes = ({ meetData }): JSX.Element => {
  const { session } = useAuth()
  const [title, setTitle] = useState(meetData.title || "Untitled")
  const [content, setContent] = useState(meetData.description || "<p></p>")
  const [isSaved, setIsSaved] = useState(true)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const lastSavedContent = useRef(meetData.description || "<p></p>")
  const updateMeet = useMeetsStore((state: MeetsStoreType) => state.updateMeet)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [title])

  const handleTitleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTitle = event.target.value
    setTitle(newTitle)
    updateMeet({ ...meetData, title: newTitle }, session)
  }

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent)
    if (newContent !== lastSavedContent.current) {
      setHasUnsavedChanges(true)
      setIsSaved(false)
    }
  }, [])

  const editor = useEditorHook({
    content,
    setContent: handleContentChange,
    setIsSaved,
  })

  useEffect(() => {
    setContent(meetData.description || "<p></p>")
    editor?.commands.setContent(meetData.description || "<p></p>")
    lastSavedContent.current = meetData.description || "<p></p>"
  }, [meetData, editor])

  useEffect(() => {
    setTitle(meetData.title)
  }, [meetData])

  useEffect(() => {
    if (hasUnsavedChanges) {
      const debounceTimer = setTimeout(() => {
        if (content !== lastSavedContent.current) {
          updateMeet({ ...meetData, description: content }, session)
          lastSavedContent.current = content
        }
        setHasUnsavedChanges(false)
        setIsSaved(true)
      }, 500)

      return () => clearTimeout(debounceTimer)
    }
  }, [content, hasUnsavedChanges, meetData, session, updateMeet])

  return (
    <>
      <div className="flex items-center gap-1 text-sm">
        <div className="mr-4 size-4 rounded-sm bg-[#E34136]/80"></div>
        <p>
          {meetData.metadata.start.dateTime
            ? formatDate(new Date(meetData.metadata.start.dateTime))
            : "Date not available"}
        </p>
        <p>.</p>
        <p>
          {meetData?.metadata.start?.dateTime &&
          meetData?.metadata.end?.dateTime
            ? `${formatTime(new Date(meetData.metadata.start.dateTime))}: ${formatTime(new Date(meetData.metadata.end.dateTime))}`
            : "Time not available"}
        </p>
        <a
          href={meetData.metadata.hangoutLink}
          target="_blank"
          className="flex items-center gap-3 rounded-md px-4 text-secondary-foreground"
        >
          {meetData.metadata.hangoutLink && (
            <>
              <span>
                <LinkIcon />
              </span>
              {meetData.metadata.hangoutLink}
            </>
          )}
        </a>
      </div>
      <div>
        <textarea
          ref={textareaRef}
          value={title}
          onChange={handleTitleChange}
          placeholder="Untitled"
          className="w-full resize-none overflow-hidden truncate whitespace-pre-wrap break-words bg-background py-6 text-[21px] font-bold text-foreground outline-none placeholder:text-secondary-foreground focus:outline-none"
          rows={1}
        />
        <div className="text-foreground">
          <TextEditor editor={editor} />
        </div>
      </div>
    </>
  )
}
