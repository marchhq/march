"use client"

import { useState, useEffect, useRef } from "react"

import { ItemIcon } from "../atoms/ItemIcon"

export const ThisWeekItem: React.FC = () => {
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
    setEditItemId(item._id)
    setEditedItem({
      title: item.title,
      description: item.description,
    })
  }

  const handleDeleteItem = (itemId: any) => {
    /* if (!session) {
      console.error("user is not authenticated")
      return
    }
    */
    try {
      /*deleteItem(session, itemId)*/
    } catch (error) {
      console.error("error deleting this week item:", error)
    }
  }

  const handleCancelEditItem = () => {
    setEditItemId(null)
    setEditedItem({ title: "", description: "" })
  }

  /*
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
  */

  return (
    <div
      key={"item._id"}
      className="flex flex-col text-left gap-1 p-4 border border-border rounded-lg hover-bg group"
      /* onDoubleClick={() => handleEditItem(item)} */
      onDoubleClick={() =>
        handleEditItem({
          _id: "idexample",
          title: "title example",
          description: "description example",
        })
      }
    >
      <div className="flex justify-between text-foreground">
        <div className="w-full flex items-start gap-2">
          <ItemIcon type={"item.source" || "march"} />
          {editItemId === "idexample" ? (
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
                className="w-full resize-none overflow-hidden bg-transparent text-base placeholder:text-secondary-foreground truncate whitespace-pre-wrap break-words outline-none focus:outline-none"
                rows={1}
              />
            </div>
          ) : (
            <p>{"item.title"}</p>
          )}
        </div>
        <div className="text-secondary-foreground text-xs">
          {editItemId === "idexample" ? (
            <div className="flex gap-4">
              <button
                className="hover-text"
                /* onClick={() => handleSaveEditedItem(item)} */
              >
                save
              </button>
              <button className="hover-text" onClick={handleCancelEditItem}>
                cancel
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <button
                className="invisible group-hover:visible hover-text"
                /*onClick={() => {handleEditItem(item)}}*/
                onClick={() =>
                  handleEditItem({
                    _id: "idexample",
                    title: "title example",
                    description: "description example",
                  })
                }
              >
                edit
              </button>
              <button
                className="invisible group-hover:visible hover-text"
                /* onClick={() => handleDeleteItem(item._id)} */
              >
                del
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="ml-[18px] pl-2 text-xs">
        {editItemId === "idexample" ? (
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
          <p>{"item.description"}</p>
        )}
      </div>
    </div>
  )
}
