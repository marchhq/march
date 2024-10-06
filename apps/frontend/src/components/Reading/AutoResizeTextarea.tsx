import React, { useEffect, useRef, forwardRef } from "react"

interface AutoResizeTextareaProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  className: string
  autoFocus?: boolean
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>
  onPaste?: React.ClipboardEventHandler<HTMLTextAreaElement>
  disabled?: boolean
}

export const AutoResizeTextarea = forwardRef<HTMLTextAreaElement, AutoResizeTextareaProps>(
  ({ value, onChange, placeholder, className, autoFocus, onKeyDown, onPaste, disabled }, forwardedRef) => {
    const innerRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
      const textarea = innerRef.current
      if (textarea) {
        textarea.style.height = "auto"
        textarea.style.height = `${textarea.scrollHeight}px`
      }
    }, [value])

    React.useImperativeHandle(forwardedRef, () => innerRef.current!, [])

    return (
      <textarea
        ref={innerRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full py-2 resize-none overflow-hidden bg-background placeholder:text-secondary-foreground truncate whitespace-pre-wrap break-words outline-none focus:outline-none ${className}`}
        autoFocus={autoFocus}
        rows={1}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        disabled={disabled}
      />
    )
  }
)

AutoResizeTextarea.displayName = 'AutoResizeTextarea'