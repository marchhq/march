"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"

import { usePathname } from "next/navigation"

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
  const pathname = usePathname()
  const slug = pathname.split("/")[2]
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

  const handleSave = useCallback(async () => {
    if (!session || !id || !hasUnsavedChanges) return

    const currentContent = editor?.getHTML() || content

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
  }, [session, id, hasUnsavedChanges, title, content, updateItemMutation])

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    setHasUnsavedChanges(true)
  }

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent)
    const contentChanged =
      newContent !== lastSavedContent.current &&
      newContent !== "<p></p>" &&
      newContent !== ""

    setHasUnsavedChanges(contentChanged)
  }, [])

  const handleEditorBlur = useCallback(() => {
    if (hasUnsavedChanges) {
      handleSave()
    }
  }, [hasUnsavedChanges, handleSave])

  const editor = useEditorHook({
    content,
    setContent: handleContentChange,
    onBlur: handleEditorBlur,
  })

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
          type={slug}
          note={item}
          title={title}
          editor={editor}
          handleTitleChange={handleTitleChange}
          handleTextareaKeyDown={handleTextareaKeyDown}
          handleTitleFocus={handleTitleFocus}
          handleSaveNote={handleEditorBlur}
          textareaRef={textareaRef}
        />
      </div>
    </ViewWrapper>
  )
}
