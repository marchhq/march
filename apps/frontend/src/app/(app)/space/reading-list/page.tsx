"use client"

import React, { useEffect, useState, useRef } from "react"
import { useAuth } from "@/src/contexts/AuthContext"
import { useSpace } from "@/src/hooks/useSpace"
import { Icon } from "@iconify-icon/react"
import { PlusIcon } from "@radix-ui/react-icons"
import useReadingStore from "@/src/lib/store/reading.store"
import { type ReadingItem } from "@/src/lib/@types/Items/Reading"

const ReadingListPage: React.FC = () => {
  const { session } = useAuth()
  const { spaces } = useSpace() || { spaces: [] }
  const {
    readingItems,
    fetchReadingList,
    addItem: addItemToStore,
    deleteItem: deleteItemFromStore,
  } = useReadingStore()

  const [loading, setLoading] = useState(true)
  const [blockId, setBlockId] = useState<string | null>(null)

  useEffect(() => {
    const loadReadingList = async () => {
      setLoading(true)
      const readingListSpace = spaces.find(
        (space) => space.name.toLowerCase() === "reading list"
      )
      if (readingListSpace) {
        const fetchedBlockId = readingListSpace.blocks[0]
        setBlockId(fetchedBlockId)
        await fetchReadingList(session, fetchedBlockId)
      }
      setLoading(false)
    }

    if (spaces.length > 0 && !blockId) {
      loadReadingList()
    }
  }, [spaces, session, fetchReadingList, blockId])

  const [addingItem, setAddingItem] = useState(false)
  const [newItemTitle, setNewItemTitle] = useState("")
  const [newItemUrl, setNewItemUrl] = useState("")
  const [newItemDescription, setNewItemDescription] = useState("")
  const textareaRefTitle = useRef<HTMLTextAreaElement>(null)
  const textareaRefUrl = useRef<HTMLTextAreaElement>(null)
  const textareaRefDescription = useRef<HTMLTextAreaElement>(null)

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
    if (!newItemTitle || !newItemUrl || !blockId) return

    try {
      await addItemToStore(
        session,
        blockId,
        newItemTitle,
        newItemUrl,
        newItemDescription
      )
      setNewItemTitle("")
      setNewItemUrl("")
      setNewItemDescription("")
      setAddingItem(false)
    } catch (error) {
      console.error("Error adding item:", error)
    }
  }

  const deleteItem = async (itemId: string) => {
    if (!blockId) return

    try {
      await deleteItemFromStore(session, blockId, itemId)
    } catch (error) {
      console.error("Error deleting item:", error)
    }
  }

  if (loading) {
    return (
      <div className="text-secondary-foreground p-16">
        Loading reading list...
      </div>
    )
  }

  return (
    <section className="h-full overflow-y-auto bg-background ml-[260px] p-16 text-secondary-foreground">
      <div className="max-w-[800px]">
        <div className="flex flex-col gap-8 text-base">
          {!addingItem ? (
            <button
              className="flex items-center gap-2 text-secondary-foreground hover:text-foreground"
              onClick={() => setAddingItem(true)}
            >
              <PlusIcon />
              <span>Click to Add An Item</span>
            </button>
          ) : (
            <div className="mb-4">
              <div className="flex justify-end gap-4 text-sm mb-2">
                <button className="hover:text-foreground" onClick={addItem}>
                  save
                </button>
                <button
                  className="hover:text-foreground"
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
                className="w-full py-2 text-base resize-none overflow-hidden bg-background text-secondary-foreground placeholder:text-secondary-foreground truncate whitespace-pre-wrap break-words outline-none focus:outline-none"
                rows={1}
              />
              <textarea
                ref={textareaRefDescription}
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
                placeholder="Description (optional)"
                className="w-full py-2 text-base resize-none overflow-hidden bg-background text-secondary-foreground placeholder:text-secondary-foreground truncate whitespace-pre-wrap break-words outline-none focus:outline-none"
                rows={1}
              />
            </div>
          )}
          <div className="flex flex-col gap-8">
            {readingItems.length === 0 ? (
              <p>Reading list is empty</p>
            ) : (
              readingItems.map((item: ReadingItem) => {
                return (
                  <div key={item._id} className="flex items-start gap-4 group">
                    <Icon
                      icon="ph:circle-bold"
                      className="text-secondary-foreground mt-1"
                      style={{ fontSize: "16px" }}
                    />
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <h3 className="text-foreground font-semibold text-lg flex items-center">
                          {item.title}
                          <a
                            href={item.metadata.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 flex items-center ml-2"
                          >
                            <Icon
                              icon="fluent:link-24-regular"
                              className="text-secondary-foreground hover:text-foreground"
                              style={{ fontSize: "20px" }}
                            />
                          </a>
                        </h3>
                      </div>
                      {item.description && (
                        <p className="text-secondary-foreground text-base mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <button
                      className="invisible group-hover:visible text-secondary-foreground hover:text-foreground text-sm"
                      onClick={() => deleteItem(item._id)}
                    >
                      delete
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ReadingListPage
