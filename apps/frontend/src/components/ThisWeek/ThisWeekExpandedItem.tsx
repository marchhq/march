"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { Icon } from "@iconify-icon/react"

import TextEditor from "../atoms/Editor"
import { useAuth } from "@/src/contexts/AuthContext"
import useEditorHook from "@/src/hooks/useEditor.hook"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"
import classNames from "@/src/utils/classNames"
import { formatDateYear, fromNow } from "@/src/utils/datetime"

export const ThisWeekExpandedItem: React.FC = () => {
  const { session } = useAuth()
  const { currentItem, setCurrentItem, updateItem } = useCycleItemStore()
  const textareaRefTitle = useRef<HTMLTextAreaElement>(null)
  const divRef = useRef<HTMLDivElement>(null)

  const [content, setContent] = useState("<p></p>")
  const [editedTitle, setEditedTitle] = useState("")
  const [isSaved, setIsSaved] = useState(true)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [hasTitleChanges, setHasTitleChanges] = useState(false)

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
    setIsSaved(false)
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

  return (
    <div
      ref={divRef}
      className={classNames(
        `absolute inset-y-0 left-1/2 z-50 w-1/2 h-full border-l border-border bg-background text-foreground`
      )}
    >
      <div className="flex w-full flex-col gap-4 p-4">
        <div className="flex items-center justify-between text-xs text-secondary-foreground">
          <div className="flex gap-4">
            <button
              className="hover-text flex items-center"
              onClick={handleClose}
            >
              <Icon icon="ep:back" className="text-[18px]" />
            </button>
            <p className="flex items-center">
              {formatDateYear(currentItem?.createdAt || "")}
            </p>
            <p>edited {fromNow(currentItem?.updatedAt || "")}</p>
            {!isSaved && <p className="text-secondary-foreground">Saving...</p>}
          </div>
          <div className="flex gap-4">
            <button className="hover-text hover-bg flex items-center gap-1 truncate rounded-md px-1 text-secondary-foreground">
              <span>reschedule</span>
            </button>
            <button className="hover-text hover-bg flex items-center gap-1 truncate rounded-md px-1 text-secondary-foreground">
              <span>del</span>
            </button>
          </div>
        </div>
        <div>
          <textarea
            ref={textareaRefTitle}
            value={editedTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="title"
            className="w-full resize-none overflow-hidden truncate whitespace-pre-wrap break-words bg-background py-2 text-xl font-bold text-foreground outline-none placeholder:text-secondary-foreground focus:outline-none"
            rows={1}
          />
          <div className="text-foreground">
            <TextEditor editor={editor} />
          </div>
        </div>
      </div>
    </div>
  )
}
