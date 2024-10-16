import React, { useState, useCallback, useRef, useEffect } from "react"

import { useAuth } from "@/src/contexts/AuthContext"
import useReadingStore from "@/src/lib/store/reading.store"
import { isLink } from "@/src/utils/helpers"

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

interface AddItemFormProps {
  blockId: string;
  spaceId: string;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ blockId, spaceId }) => {
  const { session } = useAuth()
  const { addItem: addItemToStore, fetchReadingList } = useReadingStore()

  const [input, setInput] = useState("")
  const [isPasting, setIsPasting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (value: string) => {
    const trimmedValue = value.trim();
    
    if (trimmedValue) {
      const linkDetected = isLink(trimmedValue); // Check whether the entered value is a link or not
      
      // If it's a link and doesn't start with https://, prepend https://
      const finalValue = linkDetected && !/^https:\/\//i.test(trimmedValue) 
        ? `https://${trimmedValue}` 
        : trimmedValue;
  
      try {
        setIsSaving(true);
        await addItemToStore(session, spaceId, blockId, finalValue, linkDetected ? "link" : "text");
        setInput("");
        setIsPasting(false);
        await fetchReadingList(session, blockId, spaceId);
      } catch (error) {
        console.error("Error adding item:", error);
      } finally {
        setIsSaving(false);
      }
    }
  }
  
    
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
    <div className="relative flex items-center gap-2 w-3/4">
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        placeholder="Insert a link or just plain text.."
        className="w-3/4 truncate bg-background p-4 text-base text-foreground transition-colors outline-none"
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        disabled={isSaving}
      />
      {input && !isSaving && (
        <span className="text-foreground/8 text-sm">
          Press ↵ to save
        </span>
      )}
      {isSaving && (
        <span className="bg-background text-xs text-gray-500">
          Saving...
        </span>
      )}
    </div>
  )
}

export default AddItemForm
