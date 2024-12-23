"use client"

import React, { useState, useEffect, useRef } from "react"

import { AutoResizingTextarea } from "../textarea/resizing-textarea"
import { useAuth } from "@/src/contexts/AuthContext"
import { CycleItem } from "@/src/lib/@types/Items/Cycle"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"
import { isLink } from "@/src/utils/helpers"

export const InboxAddItem: React.FC = () => {
  const { session } = useAuth()

  const textareaRefTitle = useRef<HTMLTextAreaElement>(null)
  const [addingItem, setAddingItem] = useState(false)
  const [title, setTitle] = useState("")

  const { createItem, error } = useCycleItemStore()

  const [isSubmitting, setIsSubmitting] = useState(false)

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
    if (isSubmitting) return

    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    try {
      setIsSubmitting(true)

      const linkDetected = isLink(trimmedTitle)
      const finalTitle =
        linkDetected && !/^https:\/\//i.test(trimmedTitle)
          ? `https://${trimmedTitle}`
          : trimmedTitle

      const data: Partial<CycleItem> = {
        title: finalTitle,
        type: linkDetected ? "link" : "issue",
      }

      if (linkDetected) {
        data.metadata = {
          url: finalTitle,
        }
      }

      await createItem(session, data)
      setAddingItem(false)
      setTitle("")
    } finally {
      setIsSubmitting(false)
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
    <section>
      <AutoResizingTextarea
        value={title}
        onChange={setTitle}
        onKeyDown={handleKeyDown}
        onBlur={handleOnBlur}
        placeholder="add anything..."
        className="w-full"
        rows={1}
        showAddingItemHint={addingItem}
        error={error}
      />
    </section>
  )
}
