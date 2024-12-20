"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { useAuth } from "../contexts/AuthContext"
import useEditorHook from "../hooks/useEditor.hook"
import TextEditor from "./atoms/Editor"
import { ItemType } from "./ItemType"
import { useCreateStore } from "../lib/store/create.store"
import { useCycleItemStore } from "../lib/store/cycle.store"
import { useItemTypeStore } from "../lib/store/type.store"

export const CreateItem = () => {
  const { session } = useAuth()
  const { isOpen, close } = useCreateStore()
  const { createItem } = useCycleItemStore()
  const { selectedType } = useItemTypeStore()

  const [title, setTitle] = useState("")
  const textareaRefTitle = useRef<HTMLTextAreaElement>(null)
  const [content, setContent] = useState("<p></p>")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const lastSavedContent = useRef("<p></p>")

  const handleContentChange = useCallback(
    (newContent: string) => {
      setContent(newContent)
      const hasChanged = newContent !== "<p></p>" || title.trim() !== ""
      setHasUnsavedChanges(hasChanged)
    },
    [title]
  )

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newTitle = e.target.value
      setTitle(newTitle)
      setHasUnsavedChanges(true)
    },
    []
  )

  const editor = useEditorHook({
    content,
    setContent: handleContentChange,
  })

  const resetEditor = useCallback(() => {
    setTitle("")
    setContent("<p></p>")
    lastSavedContent.current = "<p></p>"
    setHasUnsavedChanges(false)
    editor?.commands.setContent("<p></p>")
  }, [editor])

  const handleSave = useCallback(async () => {
    if (!session) return
    if (!hasUnsavedChanges) return

    const currentContent = editor?.getHTML() || content

    try {
      if (title.trim() || currentContent !== "<p></p>") {
        await createItem(session, {
          title: title.trim(),
          description: currentContent,
          type: selectedType,
        })
      }
      resetEditor()
    } catch (error) {
      console.error("Error saving item:", error)
    }
  }, [
    session,
    createItem,
    title,
    content,
    selectedType,
    editor,
    hasUnsavedChanges,
    resetEditor,
  ])

  useEffect(() => {
    const textarea = textareaRefTitle.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [title])

  const handleClose = useCallback(async () => {
    if (hasUnsavedChanges) {
      await handleSave()
    }
    resetEditor()
    close()
  }, [close, hasUnsavedChanges, handleSave])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        e.preventDefault()
        handleClose()
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, handleClose])

  useEffect(() => {
    if (isOpen) {
      resetEditor()
    }
  }, [isOpen, resetEditor])

  return isOpen ? (
    <>
      <section
        className="fixed inset-0 z-50 cursor-default bg-black/80"
        role="button"
        onKeyDown={handleClose}
        onClick={handleClose}
        tabIndex={0}
      />
      <section className="fixed left-1/2 top-1/2 z-50 h-4/5 w-3/5 -translate-x-1/2 -translate-y-1/2 overflow-y-scroll rounded-lg bg-background p-10 shadow-lg">
        <div className="flex size-full flex-col gap-4 text-foreground">
          <div className="flex items-center">
            <textarea
              value={title}
              onChange={handleTitleChange}
              ref={textareaRefTitle}
              placeholder="Untitled"
              className="w-full resize-none overflow-hidden truncate whitespace-pre-wrap break-words bg-background text-base font-semibold text-foreground outline-none placeholder:text-secondary-foreground focus:outline-none"
              rows={1}
            />
          </div>
          <ItemType />
          <div className="mt-1 text-foreground">
            <TextEditor editor={editor} />
          </div>
        </div>
      </section>
    </>
  ) : null
}
