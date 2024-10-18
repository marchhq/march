"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { Icon } from "@iconify-icon/react"

import { useAuth } from "@/src/contexts/AuthContext"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"
import classNames from "@/src/utils/classNames"
import { formatDateYear, fromNow } from "@/src/utils/datetime"

export const ThisWeekExpandedItem: React.FC = () => {
  const { session } = useAuth()
  const textareaRefTitle = useRef<HTMLTextAreaElement>(null)
  const textareaRefDescription = useRef<HTMLTextAreaElement>(null)
  const divRef = useRef<HTMLDivElement>(null)
  const timeoutId = useRef<NodeJS.Timeout | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [editedItem, setEditedItem] = useState<{
    title: string
    description: string
  }>({
    title: "",
    description: "",
  })

  const { currentItem, setCurrentItem, updateItem } = useCycleItemStore()

  useEffect(() => {
    if (currentItem) {
      setEditedItem({
        title: currentItem.title || "",
        description: currentItem.description || "",
      })
      setHasChanges(false)
    }
  }, [currentItem])

  useEffect(() => {
    const textarea = textareaRefTitle.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [editedItem.title])

  useEffect(() => {
    const textarea = textareaRefDescription.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [editedItem.description])

  const handleSaveEditedItem = useCallback(async () => {
    if (!currentItem || !currentItem._id || !hasChanges) return
    try {
      await updateItem(
        session,
        {
          title: editedItem.title,
          description: editedItem.description,
        },
        currentItem._id
      )
      setHasChanges(false)
    } catch (error) {
      console.error("error updating item:", error)
    }
  }, [session, currentItem, editedItem, updateItem, hasChanges])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (hasChanges) {
        handleSaveEditedItem()
      }
    }, 1000)
    return () => clearTimeout(timeoutId)
  }, [editedItem, hasChanges, handleSaveEditedItem])

  const handleInputChange = (field: "title" | "description", value: string) => {
    setEditedItem((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleClose = useCallback(() => {
    setCurrentItem(null)
  }, [setCurrentItem])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isClickOnItem =
        (event.target as HTMLElement).closest("[data-item-id]") !== null

      if (
        divRef.current &&
        !divRef.current.contains(event.target as Node) &&
        !isClickOnItem
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
            value={editedItem.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="title"
            className="w-full resize-none overflow-hidden truncate whitespace-pre-wrap break-words bg-background py-2 text-xl font-bold text-foreground outline-none placeholder:text-secondary-foreground focus:outline-none"
            rows={1}
          />
          <textarea
            ref={textareaRefDescription}
            value={editedItem.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="description"
            className="w-full resize-none overflow-hidden truncate whitespace-pre-wrap break-words bg-transparent text-sm text-foreground outline-none placeholder:text-secondary-foreground focus:outline-none"
            rows={1}
          />
        </div>
      </div>
    </div>
  )
}
