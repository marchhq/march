"use client"

import { KeyboardEvent, useEffect, useState } from "react"

import { usePathname } from "next/navigation"

import { AutoResizingTextarea } from "../../textarea/resizing-textarea"
import { useAuth } from "@/src/contexts/AuthContext"
import { Item } from "@/src/lib/@types/Items/Items"
import { useCreateItem } from "@/src/queries/useItem"
import { isLink } from "@/src/utils/helpers"

export const AddTodo = () => {
  const { session } = useAuth()

  const [addingItem, setAddingItem] = useState(false)
  const [title, setTitle] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addItem = useCreateItem(session)

  const handleAddItem = async () => {
    if (isSubmitting) return

    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    try {
      setIsSubmitting(true)

      const link = isLink(trimmedTitle)
      const finalTitle =
        link && !/^https:\/\//i.test(trimmedTitle)
          ? `https://${trimmedTitle}`
          : trimmedTitle

      const data: Partial<Item> = {
        title: finalTitle,
        type: link ? "bookmark" : "todo",
      }

      if (link) {
        data.metadata = {
          url: finalTitle,
        }
      }

      console.log("add item: ", data)
      addItem.mutate(data)
      setAddingItem(false)
      setTitle("")
    } catch (error) {
      console.error(error)
    }
  }

  const handleCloseAddItem = async () => {
    setAddingItem(false)
    setTitle("")
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!addingItem) {
      setAddingItem(true)
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (title) {
        handleAddItem()
      }
    }
  }

  const handleBlur = () => {
    handleCloseAddItem()
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
        onBlur={handleBlur}
        value={title}
        onChange={setTitle}
        onKeyDown={handleKeyDown}
        rows={1}
        showAddingItemHint={addingItem}
      />
    </section>
  )
}
