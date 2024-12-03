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
    <div onBlur={handleOnBlur} className="pl-5">
      {/*<textarea
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
      )} */}

      <div className="relative">
        <textarea
          ref={textareaRefTitle}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Insert a link or just plain text.."
          className="w-full truncate rounded-lg border border-transparent bg-background p-4 pl-6 pr-32 font-semibold text-primary-foreground outline-none transition-colors placeholder:text-secondary-foreground focus:border-border focus:ring-0"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-secondary-foreground">
          press ↵ to save
        </span>
      </div>
    </div>
  )
}
