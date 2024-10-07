"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"

import { Icon } from "@iconify-icon/react"

import { useAuth } from "@/src/contexts/AuthContext"
import useInboxStore from "@/src/lib/store/inbox.store"

const iconsMap = {
  note: "fluent:note-16-regular",
  githubIssue: "ri:github-fill",
  linearIssue: "gg:linear",
  default: "fluent:note-16-regular",
}

const ItemIcon = ({ type }: { type: string }) => {
  const icon = iconsMap[type] || iconsMap["default"]

  return <Icon icon={icon} style={{ fontSize: "18px" }} className="mt-0.5" />
}

const InboxItems: React.FC = () => {
  const { session } = useAuth()
  const textareaRefTitle = useRef<HTMLTextAreaElement>(null)
  const textareaRefDescription = useRef<HTMLTextAreaElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [editItemId, setEditItemId] = React.useState<string | null>(null)
  const [editedItem, setEditedItem] = React.useState<{
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
  } = useInboxStore()

  const fetchInbox = useCallback(async () => {
    try {
      fetchInboxData(session)
      setIsFetched(true)
    } catch (error) {
      setIsFetched(false)
    } finally {
      setIsLoading(false)
    }
  }, [session, fetchInboxData, setIsFetched, setIsLoading])

  useEffect(() => {
    if (!isFetched) {
      fetchInbox()
    }
  }, [session, fetchInboxData, setIsFetched])

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

  const handleEditItem = (item: any) => {
    setEditItemId(item.uuid)
    setEditedItem({
      title: item.title,
      description: item.description,
    })
  }

  const handleDeleteItem = (itemId: any) => {
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

  const handleSaveEditedItem = async (item: any) => {
    try {
      if (editItemId && editedItem) {
        updateItem(
          session,
          {
            ...item,
            title: editedItem.title,
            description: editedItem.description,
          },
          item._id
        )
      }
      handleCancelEditItem()
    } catch (error) {
      console.error("error updating item:", error)
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
    <div className="flex flex-col gap-4">
      {inboxItems.length === 0 ? (
        <p>inbox empty</p>
      ) : (
        inboxItems.map((item: any) => (
          <div
            key={item.uuid}
            className="flex flex-col text-left gap-1 p-4 border border-border rounded-lg hover-bg group"
            onClick={() => {
              console.log("item.uuid", item.uuid)
              console.log("editedItemId", editItemId)
              console.log("editedItem", editedItem)
              console.log("item.description", item.description)
              console.log("item.type", item.type)
            }}
            onDoubleClick={() => handleEditItem(item)}
          >
            <div className="flex justify-between text-foreground">
              <div className="w-full flex items-start gap-2">
                <ItemIcon type={item.type} />
                {editItemId === item.uuid ? (
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
                      placeholder="title"
                      className="w-full resize-none overflow-hidden bg-transparent placeholder:text-secondary-foreground truncate whitespace-pre-wrap break-words outline-none focus:outline-none"
                      rows={1}
                    />
                  </div>
                ) : (
                  <p>{item.title}</p>
                )}
              </div>
              <div className="text-secondary-foreground text-xs">
                {editItemId === item.uuid ? (
                  <div className="flex gap-4">
                    <button
                      className="hover-text"
                      onClick={() => handleSaveEditedItem(item)}
                    >
                      save
                    </button>
                    <button
                      className="hover-text"
                      onClick={handleCancelEditItem}
                    >
                      cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <button
                      className="invisible group-hover:visible hover-text"
                      onClick={() => handleEditItem(item)}
                    >
                      edit
                    </button>
                    <button
                      className="invisible group-hover:visible hover-text"
                      onClick={() => handleDeleteItem(item._id)}
                    >
                      del
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="ml-[18px] pl-2 text-xs">
              {editItemId === item.uuid ? (
                <textarea
                  ref={textareaRefDescription}
                  value={editedItem.description}
                  onChange={(e) => {
                    setEditedItem((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }}
                  placeholder="description"
                  className="w-full text-xs resize-none overflow-hidden bg-transparent text-secondary-foreground placeholder:text-secondary-foreground truncate whitespace-pre-wrap break-words outline-none focus:outline-none"
                  rows={1}
                />
              ) : (
                <p>{item.description}</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default InboxItems
