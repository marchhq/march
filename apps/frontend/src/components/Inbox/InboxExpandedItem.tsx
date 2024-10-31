"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"

import Image from "next/image"

import TextEditor from "../atoms/Editor"
import ChevronLeftIcon from "@/public/icons/chevronleft.svg"
import { useAuth } from "@/src/contexts/AuthContext"
import useEditorHook from "@/src/hooks/useEditor.hook"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"
import { formatDateYear, fromNow } from "@/src/utils/datetime"

export const InboxExpandedItem: React.FC = () => {
  const { session } = useAuth()
  const { currentItem, setCurrentItem, updateItem, deleteItem, error } =
    useCycleItemStore()
  const textareaRefTitle = useRef<HTMLTextAreaElement>(null)
  const divRef = useRef<HTMLDivElement>(null)
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [editItemId, setEditItemId] = useState<string | null>(null)
  const [editedItem, setEditedItem] = useState<{
    title: string
  }>({
    title: "",
  })
  const [content, setContent] = useState(currentItem?.description || "<p></p>")
  const [isSaved, setIsSaved] = useState(true)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const lastSavedContent = useRef(currentItem?.description || "<p></p>")

  useEffect(() => {
    if (currentItem && currentItem._id !== editItemId) {
      setEditItemId(currentItem._id || "")
      setEditedItem({
        title: currentItem.title || "",
      })
    }
  }, [currentItem, editItemId])

  useEffect(() => {
    const textarea = textareaRefTitle.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [editedItem.title])

  const handleTextareaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault()

      if (e.shiftKey) {
        const textarea = e.currentTarget
        const cursorPosition = textarea.selectionStart
        const newValue =
          editedItem.title.slice(0, cursorPosition) +
          "\n" +
          editedItem.title.slice(cursorPosition)

        setEditedItem((prev) => ({
          ...prev,
          title: newValue,
        }))

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

  const handleSaveEditedItem = async (item: any) => {
    try {
      if (editItemId && editedItem) {
        updateItem(
          session,
          {
            ...item,
            title: editedItem.title,
          },
          item._id
        )
      }
    } catch (error) {
      console.error("error updating item:", error)
    }
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
    setContent(currentItem?.description || "<p></p>")
    editor?.commands.setContent(currentItem?.description || "<p></p>")
    lastSavedContent.current = currentItem?.description || "<p></p>"
    editor?.commands.focus()
  }, [currentItem, editor])

  useEffect(() => {
    if (hasUnsavedChanges) {
      const debounceTimer = setTimeout(() => {
        if (content !== lastSavedContent.current && currentItem?._id) {
          updateItem(
            session,
            { ...currentItem, description: content },
            currentItem._id
          )
          lastSavedContent.current = content
        }
        setHasUnsavedChanges(false)
        setIsSaved(true)
      }, 2000)
      return () => clearTimeout(debounceTimer)
    }
  }, [content, hasUnsavedChanges, currentItem, session, updateItem])

  useEffect(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current)
    }

    const isEdited = editedItem.title !== (currentItem?.title || "")

    if (isEdited) {
      timeoutId.current = setTimeout(() => {
        if (currentItem) {
          handleSaveEditedItem(currentItem)
        }
      }, 1000)
    }

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }
    }
  }, [editedItem, currentItem])

  const handleClose = useCallback(() => {
    setCurrentItem(null)
    handleCancelEditItem()
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

  const handleCancelEditItem = () => {
    setEditItemId(null)
    setEditedItem({ title: "" })
  }

  const handleDelete = useCallback(
    (event: React.MouseEvent, id: string) => {
      event.stopPropagation()
      if (id) {
        deleteItem(session, id)
      }
    },
    [deleteItem, session]
  )

  return (
    <div className="min-w-max flex-auto">
      {currentItem && (
        <div
          ref={divRef}
          className="flex size-full flex-col gap-4 border-l border-border px-4 text-foreground"
        >
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
              {formatDateYear(currentItem.createdAt)}
            </p>
            <p>edited {fromNow(currentItem.updatedAt)}</p>
            <button
              className="hover-text flex w-fit items-center"
              onClick={(e) => handleDelete(e, currentItem._id)}
            >
              <span>del</span>
            </button>
          </div>
          <div className="flex items-center">
            <textarea
              ref={textareaRefTitle}
              value={editedItem.title}
              onChange={(e) =>
                setEditedItem((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
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
      )}
    </div>
  )
}
