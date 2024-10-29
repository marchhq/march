"use client"

import React, { useState, useEffect, useRef } from "react"

import { Icon } from "@iconify-icon/react"

import { useAuth } from "@/src/contexts/AuthContext"
import { CycleItem } from "@/src/lib/@types/Items/Cycle"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"
import { isLink } from "@/src/utils/helpers"

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

interface ItemData {
  title: string
  type: string
  description?: string
  metadata?: {
    url: string
  }
}

export const InboxAddItem: React.FC = () => {
  const { session } = useAuth()

  const [addingItem, setAddingItem] = useState(false)
  const textareaRefTitle = useRef<HTMLTextAreaElement>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [selectedPages, setSelectedPages] = React.useState<string[]>([])

  const { createItem } = useCycleItemStore()

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
      const trimmedTitle = title.trim()

      if (!trimmedTitle) {
        return
      }

      const linkDetected = isLink(trimmedTitle)

      // Prepare the final URL if it's a link
      const finalTitle =
        linkDetected && !/^https:\/\//i.test(trimmedTitle)
          ? `https://${trimmedTitle}`
          : trimmedTitle

      // Prepare the item data
      const data: Partial<CycleItem> = {
        title: finalTitle,
        type: linkDetected ? "link" : "Issue",
      }

      if (linkDetected) {
        data.metadata = {
          url: finalTitle,
        }
      }

      await createItem(session, data)

      setAddingItem(false)
      setTitle("")
      setDescription("")
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
        <button
          className="hover-bg rounded-lg p-4"
          onClick={() => setAddingItem(true)}
        >
          <div className="flex items-center gap-2">
            <p className="text-sm">add anything..</p>
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
            rows={1}
          />
        </div>
      )}
    </div>
  )
}
