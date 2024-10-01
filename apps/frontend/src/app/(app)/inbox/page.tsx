"use client"

import React, { useState, useEffect, useRef } from "react"

import { Icon } from "@iconify-icon/react"
import { PlusIcon } from "@radix-ui/react-icons"

import axios from "axios"

import { useAuth } from "@/src/contexts/AuthContext"
import useInboxStore from "@/src/lib/store/inbox.store"
import { BACKEND_URL } from "@/src/lib/constants/urls"

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

const InboxPage: React.FC = () => {
  const { session } = useAuth()

  const [addingItem, setAddingItem] = useState(false)
  const textareaRefTitle = useRef<HTMLTextAreaElement>(null)
  const textareaRefDescription = useRef<HTMLTextAreaElement>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [selectedPages, setSelectedPages] = React.useState<string[]>([])
  const [editItemId, setEditItemId] = React.useState<string | null>(null)
  const [editedItem, setEditedItem] = React.useState<{
    title: string
    description: string
  }>({
    title: "",
    description: "",
  })

  const { fetchInboxData, updateItem, setInboxItems, inboxItems } =
    useInboxStore()

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

  useEffect(() => {
    fetchInboxData(session)
  }, [fetchInboxData, session])

  const config = {
    headers: {
      Authorization: `Bearer ${session}`,
    },
  }
  const handleCloseAddItemToInbox = async () => {
    setAddingItem(false)
    setTitle("")
    setDescription("")
  }

  const handleEditItem = (item: any) => {
    setEditItemId(item.uuid)
    setEditedItem({
      title: item.title,
      description: item.description,
    })
  }

  const handleCancelEditItem = () => {
    setEditItemId(null)
    setEditedItem({ title: "", description: "" })
  }

  const handleSaveEditedItem = async (item: any) => {
    try {
      console.log("DESCRIPTIONNNNNNNNN", editedItem.description)
      if (editItemId && editedItem) {
        updateItem(
          {
            ...item,
            title: editedItem.title,
            description: editedItem.description,
          },
          item.uuid
        )
      }

      const config = {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      }

      await axios.put(
        `${BACKEND_URL}/api/items/${item.uuid}`,
        editedItem,
        config
      )

      // fetchInboxData(session)
      handleCancelEditItem()
    } catch (error) {
      console.error("error updating item:", error)
    }
  }

  const handleAddItemToInbox = async () => {
    if (!session) {
      console.error("User is not authenticated")
      return
    }

    console.log("test")

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/items/create`,
        {
          title: title,
          description: description,
          dueDate: date,
          pages: selectedPages,
        },
        config
      )

      if (res.status === 200) {
        fetchInboxData(session)
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
    <section className="h-full overflow-y-auto bg-background ml-[260px] p-16 text-secondary-foreground">
      <div className="max-w-[800px]">
        <div className="flex flex-col gap-8 text-sm">
          <header className="flex items-center gap-4 text-foreground">
            <Icon icon="hugeicons:inbox" style={{ fontSize: "38px" }} />
            <h1 className="text-2xl font-semibold">Inbox</h1>
          </header>
          <div className="flex flex-col gap-4">
            {!addingItem ? (
              <button
                className="p-4 border border-border rounded-lg hover-bg"
                onClick={() => setAddingItem(true)}
              >
                <div className="flex items-center gap-2">
                  <PlusIcon />
                  <p>Click to Add an Item</p>
                </div>
              </button>
            ) : (
              <div>
                <div className="flex justify-end gap-4 text-xs">
                  <button className="hover-text" onClick={handleAddItemToInbox}>
                    save
                  </button>
                  <button
                    className="hover-text"
                    onClick={handleCloseAddItemToInbox}
                  >
                    close
                  </button>
                </div>
                <textarea
                  ref={textareaRefTitle}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="title"
                  className="w-full py-2 text-2xl font-bold resize-none overflow-hidden bg-background text-foreground placeholder:text-secondary-foreground truncate whitespace-pre-wrap break-words outline-none focus:outline-none"
                  autoFocus
                  rows={1}
                />
                <textarea
                  ref={textareaRefDescription}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="description"
                  className="w-full py-2 text-sm resize-none overflow-hidden bg-background text-secondary-foreground placeholder:text-secondary-foreground truncate whitespace-pre-wrap break-words outline-none focus:outline-none"
                  rows={1}
                />
              </div>
            )}
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
                          <button
                            className="invisible group-hover:visible hover-text"
                            onClick={() => handleEditItem(item)}
                          >
                            edit
                          </button>
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
          </div>
        </div>
      </div>
    </section>
  )
}

export default InboxPage
