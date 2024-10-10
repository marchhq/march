import React, { useState, useEffect, useRef } from "react"
import { Icon } from "@iconify-icon/react"
import useItemsStore, { ItemStoreType } from "@/src/lib/store/items.store"
import { useAuth } from "@/src/contexts/AuthContext"
import { getTodayISODate } from "@/src/utils/datetime"

export const ThisWeekNewItem: React.FC = () => {
  const { session } = useAuth()
  const addItem = useItemsStore((state: ItemStoreType) => state.addItem)
  const [addingItem, setAddingItem] = useState(false)
  const textareaRefTitle = useRef<HTMLTextAreaElement>(null)
  const addItemDivRef = useRef<HTMLDivElement>(null)
  const [title, setTitle] = useState("")

  useEffect(() => {
    const textarea = textareaRefTitle.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [title])

  const handleCloseAddItemToInbox = () => {
    setAddingItem(false)
    setTitle("")
  }

  const handleAddItemToInbox = async () => {
    if (!session) {
      console.error("user is not authenticated")
      return
    }
    if (!title.trim()) {
      handleCloseAddItemToInbox()
      return
    }
    try {
      const dueDate = getTodayISODate()
      const status = "todo"
      await addItem(session, dueDate, title, status)
      setAddingItem(false)
      setTitle("")
    } catch (error) {
      console.error("error adding item to inbox:", error)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        addingItem &&
        addItemDivRef.current &&
        !addItemDivRef.current.contains(event.target as Node)
      ) {
        handleAddItemToInbox()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [addingItem, title])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (addingItem && title.trim()) {
        e.preventDefault()
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [addingItem, title])

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
        <div ref={addItemDivRef} className="p-4">
          <textarea
            ref={textareaRefTitle}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="title"
            className="w-full py-1 text-base font-bold resize-none overflow-hidden bg-transparent text-foreground placeholder:text-secondary-foreground truncate whitespace-pre-wrap break-words outline-none focus:outline-none"
            autoFocus
            rows={1}
          />
        </div>
      )}
    </div>
  )
}
