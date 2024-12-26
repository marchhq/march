"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"

import Image from "next/image"
import { usePathname } from "next/navigation"

import TextEditor from "../atoms/Editor"
import ChevronLeftIcon from "@/public/icons/chevronleft.svg"
import { useAuth } from "@/src/contexts/AuthContext"
import useEditorHook from "@/src/hooks/useEditor.hook"
import { MutateItem } from "@/src/lib/@types/Items/Items"
import { useItemStore } from "@/src/lib/store/item.store"
import { ItemType, useItemTypeStore } from "@/src/lib/store/type.store"
import { useUpdateItem } from "@/src/queries/useItem"
import { formatDateYear, fromNow } from "@/src/utils/datetime"

export const ItemExpandedView: React.FC = () => {
  const { session } = useAuth()
  const pathname = usePathname()
  const slug: ItemType = pathname
    ?.split("/objects/")[1]
    ?.replace("/", "") as ItemType
  const { currentItem, setCurrentItem } = useItemStore()
  const { selectedType, setSelectedType } = useItemTypeStore()
  const mutateItem = useUpdateItem(session)

  const textareaRefTitle = useRef<HTMLTextAreaElement>(null)
  const divRef = useRef<HTMLDivElement>(null)

  const [title, setTitle] = useState(currentItem?.title || "")
  const [content, setContent] = useState(currentItem?.description || "<p></p>")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const lastSavedContent = useRef(currentItem?.description || "<p></p>")

  const handleContentChange = useCallback(
    (newContent: string) => {
      console.log("Content changed:", {
        newContent,
        lastSavedContent: lastSavedContent.current,
        currentItemDesc: currentItem?.description,
      })

      setContent(newContent)
      const contentChanged =
        newContent !== lastSavedContent.current &&
        newContent !== "<p></p>" &&
        newContent !== ""

      console.log("Content changed detection:", {
        contentChanged,
        hasUnsavedChanges,
        newContent,
      })

      setHasUnsavedChanges(contentChanged)
    },
    [currentItem?.description]
  )

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newTitle = e.target.value
      setTitle(newTitle)
      const titleChanged = newTitle !== currentItem?.title
      const contentChanged = content !== currentItem?.description
      setHasUnsavedChanges(titleChanged || contentChanged)
    },
    [content, currentItem?.description, currentItem?.title]
  )

  const editor = useEditorHook({
    content,
    setContent: handleContentChange,
  })

  const resetEditor = useCallback(() => {
    setTitle(currentItem?.title || "")
    setContent(currentItem?.description || "<p></p>")
    lastSavedContent.current = currentItem?.description || "<p></p>"
    setHasUnsavedChanges(false)
    editor?.commands.setContent(currentItem?.description || "<p></p>")
  }, [editor, currentItem])

  const handleSave = useCallback(async () => {
    if (!session || !currentItem?._id) return
    if (!hasUnsavedChanges) return

    const currentContent = editor?.getHTML() || content

    try {
      const updateData: MutateItem = {
        id: currentItem._id,
        data: {
          title: title.trim(),
          description: currentContent,
          type: selectedType || currentItem.type,
        },
      }
      await mutateItem.mutateAsync(updateData)
      lastSavedContent.current = currentContent
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error("Error saving item:", error)
    }
  }, [
    session,
    currentItem,
    mutateItem,
    title,
    content,
    selectedType,
    editor,
    hasUnsavedChanges,
  ])

  const handleDelete = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation()
      if (!session || !currentItem?._id) return

      try {
        const updateData: MutateItem = {
          id: currentItem._id,
          data: {
            isDeleted: true,
          },
        }
        await mutateItem.mutateAsync(updateData)
        setCurrentItem(null)
      } catch (error) {
        console.error("error deleting item: ", error)
      }
    },
    [currentItem, mutateItem, session, setCurrentItem]
  )

  const handleClose = useCallback(async () => {
    if (hasUnsavedChanges) {
      await handleSave()
    }
    setCurrentItem(null)
  }, [setCurrentItem, hasUnsavedChanges, handleSave])

  useEffect(() => {
    setSelectedType(slug)
  }, [setSelectedType, slug])

  useEffect(() => {
    const onChange = () => {
      const newContent = editor?.getHTML() || "<p></p>"
      if (newContent !== lastSavedContent.current && newContent !== "<p></p>") {
        setHasUnsavedChanges(true)
      }
    }

    editor?.on("update", onChange)

    return () => {
      editor?.off("update", onChange)
    }
  }, [editor])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && currentItem) {
        e.preventDefault()
        handleClose()
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [currentItem, handleClose])

  useEffect(() => {
    if (currentItem) {
      const initialContent = currentItem.description || "<p></p>"
      setTitle(currentItem.title || "")
      setContent(initialContent)
      lastSavedContent.current = initialContent
      setHasUnsavedChanges(false)
      if (editor?.commands) {
        editor.commands.setContent(initialContent)
      }
    }
  }, [currentItem, editor])

  useEffect(() => {
    if (currentItem) {
      resetEditor()
    }
  }, [currentItem, resetEditor])

  useEffect(() => {
    const textarea = textareaRefTitle.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [title])

  if (currentItem) {
    return (
      <div>
        <div
          className="fixed inset-0 z-50 cursor-default bg-black/80"
          role="button"
          onClick={handleClose}
          onKeyDown={handleClose}
          tabIndex={0}
        ></div>
        <div className="fixed left-1/2 top-1/2 z-50 h-4/5 w-3/5 -translate-x-1/2 -translate-y-1/2 overflow-y-scroll rounded-lg bg-background p-10 shadow-lg">
          <div>
            <div
              ref={divRef}
              className="flex size-full flex-col gap-4 text-foreground"
            >
              <div className="flex items-center gap-4 text-xs text-secondary-foreground">
                <button
                  className="group/button flex items-center"
                  onClick={handleClose}
                >
                  <Image
                    src={ChevronLeftIcon}
                    alt="chevron left icon"
                    width={16}
                    height={16}
                    className="opacity-50 group-hover/button:opacity-100"
                  />
                </button>
                <p className="flex items-center">
                  {formatDateYear(currentItem.createdAt)}
                </p>
                <p>edited {fromNow(currentItem.updatedAt)}</p>
                <button
                  className="hover-text flex w-fit items-center"
                  onClick={handleDelete}
                >
                  <span>del</span>
                </button>
              </div>
              <div className="flex items-center">
                <textarea
                  ref={textareaRefTitle}
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="title"
                  className="w-full resize-none overflow-hidden truncate whitespace-pre-wrap break-words bg-background text-base font-semibold text-foreground outline-none placeholder:text-secondary-foreground focus:outline-none"
                  rows={1}
                />
              </div>
              <div className="mt-1 text-foreground">
                <TextEditor editor={editor} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
