"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"

import { Icon } from "@iconify-icon/react"

import { useAuth } from "@/src/contexts/AuthContext"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"
import { formatDateYear, fromNow } from "@/src/utils/datetime"

export const ThisWeekExpandedItem: React.FC = () => {
  const { session } = useAuth()
  const { currentItem, setCurrentItem, updateItem } = useCycleItemStore()
  const textareaRefTitle = useRef<HTMLTextAreaElement>(null)
  const textareaRefDescription = useRef<HTMLTextAreaElement>(null)

  const [editedItem, setEditedItem] = useState({
    title: "",
    description: "",
  })
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (currentItem) {
      setEditedItem({
        title: currentItem.title || "",
        description: currentItem.description || "",
      })
      setHasChanges(false)
    }
  }, [currentItem])

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
      console.error("Error updating item:", error)
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

  const handleClose = useCallback(() => {
    setCurrentItem(null)
  }, [setCurrentItem])

  return (
    <div className="flex-auto">
      {currentItem && (
        <div className="flex size-full flex-col gap-4 border-l border-border p-4 text-foreground">
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
          <div className="size-full"></div>
        </div>
      )}
    </div>
  )
}
