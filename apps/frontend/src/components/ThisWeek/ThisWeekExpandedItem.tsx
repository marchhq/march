"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { Icon } from "@iconify-icon/react"

import { useAuth } from "@/src/contexts/AuthContext"
import useItemsStore from "@/src/lib/store/items.store"
import classNames from "@/src/utils/classNames"
import { formatDateYear, fromNow } from "@/src/utils/datetime"

export const ThisWeekExpandedItem: React.FC = () => {
  const { session } = useAuth()
  const textareaRefTitle = useRef<HTMLTextAreaElement>(null)
  const textareaRefDescription = useRef<HTMLTextAreaElement>(null)
  const divRef = useRef<HTMLDivElement>(null)
  const timeoutId = useRef<NodeJS.Timeout | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [editItemId, setEditItemId] = useState<string | null>(null)
  const [editedItem, setEditedItem] = useState<{
    title: string
    description: string
  }>({
    title: "",
    description: "",
  })

  const { selectedItem, setSelectedItem, updateItem } = useItemsStore()

  useEffect(() => {
    if (selectedItem) {
      setEditItemId(selectedItem._id || "")
      setEditedItem({
        title: selectedItem.title || "",
        description: selectedItem.description || "",
      })
    }
  }, [selectedItem, setEditItemId, setEditedItem])

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

  const handleSaveEditedItem = async (item: any) => {
    try {
      console.log("editedItem", editedItem)
      if (editItemId && editedItem) {
        updateItem(
          session,
          {
            ...item,
            title: editedItem.title,
            description: editedItem.description,
          },
          item._id
        )
      }
    } catch (error) {
      console.error("error updating item:", error)
    }
  }

  useEffect(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current)
    }

    timeoutId.current = setTimeout(() => {
      if (selectedItem) {
        handleSaveEditedItem(selectedItem)
      }
    }, 1000)
  }, [editedItem, selectedItem, timeoutId])

  const handleClose = useCallback(() => {
    setIsAnimating(true)
    setTimeout(() => {
      setSelectedItem(null)
      handleCancelEditItem()
      setIsAnimating(false)
    }, 100)
  }, [setSelectedItem])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
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
    setEditedItem({ title: "", description: "" })
  }

  return (
    <div
      ref={divRef}
      className={classNames(
        `absolute inset-y-0 left-1/2 z-50 w-1/2 h-full border-l border-border bg-background text-foreground`,
        isAnimating ? "animate-slide-out" : "animate-slide-in"
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
              {formatDateYear(selectedItem?.createdAt || "")}
            </p>
            <p>edited {fromNow(selectedItem?.updatedAt || "")}</p>
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
            onChange={(e) =>
              setEditedItem((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
            placeholder="title"
            className="w-full resize-none overflow-hidden truncate whitespace-pre-wrap break-words bg-background py-2 text-xl font-bold text-foreground outline-none placeholder:text-secondary-foreground focus:outline-none"
            rows={1}
          />
          <textarea
            ref={textareaRefDescription}
            value={editedItem.description}
            onChange={(e) => {
              setEditedItem((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }}
            placeholder="description"
            className="w-full resize-none overflow-hidden truncate whitespace-pre-wrap break-words bg-transparent text-sm text-foreground outline-none placeholder:text-secondary-foreground focus:outline-none"
            rows={1}
          />
        </div>
      </div>
    </div>
  )
}
