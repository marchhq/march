"use client"

import { KeyboardEvent, useEffect, useState } from "react"

import { AutoResizingTextarea } from "../../textarea/resizing-textarea"

export const AddTodo = () => {
  const [addingItem, setAddingItem] = useState(false)
  const [title, setTitle] = useState("")

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      //TODO:  handle saving the item here
      console.log("saving item:", title)
      setTitle("")
      setAddingItem(false)
    }
  }

  const handleBlur = () => {
    setAddingItem(false)
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
