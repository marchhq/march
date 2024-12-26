"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { debounce } from "lodash"

import NoteEditor from "../../Notes/components/NoteEditor/NoteEditor"
import { ViewWrapper } from "../../wrappers/ViewWrapper"
import { useAuth } from "@/src/contexts/AuthContext"
import useEditorHook from "@/src/hooks/useEditor.hook"
import { useItem, useUpdateItem } from "@/src/queries/useItem"

interface Props {
  id: string
}

export const NoteView = ({ id }: Props) => {
  const { session } = useAuth()
  const { data: item, isLoading } = useItem(session, id)
  const updateItemMutation = useUpdateItem(session)

  const [title, setTitle] = useState(item?.title ?? "")
  const [content, setContent] = useState(item?.description ?? "")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const lastSavedContent = useRef(item?.description ?? "")

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (item) {
      setTitle(item.title)
      setContent(item.description)
      lastSavedContent.current = item.description
    }
  }, [item])

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTitle = e.target.value
    console.log("Title changed:", newTitle)
    setTitle(newTitle)
    const titleChanged = newTitle !== item?.title
    const contentChanged = content !== item?.description
    setHasUnsavedChanges(titleChanged || contentChanged)
  }

  const handleContentChange = useCallback(
    (newContent: string) => {
      console.log("Content changed:", {
        newContent,
        lastSavedContent: lastSavedContent.current,
      })

      setContent(newContent)
      const contentChanged =
        newContent !== lastSavedContent.current &&
        newContent !== "<p></p>" &&
        newContent !== ""

      console.log("Content changed detection:", {
        contentChanged,
        hasUnsavedChanges,
      })
      setHasUnsavedChanges(contentChanged)
    },
    [hasUnsavedChanges]
  )

  const editor = useEditorHook({
    content,
    setContent: handleContentChange,
  })

  const handleSave = useCallback(async () => {
    if (!session || !id || !hasUnsavedChanges) return

    const currentContent = editor?.getHTML() || content
    console.log("Saving changes:", { title, content: currentContent })

    try {
      await updateItemMutation.mutateAsync({
        id,
        data: {
          title: title.trim(),
          description: currentContent,
        },
      })
      lastSavedContent.current = currentContent
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error("Failed to save:", error)
    }
  }, [
    session,
    id,
    hasUnsavedChanges,
    title,
    content,
    editor,
    updateItemMutation,
  ])

  const handleTextareaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault()
      editor?.commands.focus()
    }
  }

  const handleTitleFocus = () => {
    if (textareaRef.current) {
      textareaRef.current.select()
    }
  }

  const handleTitleBlur = () => {
    console.log("Title blur - hasUnsavedChanges:", hasUnsavedChanges)
    if (hasUnsavedChanges) {
      handleSave()
    }
  }

  const handleSaveNote = useCallback(() => {
    console.log("Editor blur - hasUnsavedChanges:", hasUnsavedChanges)
    if (hasUnsavedChanges) {
      handleSave()
    }
  }, [hasUnsavedChanges, handleSave])

  if (isLoading) {
    return <div>loading...</div>
  }

  if (!item) {
    return <div>note not found</div>
  }

  return (
    <ViewWrapper>
      <div className="flex flex-col gap-4 p-4">
        <NoteEditor
          note={item}
          title={title}
          editor={editor}
          handleTitleChange={handleTitleChange}
          handleTextareaKeyDown={handleTextareaKeyDown}
          handleTitleFocus={handleTitleFocus}
          handleTitleBlur={handleTitleBlur}
          handleSaveNote={handleSaveNote}
          textareaRef={textareaRef}
        />
      </div>
    </ViewWrapper>
  )
}
