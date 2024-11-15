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
  blockId: string
  spaceId: string
}

interface ItemData {
  title: string
  type: string
  description?: string
  metadata?: {
    url: string
  }
}

const AddItemForm: React.FC<AddItemFormProps> = ({ blockId, spaceId }) => {
  const { session } = useAuth()
  const { addItem: addItemToStore, fetchReadingList } = useReadingStore()

  const [input, setInput] = useState("")
  const [isPasting, setIsPasting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showWarning, setShowWarning] = useState(false) // State for warning
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (value: string) => {
    const trimmedValue = value.trim()

    if (trimmedValue) {
      const linkDetected = isLink(trimmedValue) // Check whether the entered value is a link or not

      // If it's a link and starts with http://, show a warning
      if (linkDetected && /^http:\/\//i.test(trimmedValue)) {
        setShowWarning(true)
        return // Prevent submission
      }

      // If it's a link and doesn't start with https://, prepend https://
      const finalValue =
        linkDetected && !/^https:\/\//i.test(trimmedValue)
          ? `https://${trimmedValue}`
          : trimmedValue

      try {
        setIsSaving(true)
        // Prepare the item object
        const itemData: ItemData = {
          title: finalValue,
          type: linkDetected ? "link" : "text",
          description: "",
        }

        // Add metadata only if linkDetected is true
        if (linkDetected) {
          itemData.metadata = {
            url: finalValue,
          }
        }

        await addItemToStore(session, spaceId, blockId, itemData)
        setInput("")
        setIsPasting(false)
        await fetchReadingList(session, blockId, spaceId)
        setShowWarning(false)
      } catch (error) {
        console.error("Error adding item:", error)
      } finally {
        setIsSaving(false)
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
    <div className="relative flex w-3/4 items-center gap-2">
      <div className="flex w-full flex-col gap-1">
        <div className="relative">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="paste link or just plain text.."
            className="w-full resize-none overflow-hidden truncate whitespace-pre-wrap break-words bg-background text-sm text-foreground outline-none placeholder:text-secondary-foreground focus:outline-none"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            disabled={isSaving}
          />
          {input && !isSaving && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-secondary-foreground">
              press ↵ to save
            </span>
          )}
        </div>
        {showWarning && (
          <span className="animate-shake text-sm text-red-500">
            Warning: Using http is dangerous! Please use https.
          </span>
        )}
      </div>
      {isSaving && (
        <span className="bg-background text-xs text-secondary-foreground">
          Saving...
        </span>
      )}
    </div>
  )
}

export default AddItemForm
