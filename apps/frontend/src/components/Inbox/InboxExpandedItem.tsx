"use client"

import React, { useCallback, useEffect, useRef, useState, useMemo } from "react"

import Image from "next/image"

import TextEditor from "../atoms/Editor"
import ChevronLeftIcon from "@/public/icons/chevronleft.svg"
import { useAuth } from "@/src/contexts/AuthContext"
import useEditorHook from "@/src/hooks/useEditor.hook"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"
import { formatDateYear, fromNow } from "@/src/utils/datetime"

interface EditedItem {
  title: string
}

interface TimeoutRefs {
  title: ReturnType<typeof setTimeout> | null
  editor: ReturnType<typeof setTimeout> | null
}

const SAVE_DELAY = {
  TITLE: 500,
  CONTENT: 500,
} as const

export const InboxExpandedItem: React.FC = () => {
  const { session } = useAuth()
  const { currentItem, setCurrentItem, updateItem, deleteItem } =
    useCycleItemStore()

  // Refs
  const textareaRefTitle = useRef<HTMLTextAreaElement>(null)
  const divRef = useRef<HTMLDivElement>(null)
  const timeoutRefs = useRef<TimeoutRefs>({
    title: null,
    editor: null,
  })
  const lastSavedContent = useRef(currentItem?.description || "<p></p>")

  // State
  const [editItemId, setEditItemId] = useState<string | null>(null)
  const [editedItem, setEditedItem] = useState<EditedItem>({ title: "" })
  const [content, setContent] = useState(currentItem?.description || "<p></p>")
  const [isSaved, setIsSaved] = useState(true)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Memoized handlers
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent)
    const hasChanged = newContent !== lastSavedContent.current
    setHasUnsavedChanges(hasChanged)
    setIsSaved(!hasChanged)
  }, [])

  const handleClose = useCallback(() => {
    setCurrentItem(null)
    setEditItemId(null)
    setEditedItem({ title: "" })
  }, [setCurrentItem])

  const handleDelete = useCallback(
    (event: React.MouseEvent, id: string) => {
      event.stopPropagation()
      if (id) {
        deleteItem(session, id)
      }
    },
    [deleteItem, session]
  )

  const handleSaveEditedItem = useCallback(
    async (item: typeof currentItem) => {
      if (!item?._id || !editItemId) return

      try {
        await updateItem(
          session,
          {
            ...item,
            title: editedItem.title,
          },
          item._id
        )
      } catch (error) {
        console.error("Error updating item:", error)
      }
    },
    [session, updateItem, editItemId, editedItem.title]
  )

  // Editor setup
  const editor = useEditorHook({
    content,
    setContent: handleContentChange,
    setIsSaved,
  })

  // Handle editor content updates with debounce
  const saveContent = useCallback(() => {
    if (!currentItem?._id || content === lastSavedContent.current) return

    updateItem(
      session,
      { ...currentItem, description: content },
      currentItem._id
    )
    lastSavedContent.current = content
    setHasUnsavedChanges(false)
    setIsSaved(true)
  }, [content, currentItem, session, updateItem])

  // Effect to handle content auto-save
  useEffect(() => {
    if (!hasUnsavedChanges) return

    if (timeoutRefs.current.editor) {
      clearTimeout(timeoutRefs.current.editor)
    }

    timeoutRefs.current.editor = setTimeout(saveContent, SAVE_DELAY.CONTENT)

    return () => {
      if (timeoutRefs.current.editor) {
        clearTimeout(timeoutRefs.current.editor)
      }
    }
  }, [hasUnsavedChanges, saveContent])

  // Effect to initialize editor when currentItem changes
  useEffect(() => {
    if (!currentItem) return

    const newContent = currentItem.description || "<p></p>"

    if (currentItem._id !== editItemId) {
      setEditItemId(currentItem._id)
      setEditedItem({ title: currentItem.title || "" })
      setContent(newContent)
      lastSavedContent.current = newContent

      if (editor?.commands) {
        editor.commands.setContent(newContent)
        editor.commands.focus()
      }
    }
  }, [currentItem, editItemId, editor])

  // Effect to handle title auto-save
  useEffect(() => {
    if (!currentItem || editedItem.title === currentItem.title) return

    if (timeoutRefs.current.title) {
      clearTimeout(timeoutRefs.current.title)
    }

    timeoutRefs.current.title = setTimeout(() => {
      handleSaveEditedItem(currentItem)
    }, SAVE_DELAY.TITLE)

    return () => {
      if (timeoutRefs.current.title) {
        clearTimeout(timeoutRefs.current.title)
      }
    }
  }, [editedItem.title, currentItem, handleSaveEditedItem])

  // Effect to handle textarea auto-resize
  useEffect(() => {
    const textarea = textareaRefTitle.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [editedItem.title])

  // Effect to handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const isClickOnItem = target.closest("[data-item-id]") !== null
      const isTipTapClick = [".tippy-box", ".tiptap", "[data-tippy-root]"].some(
        (selector) => target.closest(selector) !== null
      )

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
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [handleClose])

  // Memoized handler for textarea keydown
  const handleTextareaKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key !== "Enter") return

      e.preventDefault()

      if (e.shiftKey) {
        const textarea = e.currentTarget
        const cursorPosition = textarea.selectionStart
        const newValue =
          editedItem.title.slice(0, cursorPosition) +
          "\n" +
          editedItem.title.slice(cursorPosition)

        setEditedItem((prev) => ({ ...prev, title: newValue }))

        requestAnimationFrame(() => {
          textarea.selectionStart = cursorPosition + 1
          textarea.selectionEnd = cursorPosition + 1
        })
      } else if (editor) {
        editor.commands.focus()
        editor.commands.setTextSelection(0)
      }
    },
    [editedItem.title, editor]
  )

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setEditedItem((prev) => ({
        ...prev,
        title: e.target.value,
      }))
    },
    []
  )

  // Memoize metadata section to prevent unnecessary re-renders
  const ItemMetadata = useMemo(
    () => (
      <div className="flex items-center gap-4 text-xs text-secondary-foreground">
        <button
          className="group/button flex items-center"
          onClick={handleClose}
        >
          <Image
            src={ChevronLeftIcon}
            alt="chevron left icon"
            width={16}
            height={16}
            className="opacity-50 group-hover/button:opacity-100"
          />
        </button>
        <p className="flex items-center">
          {formatDateYear(currentItem?.createdAt ?? new Date())}
        </p>
        <p>
          edited {currentItem?.updatedAt ? fromNow(currentItem?.updatedAt) : ""}
        </p>
        <button
          className="hover-text flex w-fit items-center"
          onClick={(e) => currentItem && handleDelete(e, currentItem._id)}
        >
          <span>del</span>
        </button>
      </div>
    ),
    [currentItem, handleClose, handleDelete]
  )

  if (!currentItem) return null

  return (
    <div className="min-w-max flex-auto">
      <div
        ref={divRef}
        className="flex size-full flex-col gap-4 border-l border-border px-4 text-foreground"
      >
        {ItemMetadata}
        <div className="flex items-center">
          <textarea
            ref={textareaRefTitle}
            value={editedItem.title}
            onChange={handleTitleChange}
            onKeyDown={handleTextareaKeyDown}
            placeholder="title"
            className="w-full resize-none overflow-hidden truncate whitespace-pre-wrap break-words bg-background text-base font-semibold text-foreground outline-none placeholder:text-secondary-foreground focus:outline-none"
            rows={1}
          />
        </div>
        <div className="mt-1 text-foreground">
          <TextEditor editor={editor} />
        </div>
      </div>
    </div>
  )
}
