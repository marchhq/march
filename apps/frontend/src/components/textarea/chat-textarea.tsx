import * as React from "react"

import { ArrowUpIcon } from "lucide-react"

import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { cn } from "@/src/utils/utils"

interface ChatTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  onSubmit: (e: React.FormEvent) => void
  disabled?: boolean
}

export const ChatTextarea = React.forwardRef<
  HTMLTextAreaElement,
  ChatTextareaProps
>(({ label, error, className, onSubmit, disabled, ...props }, ref) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSubmit(e)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <div className="relative">
        <Textarea
          ref={ref}
          className={cn("pr-10 resize-none", className)}
          {...props}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <Button
          variant="outline"
          type="submit"
          size="icon"
          className="absolute bottom-2 right-2 size-6"
          disabled={disabled}
        >
          <ArrowUpIcon className="size-4" />
        </Button>
      </div>
    </form>
  )
})

ChatTextarea.displayName = "ChatTextarea"
