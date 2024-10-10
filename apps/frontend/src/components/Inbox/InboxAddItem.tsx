"use client"

import React, { useState, useEffect, useRef } from "react"

import { Icon } from "@iconify-icon/react"

import { useAuth } from "@/src/contexts/AuthContext"
import useInboxStore from "@/src/lib/store/inbox.store"

export const InboxAddItem: React.FC = () => {
  const { session } = useAuth()

  const [addingItem, setAddingItem] = useState(false)
  const textareaRefTitle = useRef<HTMLTextAreaElement>(null)
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
      }
    } catch (error) {
      console.error("error adding item to inbox:", error)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      handleAddItemToInbox()
    }
  }

  const handleOnBlur = () => {
    if (title) {
      handleAddItemToInbox()
    } else {
      handleCloseAddItemToInbox()
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
          className="p-4 rounded-lg hover-bg"
          onClick={() => setAddingItem(true)}
        >
          <div className="flex items-center gap-2">
            <Icon icon="ic:round-plus" className="text-[18px]" />
            <p>Click to Add an Item</p>
          </div>
        </button>
      ) : (
        <div onBlur={handleOnBlur} className="ml-4">
          <textarea
            ref={textareaRefTitle}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="title"
            className="w-full py-2 text-xl font-bold resize-none overflow-hidden bg-background text-foreground placeholder:text-secondary-foreground truncate whitespace-pre-wrap break-words outline-none focus:outline-none"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            rows={1}
          />
        </div>
      )}
    </div>
  )
}
