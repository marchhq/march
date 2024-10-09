"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"

import { useAuth } from "@/src/contexts/AuthContext"
import { InboxItem } from "@/src/lib/@types/Items/Inbox"
import useInboxStore from "@/src/lib/store/inbox.store"
import { ItemIcon } from "../atoms/ItemIcon"
import { Icon } from "@iconify-icon/react"
import classNames from "@/src/utils/classNames"

export const InboxItems: React.FC = () => {
  const { session } = useAuth()
  const textareaRefTitle = useRef<HTMLTextAreaElement>(null)
  const textareaRefDescription = useRef<HTMLTextAreaElement>(null)
  const [editItemId, setEditItemId] = useState<string | null>(null)
  const [editedItem, setEditedItem] = useState<{
    title: string
    description: string
  }>({
    title: "",
    description: "",
  })

  const {
    isFetched,
    setIsFetched,
    fetchInboxData,
    updateItem,
    inboxItems,
    deleteItem,
    isLoading,
  } = useInboxStore()

  const fetchInbox = useCallback(async () => {
    try {
      fetchInboxData(session)
      setIsFetched(true)
    } catch (error) {
      setIsFetched(false)
    }
  }, [session, fetchInboxData, setIsFetched])

  useEffect(() => {
    if (!isFetched) {
      fetchInbox()
    }
  }, [session, fetchInboxData, setIsFetched])

  /* todo: fix textarea */

  useEffect(() => {
    const textarea = textareaRefTitle.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [editedItem.title])

  useEffect(() => {
    const textarea = textareaRefDescription.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [editedItem.description])

  const handleEditItem = (item: InboxItem) => {
    setEditItemId(item._id || null)
    setEditedItem({
      title: item.title || "",
      description: item.description || "",
    })
  }

  const handleDeleteItem = (itemId: string) => {
    if (!session) {
      console.error("user is not authenticated")
      return
    }
    try {
      deleteItem(session, itemId)
    } catch (error) {
      console.error("error deleting inbox item:", error)
    }
  }

  const handleCancelEditItem = () => {
    setEditItemId(null)
    setEditedItem({ title: "", description: "" })
  }

  const handleSaveEditedItem = async (item: InboxItem) => {
    try {
      if (editItemId && editedItem) {
        updateItem(
          session,
          {
            ...item,
            title: editedItem.title,
            description: editedItem.description,
          },
          item._id || ""
        )
      }
      handleCancelEditItem()
    } catch (error) {
      console.error("error updating item:", error)
    }
  }

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
    item: InboxItem
  ) => {
    if (event.key === "Enter") {
      event.preventDefault()
      handleSaveEditedItem(item)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <p>loading...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full gap-2 overflow-y-auto pr-1">
      {inboxItems.length === 0 ? (
        <p>inbox empty</p>
      ) : (
        inboxItems.map((item: InboxItem) => (
          <div
            key={item._id}
            className={classNames(
              "flex justify-between text-left gap-1 p-4 border rounded-lg hover:border-border hover-bg group",
              editItemId === item._id
                ? "bg-background-hover border-border"
                : "bg-transparent border-transparent"
            )}
            onDoubleClick={() => handleEditItem(item)}
          >
            <div className="flex flex-col w-full truncate">
              <div className="flex justify-between text-foreground">
                <div className="w-full flex items-start gap-2">
                  <ItemIcon type={item.source || "march"} />
                  {editItemId === item._id ? (
                    <div className="w-full">
                      <textarea
                        ref={textareaRefTitle}
                        value={editedItem.title}
                        onChange={(e) =>
                          setEditedItem((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => handleKeyDown(e, item)}
                        placeholder="title"
                        className="w-full resize-none overflow-hidden bg-transparent placeholder:text-secondary-foreground truncate whitespace-pre-wrap break-words outline-none focus:outline-none"
                        rows={1}
                      />
                    </div>
                  ) : (
                    <p>{item.title}</p>
                  )}
                </div>
              </div>
              <div className="ml-[18px] pl-2 text-xs">
                {editItemId === item._id ? (
                  <textarea
                    ref={textareaRefDescription}
                    value={editedItem.description}
                    onChange={(e) => {
                      setEditedItem((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }}
                    onKeyDown={(e) => handleKeyDown(e, item)}
                    placeholder="description"
                    className="w-full text-xs resize-none overflow-hidden bg-transparent text-secondary-foreground placeholder:text-secondary-foreground truncate whitespace-pre-wrap break-words outline-none focus:outline-none"
                    rows={1}
                  />
                ) : (
                  <p>{item.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center text-secondary-foreground text-xs">
              {editItemId === item._id ? (
                <div className="flex gap-4">
                  <button
                    className="hover-text"
                    onClick={() => handleSaveEditedItem(item)}
                  >
                    save
                  </button>
                  <button className="hover-text" onClick={handleCancelEditItem}>
                    cancel
                  </button>
                </div>
              ) : (
                <div className="flex gap-4">
                  {/*
                  <button
                    className="invisible group-hover:visible hover-text"
                    onClick={() => handleDeleteItem(item._id || "")}
                  >
                    del
                  </button>
                  */}
                  <button className="invisible group-hover:visible hover-text">
                    <Icon
                      icon="humbleicons:clock"
                      className="mt-0.5 text-[18px]"
                    />
                  </button>
                  <button className="invisible group-hover:visible hover-text">
                    <Icon
                      icon="mingcute:move-line"
                      className="mt-0.5 text-[18px]"
                    />
                  </button>
                  <button className="invisible group-hover:visible hover-text">
                    <Icon
                      icon="fluent:archive-24-regular"
                      className="mt-0.5 text-[18px]"
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
