"use client"

import React, { useState, useEffect, useRef } from "react"

import { useAuth } from "@/src/contexts/AuthContext"
import { CycleItem } from "@/src/lib/@types/Items/Cycle"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"
import { isLink } from "@/src/utils/helpers"

export const InboxAddItem: React.FC = () => {
  const { session } = useAuth()

  const textareaRefTitle = useRef<HTMLTextAreaElement>(null)
  const [addingItem, setAddingItem] = useState(false)
  const [title, setTitle] = useState("")
  const [error, setError] = useState("")

  const { createItem } = useCycleItemStore()

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
  }

  const handleAddItemToInbox = async () => {
    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      return
    }

    const linkDetected = isLink(trimmedTitle)

    // prepare the final URL if its a link
    const finalTitle =
      linkDetected && !/^https:\/\//i.test(trimmedTitle)
        ? `https://${trimmedTitle}`
        : trimmedTitle

    // prepare the item data
    const data: Partial<CycleItem> = {
      title: finalTitle,
      type: linkDetected ? "link" : "Issue",
    }

    if (linkDetected) {
      data.metadata = {
        url: finalTitle,
      }
    }

    try {
      await createItem(session, data)

      setAddingItem(false)
      setTitle("")
      setError("")
    } catch (error) {
      setError("error adding item to inbox")
      console.error("error adding item to inbox:", error)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!addingItem) {
      setAddingItem(true)
    }
    if (event.key === "Enter") {
      event.preventDefault()
      if (title) {
        handleAddItemToInbox()
      }
    }
  }

  const handleOnBlur = () => {
    handleCloseAddItemToInbox()
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
    <div onBlur={handleOnBlur}>
      <textarea
        ref={textareaRefTitle}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="add anything..."
        className="w-full resize-none overflow-hidden truncate whitespace-pre-wrap break-words bg-background text-sm text-foreground outline-none placeholder:text-secondary-foreground focus:outline-none"
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        rows={1}
      />
      {error && (
        <div className="truncate text-xs text-danger-foreground">
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
