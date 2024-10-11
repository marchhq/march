"use client"

import { useEffect, useRef, useState } from "react"

import { Icon } from "@iconify-icon/react"

import { useAuth } from "@/src/contexts/AuthContext"
import useItemsStore from "@/src/lib/store/items.store"
import classNames from "@/src/utils/classNames"
import { formatDateYear, fromNow } from "@/src/utils/datetime"

export const ThisWeekExpandedItem: React.FC = () => {
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

  const handleClose = () => {
    setSelectedItem(null)
    handleCancelEditItem()
  }

  const handleCancelEditItem = () => {
    setEditItemId(null)
    setEditedItem({ title: "", description: "" })
  }

  return (
    <div className={classNames(selectedItem ? "w-[200px]" : "")}>
      {selectedItem && (
        <div className="flex size-full flex-col gap-4 border-l border-border p-4 text-foreground">
          <div className="flex items-center gap-4 text-xs text-secondary-foreground">
            <button className="flex items-center" onClick={handleClose}>
              <Icon icon="ep:back" className="text-[18px]" />
            </button>
            <p className="flex items-center">
              {formatDateYear(selectedItem.createdAt || "")}
            </p>
            <p>edited {fromNow(selectedItem.updatedAt || "")}</p>
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
