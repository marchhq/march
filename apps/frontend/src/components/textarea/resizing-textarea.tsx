"use client"

import React, { useRef, useEffect, KeyboardEvent, ChangeEvent } from "react"

import { cn } from "@/src/utils/utils"

interface AutoResizingTextareaProps {
  value: string
  onChange: (value: string) => void
  onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void
  onBlur?: () => void
  placeholder?: string
  className?: string
  rows?: number
  showAddingItemHint?: boolean
  error?: string | null
}

export function AutoResizingTextarea({
  value,
  onChange,
  onKeyDown,
  onBlur,
  placeholder = "Add anything...",
  className,
  rows = 1,
  showAddingItemHint = false,
  error,
}: AutoResizingTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value])

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  return (
    <div onBlur={onBlur}>
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full resize-none overflow-hidden truncate whitespace-pre-wrap break-words bg-background pl-5 text-sm text-foreground outline-none placeholder:text-secondary-foreground focus:outline-none",
            className
          )}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          rows={rows}
        />

        {showAddingItemHint && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-secondary-foreground">
            press ↵ to save
          </span>
        )}

        {error && (
          <div className="truncate text-xs text-danger-foreground">
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  )
}
