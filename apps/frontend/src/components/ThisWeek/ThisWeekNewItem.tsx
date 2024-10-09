"use client"

import React, { useState, useEffect, useRef } from "react"

import { Icon } from "@iconify-icon/react"

import useInboxStore from "@/src/lib/store/inbox.store"

export const ThisWeekNewItem: React.FC = () => {
  const [addingItem, setAddingItem] = useState(false)
  const textareaRefTitle = useRef<HTMLTextAreaElement>(null)
  const textareaRefDescription = useRef<HTMLTextAreaElement>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

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
    /*if (!session) {
      console.error("user is not authenticated")
      return
    }
    */
    /*try {
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
    */
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
    <div className="invisible flex flex-col text-left text-sm gap-1 rounded-lg hover-bg group-hover/section:visible">
      {!addingItem ? (
        <button
          className="flex items-center gap-2 p-4"
          onClick={() => setAddingItem(true)}
        >
          <Icon icon="ic:round-plus" className="text-[18px]" />
          <p>New item</p>
        </button>
      ) : (
        <div className="p-4">
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
            className="w-full py-1 text-base font-bold resize-none overflow-hidden bg-transparent text-foreground placeholder:text-secondary-foreground truncate whitespace-pre-wrap break-words outline-none focus:outline-none"
            autoFocus
            rows={1}
          />
          <textarea
            ref={textareaRefDescription}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="description"
            className="w-full py-1 text-xs resize-none overflow-hidden bg-transparent text-secondary-foreground placeholder:text-secondary-foreground truncate whitespace-pre-wrap break-words outline-none focus:outline-none"
            rows={1}
          />
        </div>
      )}
    </div>
  )
}
