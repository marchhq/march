"use client"

import React, { useState, useEffect, useRef } from "react"

import { PlusIcon } from "@radix-ui/react-icons"

import { useAuth } from "@/src/contexts/AuthContext"
import useInboxStore from "@/src/lib/store/inbox.store"

export const InboxAddItem: React.FC = () => {
  const { session } = useAuth()

  const [addingItem, setAddingItem] = useState(false)
  const textareaRefTitle = useRef<HTMLTextAreaElement>(null)
  const textareaRefDescription = useRef<HTMLTextAreaElement>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [selectedPages, setSelectedPages] = React.useState<string[]>([])

  const { addItem } = useInboxStore()

  /* todo: fix texarea */

  useEffect(() => {
    const textarea = textareaRefTitle.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [title])

  useEffect(() => {
    const textarea = textareaRefDescription.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [description])

  const handleCloseAddItemToInbox = async () => {
    setAddingItem(false)
    setTitle("")
    setDescription("")
  }

  const handleAddItemToInbox = async () => {
    if (!session) {
      console.error("user is not authenticated")
      return
    }

    try {
      const newItem = await addItem(session, title, description)

      if (newItem) {
        setAddingItem(false)
        setTitle("")
        setDescription("")
        console.log("item added")
        console.log("title", title)
        console.log("description", description)
        console.log("dueDate", date)
        console.log("pages", selectedPages)
      }
    } catch (error) {
      console.error("error adding item to inbox:", error)
    }
  }

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (addingItem) {
        e.preventDefault()
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [addingItem])

  return (
    <div className="flex flex-col">
      {!addingItem ? (
        <button
          className="p-4 border border-border rounded-lg hover-bg"
          onClick={() => setAddingItem(true)}
        >
          <div className="flex items-center gap-2">
            <PlusIcon />
            <p>Click to Add an Item</p>
          </div>
        </button>
      ) : (
        <div>
          <div className="flex justify-end gap-4 text-xs">
            <button className="hover-text" onClick={handleAddItemToInbox}>
              save
            </button>
            <button className="hover-text" onClick={handleCloseAddItemToInbox}>
              close
            </button>
          </div>
          <textarea
            ref={textareaRefTitle}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="title"
            className="w-full py-2 text-2xl font-bold resize-none overflow-hidden bg-background text-foreground placeholder:text-secondary-foreground truncate whitespace-pre-wrap break-words outline-none focus:outline-none"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            rows={1}
          />
          <textarea
            ref={textareaRefDescription}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="description"
            className="w-full py-2 text-sm resize-none overflow-hidden bg-background text-secondary-foreground placeholder:text-secondary-foreground truncate whitespace-pre-wrap break-words outline-none focus:outline-none"
            rows={1}
          />
        </div>
      )}
    </div>
  )
}
