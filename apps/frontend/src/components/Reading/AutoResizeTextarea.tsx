import React, { useEffect, useRef } from "react"

export const AutoResizeTextarea: React.FC<{
  value: string
  onChange: (value: string) => void
  placeholder: string
  className: string
  autoFocus?: boolean
}> = ({ value, onChange, placeholder, className, autoFocus }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [value])

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full py-2 resize-none overflow-hidden bg-background placeholder:text-secondary-foreground truncate whitespace-pre-wrap break-words outline-none focus:outline-none ${className}`}
      autoFocus={autoFocus}
      rows={1}
    />
  )
}