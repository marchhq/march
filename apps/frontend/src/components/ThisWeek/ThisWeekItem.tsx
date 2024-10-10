"use client"
import { useState, useEffect, useRef } from "react"
import { ItemIcon } from "../atoms/ItemIcon"
import { Item } from "@/src/lib/@types/Items/Items"
import { useAuth } from "@/src/contexts/AuthContext"
import useItemsStore, { ItemStoreType } from "@/src/lib/store/items.store"
import { Draggable } from "react-beautiful-dnd"

interface ThisWeekItemProps {
  item: Item
  index: number
}

export const ThisWeekItem: React.FC<ThisWeekItemProps> = ({ item, index }) => {
  const { session } = useAuth()
  const mutateItem = useItemsStore((state: ItemStoreType) => state.mutateItem)
  const textareaRefTitle = useRef<HTMLTextAreaElement>(null)
  const itemRef = useRef<HTMLDivElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(item.title || "")

  useEffect(() => {
    const textarea = textareaRefTitle.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [editedTitle])

  useEffect(() => {
    setEditedTitle(item.title || "")
  }, [item.title])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isEditing &&
        itemRef.current &&
        !itemRef.current.contains(event.target as Node)
      ) {
        handleSaveOrClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isEditing, editedTitle])

  const handleEditItem = () => {
    setIsEditing(true)
  }

  const handleSaveOrClose = async () => {
    if (!session) return console.error("unauthorized user")
    if (editedTitle.trim() !== item.title) {
      try {
        await mutateItem(session, item._id, item.status, editedTitle.trim())
      } catch (error) {
        console.error("error updating item: ", error)
      }
    }
    setIsEditing(false)
  }

  return (
    <Draggable draggableId={item._id} index={index}>
      {(provided, snapshot) => (
        <div
          key={item._id}
          ref={(el) => {
            provided.innerRef(el)
          }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`flex flex-col text-left gap-1 p-4 hover:border border-border rounded-lg hover-bg group ${
            snapshot.isDragging ? "shadow-lg" : ""
          }`}
          onDoubleClick={handleEditItem}
          style={{
            ...provided.draggableProps.style,
            cursor: snapshot.isDragging ? "grabbing" : "grab",
          }}
        >
          <div className="flex justify-between text-foreground">
            <div className="w-full flex items-start gap-2">
              {item.source && <ItemIcon type={item.source} />}
              {isEditing ? (
                <div className="w-full">
                  <textarea
                    ref={textareaRefTitle}
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    placeholder="title"
                    className="w-full resize-none overflow-hidden bg-transparent text-base placeholder:text-secondary-foreground truncate whitespace-pre-wrap break-words outline-none focus:outline-none"
                    rows={1}
                    autoFocus
                  />
                </div>
              ) : (
                <p>{item.title}</p>
              )}
            </div>
            {!isEditing && (
              <div className="text-secondary-foreground text-xs">
                <div className="flex gap-4">
                  <button
                    className="invisible group-hover:visible hover-text"
                    onClick={handleEditItem}
                  >
                    edit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  )
}
