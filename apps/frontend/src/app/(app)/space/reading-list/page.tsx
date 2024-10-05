"use client"

import React, { useEffect, useState, useRef } from "react"
import { useAuth } from "@/src/contexts/AuthContext"
import { useSpace } from "@/src/hooks/useSpace"
import { Icon } from "@iconify-icon/react"
import { PlusIcon } from "@radix-ui/react-icons"
import useReadingStore from "@/src/lib/store/reading.store"

interface ReadingItem {
  _id: string
  title: string
  description?: string
  metadata: { url: string }
}

const ReadingListPage: React.FC = () => {
  const { session } = useAuth()
  const { spaces } = useSpace() || { spaces: [] }
  const {
    readingItems,
    loading,
    blockId,
    fetchReadingList,
    addItem: addItemToStore,
    deleteItem: deleteItemFromStore
  } = useReadingStore()

  const [addingItem, setAddingItem] = useState(false)
  const [newItemTitle, setNewItemTitle] = useState("")
  const [newItemUrl, setNewItemUrl] = useState("")
  const [newItemDescription, setNewItemDescription] = useState("")
  const textareaRefTitle = useRef<HTMLTextAreaElement>(null)
  const textareaRefUrl = useRef<HTMLTextAreaElement>(null)
  const textareaRefDescription = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    fetchReadingList(session, spaces)
  }, [spaces, session, fetchReadingList])

  useEffect(() => {
    const textarea = textareaRefTitle.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [newItemTitle])

  useEffect(() => {
    const textarea = textareaRefUrl.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [newItemUrl])

  useEffect(() => {
    const textarea = textareaRefDescription.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [newItemDescription])

  const addItem = async () => {
    if (!newItemTitle || !newItemUrl) return

    try {
      await addItemToStore(session, newItemTitle, newItemUrl, newItemDescription)
      setNewItemTitle("")
      setNewItemUrl("")
      setNewItemDescription("")
      setAddingItem(false)
    } catch (error) {
      console.error("Error adding item:", error)
    }
  }

  const deleteItem = async (itemId: string) => {
    try {
      await deleteItemFromStore(session, itemId)
    } catch (error) {
      console.error("Error deleting item:", error)
    }
  }

  if (loading) {
    return <div className="text-secondary-foreground p-16">Loading reading list...</div>
  }

  return (
    <section className="h-full overflow-y-auto bg-background ml-[260px] p-16 text-secondary-foreground">
      <div className="max-w-[800px]">
        <div className="flex flex-col gap-8 text-sm">
          <header className="flex items-center gap-4 text-foreground">
            <Icon icon="fluent:book-24-regular" style={{ fontSize: "38px" }} />
            <h1 className="text-2xl font-semibold">Reading List</h1>
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
                  <button className="hover-text" onClick={addItem}>
                    save
                  </button>
                  <button
                    className="hover-text"
                    onClick={() => setAddingItem(false)}
                  >
                    close
                  </button>
                </div>
                <textarea
                  ref={textareaRefTitle}
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  placeholder="Title"
                  className="w-full py-2 text-2xl font-bold resize-none overflow-hidden bg-background text-foreground placeholder:text-secondary-foreground truncate whitespace-pre-wrap break-words outline-none focus:outline-none"
                  autoFocus
                  rows={1}
                />
                <textarea
                  ref={textareaRefUrl}
                  value={newItemUrl}
                  onChange={(e) => setNewItemUrl(e.target.value)}
                  placeholder="URL"
                  className="w-full py-2 text-sm resize-none overflow-hidden bg-background text-secondary-foreground placeholder:text-secondary-foreground truncate whitespace-pre-wrap break-words outline-none focus:outline-none"
                  rows={1}
                />
                <textarea
                  ref={textareaRefDescription}
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                  placeholder="Description (optional)"
                  className="w-full py-2 text-sm resize-none overflow-hidden bg-background text-secondary-foreground placeholder:text-secondary-foreground truncate whitespace-pre-wrap break-words outline-none focus:outline-none"
                  rows={1}
                />
              </div>
            )}
            <div className="flex flex-col gap-4">
              {readingItems.length === 0 ? (
                <p>Reading list is empty</p>
              ) : (
                readingItems.map((item: ReadingItem) => {
                  return (
                    <div
                      key={item._id}
                      className="flex flex-col text-left gap-1 p-4 border border-border rounded-lg hover-bg group"
                    >
                      <div className="flex justify-between text-foreground">
                      <div className="w-full flex items-start gap-2">
                        <Icon icon="fluent:link-24-regular" style={{ fontSize: "18px" }} className="mt-0.5" />
                        <a href={item.metadata.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {item.title}
                        </a>
                      </div>
                      <div className="text-secondary-foreground text-xs">
                        <button
                          className="invisible group-hover:visible hover-text"
                          onClick={() => deleteItem(item._id)}
                        >
                          delete
                        </button>
                      </div>
                    </div>
                    {item.description && (
                      <div className="ml-[18px] pl-2 text-xs">
                        <p>{item.description}</p>
                      </div>
                    )}
                    <div className="ml-[18px] pl-2 text-xs">
                      <p>{item.metadata.url}</p>
                    </div>
                  </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ReadingListPage