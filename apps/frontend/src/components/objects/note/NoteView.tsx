"use client"

import React, { useCallback, useMemo, useRef, useState } from "react"

import { debounce } from "lodash"

import NoteEditor from "../../Notes/components/NoteEditor/NoteEditor"
import { ViewWrapper } from "../../wrappers/ViewWrapper"
import { useAuth } from "@/src/contexts/AuthContext"
import useEditorHook from "@/src/hooks/useEditor.hook"
import { Item } from "@/src/lib/@types/Items/Items"
import { useItem, useUpdateItem } from "@/src/queries/useItem"

interface Props {
  id: string
}

export const NoteView = ({ id }: Props) => {
  const { session } = useAuth()
  const { data: item, isLoading } = useItem(session, id)
  const updateItemMutation = useUpdateItem(session)

  const [title, setTitle] = useState(item?.title || "")
  const [content, setContent] = useState(item?.description || "")
  const [isSaved, setIsSaved] = useState(true)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const editor = useEditorHook({
    content,
    setContent: (newContent: string) => {
      setContent(newContent)
      setIsSaved(false)
    },
  })

  const debouncedSave = useMemo(
    () =>
      debounce((noteData: Partial<Item>) => {
        if (!id) return
        updateItemMutation.mutate({
          id,
          data: noteData,
        })
        setIsSaved(true)
      }, 1000),
    [id, updateItemMutation]
  )

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value)
    setIsSaved(false)
    debouncedSave({ title: e.target.value, description: content })
  }

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
    if (!isSaved) {
      debouncedSave({ title, description: content })
    }
  }

  const handleSaveNote = useCallback(() => {
    if (!isSaved) {
      debouncedSave({ title, description: content })
    }
  }, [debouncedSave, isSaved, title, content])

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
