"use client"

import { useEffect, useRef, useState } from "react"

import { useAuth } from "@/src/contexts/AuthContext"
import useInboxStore from "@/src/lib/store/inbox.store"

export const InboxExpandedItem: React.FC = () => {
  const { session } = useAuth()
  const textareaRefTitle = useRef<HTMLTextAreaElement>(null)
  const textareaRefDescription = useRef<HTMLTextAreaElement>(null)
  const [editItemId, setEditItemId] = useState<string | null>(null)
  const [editedItem, setEditedItem] = useState<{
    title: string
    description: string
  }>({
    title: "",
    description: "",
  })

  const { selectedItem, setSelectedItem, updateItem } = useInboxStore()

  useEffect(() => {
    if (selectedItem) {
      setEditItemId(selectedItem._id || "")
      setEditedItem({
        title: selectedItem.title || "",
        description: selectedItem.description || "",
      })
    }
    console.log(editedItem)
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

  const handleClose = () => setSelectedItem(null)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      console.log("enter pressed")
    }
  }

  const handleCancelEditItem = () => {
    setEditItemId(null)
    setEditedItem({ title: "", description: "" })
  }

  const handleSaveEditedItem = async (item: any) => {
    try {
      console.log("item", item)
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

  return (
    <>
      {selectedItem && (
        <div className="w-full h-full flex flex-col gap-4 text-foreground border-l border-border p-4">
          <div className="flex justify-between text-xs text-secondary-foreground">
            <p className="flex items-center">09/10/2024</p>
            <div className="flex gap-4">
              <button
                className="hover-text"
                onClick={() => handleSaveEditedItem(selectedItem)}
              >
                <span>save</span>
              </button>
              <button className="hover-text" onClick={handleClose}>
                <span>close</span>
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
              onKeyDown={handleKeyDown}
              placeholder="title"
              className="w-full py-2 text-xl font-bold resize-none overflow-hidden bg-background text-foreground placeholder:text-secondary-foreground truncate whitespace-pre-wrap break-words outline-none focus:outline-none"
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
              onKeyDown={handleKeyDown}
              placeholder="description"
              className="w-full text-sm resize-none overflow-hidden bg-transparent text-foreground placeholder:text-secondary-foreground truncate whitespace-pre-wrap break-words outline-none focus:outline-none"
              rows={1}
            />
          </div>
          <div className="w-full h-full"></div>
        </div>
      )}
    </>
  )
}
