import React, { useState, useCallback, useRef, useEffect } from "react"

import { useAuth } from "@/src/contexts/AuthContext"
import useReadingStore from "@/src/lib/store/reading.store"

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

interface AddItemFormProps {
  blockId: string
}

const AddItemForm: React.FC<AddItemFormProps> = ({ blockId }) => {
  const { session } = useAuth()
  const { addItem: addItemToStore } = useReadingStore()

  const [input, setInput] = useState("")
  const [isPasting, setIsPasting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = useCallback(
    async (value: string) => {
      const trimmedValue = value.trim()
      if (trimmedValue) {
        try {
          setIsSaving(true)
          await addItemToStore(session, blockId, trimmedValue)
          setInput("")
          setIsPasting(false)
        } catch (error) {
          console.error("Error adding item:", error)
        } finally {
          setIsSaving(false)
        }
      }
    },
    [session, blockId, addItemToStore]
  )

  const handleInputChange = useCallback(
    (value: string) => {
      setInput(value)
      if (isPasting && isValidUrl(value)) {
        handleSubmit(value)
        setIsPasting(false)
      }
    },
    [isPasting, handleSubmit]
  )

  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLInputElement>) => {
      const pastedText = event.clipboardData.getData("text")
      setInput(pastedText)
      setIsPasting(true)
      if (isValidUrl(pastedText)) {
        handleSubmit(pastedText)
        event.preventDefault()
      }
    },
    [handleSubmit]
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault()
        handleSubmit(input)
      }
    },
    [input, handleSubmit]
  )

  useEffect(() => {
    const inputElement = inputRef.current
    if (!inputElement) return

    const handlePasteEvent = () => setIsPasting(true)
    const handleInputEvent = () => {
      if (!isValidUrl(input)) {
        setIsPasting(false)
      }
    }

    inputElement.addEventListener("paste", handlePasteEvent)
    inputElement.addEventListener("input", handleInputEvent)

    return () => {
      inputElement.removeEventListener("paste", handlePasteEvent)
      inputElement.removeEventListener("input", handleInputEvent)
    }
  }, [input])

  return (
    <div className="relative">
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        placeholder="Insert a link or just plain text.."
        className="w-full truncate rounded border border-foreground/10 bg-background p-5 pr-28 text-base text-foreground transition-colors focus:border-foreground/50 focus:outline-none"
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        disabled={isSaving}
      />
      {input && !isSaving && (
        <span className="text-foreground/8 absolute right-3 top-1/2 -translate-y-1/2 transform px-1 text-sm">
          Press ↵ to save
        </span>
      )}
      {isSaving && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 transform bg-background px-1 text-xs text-gray-500">
          Saving...
        </span>
      )}
    </div>
  )
}

export default AddItemForm
