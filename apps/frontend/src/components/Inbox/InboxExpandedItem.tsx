"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"

import { Icon } from "@iconify-icon/react"

import TextEditor from "../atoms/Editor"
import { useAuth } from "@/src/contexts/AuthContext"
import useEditorHook from "@/src/hooks/useEditor.hook"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"
import { formatDateYear, fromNow } from "@/src/utils/datetime"

export const InboxExpandedItem: React.FC = () => {
  const { session } = useAuth()
  const { currentItem, setCurrentItem, updateItem } = useCycleItemStore()
  const textareaRefTitle = useRef<HTMLTextAreaElement>(null)
  const divRef = useRef<HTMLDivElement>(null)

  const [editedTitle, setEditedTitle] = useState("")
  const [hasTitleChanges, setHasTitleChanges] = useState(false)

  const [content, setContent] = useState("<p></p>")
  const [isSaved, setIsSaved] = useState(true)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const lastSavedContent = useRef("<p></p>")
  const lastSavedTitle = useRef("")

  useEffect(() => {
    if (currentItem) {
      setContent(currentItem.description || "<p></p>")
      setEditedTitle(currentItem.title || "")
      lastSavedContent.current = currentItem.description || "<p></p>"
      lastSavedTitle.current = currentItem.title || ""
    }
  }, [currentItem])

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent)
    if (newContent !== lastSavedContent.current) {
      setHasUnsavedChanges(true)
      setIsSaved(false)
    }
  }, [])

  const handleTitleChange = useCallback((newTitle: string) => {
    setEditedTitle(newTitle)
    setHasTitleChanges(true)
  }, [])

  const editor = useEditorHook({
    content,
    setContent: handleContentChange,
    setIsSaved,
  })

  useEffect(() => {
    const textarea = textareaRefTitle.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [editedTitle])

  useEffect(() => {
    if (!currentItem?._id || (!hasUnsavedChanges && !hasTitleChanges)) return

    const debounceTimer = setTimeout(() => {
      const updates: any = {}

      if (content !== lastSavedContent.current) {
        updates.description = content
        lastSavedContent.current = content
      }

      if (editedTitle !== lastSavedTitle.current) {
        updates.title = editedTitle
        lastSavedTitle.current = editedTitle
      }

      if (Object.keys(updates).length > 0) {
        updateItem(session, { ...currentItem, ...updates }, currentItem._id)
        setIsSaved(true)
        setHasUnsavedChanges(false)
        setHasTitleChanges(false)
      }
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [
    content,
    editedTitle,
    hasUnsavedChanges,
    hasTitleChanges,
    currentItem,
    session,
    updateItem,
  ])

  const handleClose = useCallback(() => {
    setCurrentItem(null)
  }, [setCurrentItem])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement

      const isClickOnItem = target.closest("[data-item-id]") !== null
      const isTipTapClick =
        target.closest(".tippy-box") !== null ||
        target.closest(".tiptap") !== null ||
        target.closest("[data-tippy-root]") !== null

      if (
        divRef.current &&
        !divRef.current.contains(target) &&
        !isClickOnItem &&
        !isTipTapClick
      ) {
        handleClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [handleClose])

  const handleTextareaKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (e.shiftKey) {
        const textarea = e.currentTarget as HTMLTextAreaElement
        const cursorPosition = textarea.selectionStart
        const newValue =
          editedTitle.slice(0, cursorPosition) +
          "\n" +
          editedTitle.slice(cursorPosition)

        setEditedTitle(newValue)

        requestAnimationFrame(() => {
          textarea.selectionStart = cursorPosition + 1
          textarea.selectionEnd = cursorPosition + 1
        })
      } else {
        if (editor) {
          editor.commands.focus()
          editor.commands.setTextSelection(0)
        }
      }
    }
  }
  return (
    <div className="flex-auto">
      {currentItem && (
        <div
          ref={divRef}
          className="flex size-full flex-col gap-4 border-l border-border p-4 text-foreground"
        >
          <div className="flex items-center gap-4 text-xs text-secondary-foreground">
            <button className="flex items-center" onClick={handleClose}>
              <Icon icon="ep:back" className="text-[18px]" />
            </button>
            <p className="flex items-center">
              {formatDateYear(currentItem.createdAt || "")}
            </p>
            <p>edited {fromNow(currentItem.updatedAt || "")}</p>
          </div>
          <div>
            <textarea
              ref={textareaRefTitle}
              value={editedTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              onKeyDown={handleTextareaKeyDown}
              placeholder="title"
              className="w-full resize-none overflow-hidden truncate whitespace-pre-wrap break-words bg-background py-2 text-xl font-bold text-foreground outline-none placeholder:text-secondary-foreground focus:outline-none"
              rows={1}
            />
          </div>
          <div className="text-foreground">
            <TextEditor editor={editor} />
          </div>
          <div className="size-full"></div>
        </div>
      )}
    </div>
  )
}
