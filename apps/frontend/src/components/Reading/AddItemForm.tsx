import React, { useState } from "react"
import { useAuth } from "@/src/contexts/AuthContext"
import useReadingStore from "@/src/lib/store/reading.store"
import { PlusIcon } from "@radix-ui/react-icons"
import { AutoResizeTextarea } from "./AutoResizeTextarea"

interface AddItemFormProps {
  blockId: string | null
}

const AddItemForm: React.FC<AddItemFormProps> = ({ blockId }) => {
  const { session } = useAuth()
  const { addItem: addItemToStore } = useReadingStore()

  const [addingItem, setAddingItem] = useState(false)
  const [newItemTitle, setNewItemTitle] = useState("")
  const [newItemUrl, setNewItemUrl] = useState("")
  const [newItemDescription, setNewItemDescription] = useState("")
  const [isUrlInput, setIsUrlInput] = useState(true)

  const addItem = async () => {
    if (!blockId) return
    if (isUrlInput && !newItemUrl) return
    if (!isUrlInput && !newItemTitle) return

    try {
      if (isUrlInput) {
        await addItemToStore(session, blockId, newItemUrl, true)
        setNewItemUrl("")
      } else {
        await addItemToStore(
          session,
          blockId,
          newItemTitle,
          false,
          newItemDescription
        )
        setNewItemTitle("")
        setNewItemDescription("")
      }
      setAddingItem(false)
    } catch (error) {
      console.error("Error adding item:", error)
    }
  }

  if (!addingItem) {
    return (
      <button
        className="flex items-center gap-2 text-secondary-foreground hover:text-foreground"
        onClick={() => setAddingItem(true)}
      >
        <PlusIcon />
        <span>Click to Add An Item</span>
      </button>
    )
  }

  return (
    <div className="mb-4">
      <div className="flex justify-end gap-4 text-sm mb-2">
        <button
          className={`hover:text-foreground ${
            isUrlInput ? "text-foreground" : ""
          }`}
          onClick={() => setIsUrlInput(true)}
        >
          URL based
        </button>
        <button
          className={`hover:text-foreground ${
            !isUrlInput ? "text-foreground" : ""
          }`}
          onClick={() => setIsUrlInput(false)}
        >
          Text based
        </button>
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
      {isUrlInput ? (
        <AutoResizeTextarea
          value={newItemUrl}
          onChange={setNewItemUrl}
          placeholder="URL"
          className="text-base text-foreground"
          autoFocus
        />
      ) : (
        <>
          <AutoResizeTextarea
            value={newItemTitle}
            onChange={setNewItemTitle}
            placeholder="Title"
            className="text-2xl font-bold text-foreground"
            autoFocus
          />
          <AutoResizeTextarea
            value={newItemDescription}
            onChange={setNewItemDescription}
            placeholder="Description (optional)"
            className="text-base text-foreground"
          />
        </>
      )}
    </div>
  )
}

export default AddItemForm