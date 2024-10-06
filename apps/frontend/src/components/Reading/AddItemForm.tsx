import React, { useState, useCallback, useRef, useEffect } from "react"
import { useAuth } from "@/src/contexts/AuthContext"
import useReadingStore from "@/src/lib/store/reading.store"
import { AutoResizeTextarea } from "./AutoResizeTextarea"

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
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = useCallback(async (value: string) => {
    const trimmedValue = value.trim()
    if (trimmedValue) {
      try {
        setIsSaving(true)
        const isUrl = isValidUrl(trimmedValue)
        await addItemToStore(session, blockId, trimmedValue, isUrl)
        setInput("")
        setIsPasting(false)
      } catch (error) {
        console.error("Error adding item:", error)
      } finally {
        setIsSaving(false)
      }
    }
  }, [session, blockId, addItemToStore])

  const handleInputChange = useCallback((value: string) => {
    setInput(value)
    if (isPasting && isValidUrl(value)) {
      handleSubmit(value)
      setIsPasting(false)
    }
  }, [isPasting, handleSubmit])

  const handlePaste = useCallback((event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = event.clipboardData.getData('text')
    setInput(pastedText)
    setIsPasting(true)
    if (isValidUrl(pastedText)) {
      handleSubmit(pastedText)
      event.preventDefault()
    }
  }, [handleSubmit])

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSubmit(input)
    }
  }, [input, handleSubmit])

  useEffect(() => {
    const inputElement = inputRef.current
    if (!inputElement) return

    const handlePasteEvent = () => setIsPasting(true)
    const handleInputEvent = () => {
      if (!isValidUrl(input)) {
        setIsPasting(false)
      }
    }

    inputElement.addEventListener('paste', handlePasteEvent)
    inputElement.addEventListener('input', handleInputEvent)

    return () => {
      inputElement.removeEventListener('paste', handlePasteEvent)
      inputElement.removeEventListener('input', handleInputEvent)
    }
  }, [input])

  return (
    <div className="mb-4">
      {/* Show "Press enter to save" message above the input for non-URL text */}
      {input && !isValidUrl(input) && !isSaving && (
        <div className="text-xs text-gray-500 mb-1">
          Press enter to save
        </div>
      )}
      {/* Show "Saving..." message when an item is being saved */}
      {isSaving && (
        <div className="text-xs text-gray-500 mb-1">
          Saving...
        </div>
      )}
      <AutoResizeTextarea
        ref={inputRef}
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        placeholder="Insert a link or just plain text.."
        className="text-base text-foreground w-full"
        autoFocus
        disabled={isSaving}
      />
    </div>
  )
}

export default AddItemForm