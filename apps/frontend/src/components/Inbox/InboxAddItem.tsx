"use client"

import React, { useState, useEffect, useRef } from "react"

import { Icon } from "@iconify-icon/react"

import { useAuth } from "@/src/contexts/AuthContext"
import { CycleItem } from "@/src/lib/@types/Items/Cycle"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"

export const InboxAddItem: React.FC = () => {
  const { session } = useAuth()

  const [addingItem, setAddingItem] = useState(false)
  const [itemSaved, setItemSaved] = useState(true)
  const textareaRefTitle = useRef<HTMLTextAreaElement>(null)
  const [title, setTitle] = useState("")

  const { createItem } = useCycleItemStore()

  useEffect(() => {
    const textarea = textareaRefTitle.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [title])

  const handleAddItem = () => {
    if (itemSaved) {
      setAddingItem(true)
    }
  }

  const handleCloseAddItemToInbox = () => {
    setAddingItem(false)
    setTitle("")
  }

  const handleAddItemToInbox = async () => {
    if (!session) {
      console.error("user is not authenticated")
      return
    }

    setItemSaved(false)

    try {
      const data: Partial<CycleItem> = {
        title,
      }

      setAddingItem(false)
      setTitle("")

      const response = await createItem(session, data)
      if (response) {
        setItemSaved(true)
      }
    } catch (error) {
      console.error("error adding item to inbox:", error)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      if (title) {
        handleAddItemToInbox()
      }
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
        <button className="hover-bg rounded-lg p-4" onClick={handleAddItem}>
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
            className="w-full resize-none overflow-hidden truncate whitespace-pre-wrap break-words bg-background py-2 text-xl font-bold text-foreground outline-none placeholder:text-secondary-foreground focus:outline-none"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            disabled={!itemSaved}
            rows={1}
          />
        </div>
      )}
    </div>
  )
}
