"use client"

import { useEffect, useRef, useState } from "react"

import { Icon } from "@iconify-icon/react"

import { useAuth } from "@/src/contexts/AuthContext"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"
import { formatDateYear, fromNow } from "@/src/utils/datetime"

export const InboxExpandedItem: React.FC = () => {
  const { session } = useAuth()
  const textareaRefTitle = useRef<HTMLTextAreaElement>(null)
  const textareaRefDescription = useRef<HTMLTextAreaElement>(null)
  const timeoutId = useRef<NodeJS.Timeout | null>(null)
  const [editItemId, setEditItemId] = useState<string | null>(null)
  const [editedItem, setEditedItem] = useState<{
    title: string
    description: string
  }>({
    title: "",
    description: "",
  })

  const { cycleItem, setCycleItem, mutateItem } = useCycleItemStore()

  useEffect(() => {
    if (cycleItem) {
      setEditItemId(cycleItem._id || "")
      setEditedItem({
        title: cycleItem.title || "",
        description: cycleItem.description || "",
      })
    }
  }, [cycleItem, setEditItemId, setEditedItem, editedItem])

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

  useEffect(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current)
    }

    timeoutId.current = setTimeout(() => {
      if (cycleItem) {
        handleSaveEditedItem(cycleItem)
      }
    }, 1000)
  }, [editedItem, cycleItem, timeoutId])

  const handleClose = () => {
    setCycleItem(null)
    handleCancelEditItem()
  }

  const handleCancelEditItem = () => {
    setEditItemId(null)
    setEditedItem({ title: "", description: "" })
  }

  const handleSaveEditedItem = async (item: any) => {
    try {
      if (editItemId && editedItem) {
        mutateItem(
          {
            ...item,
            title: editedItem.title,
            description: editedItem.description,
          },
          session,
          item._id
        )
      }
    } catch (error) {
      console.error("error updating item:", error)
    }
  }

  return (
    <div>
      {cycleItem && (
        <div className="flex size-full flex-col gap-4 border-l border-border p-4 text-foreground">
          <div className="flex items-center gap-4 text-xs text-secondary-foreground">
            <button className="flex items-center" onClick={handleClose}>
              <Icon icon="ep:back" className="text-[18px]" />
            </button>
            <p className="flex items-center">
              {formatDateYear(cycleItem.createdAt || "")}
            </p>
            <p>edited {fromNow(cycleItem.updatedAt || "")}</p>
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
          <div className="size-full"></div>
        </div>
      )}
    </div>
  )
}
