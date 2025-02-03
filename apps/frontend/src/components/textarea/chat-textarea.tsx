import * as React from "react"

import { ArrowUpIcon } from "lucide-react"

import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { cn } from "@/src/utils/utils"

interface ChatTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  onSubmit?: () => void
}

export const ChatTextarea = React.forwardRef<
  HTMLTextAreaElement,
  ChatTextareaProps
>(({ label, error, className, onSubmit, ...props }, ref) => {
  return (
    <div className="space-y-2">
      <div className="relative">
        <Textarea
          ref={ref}
          {...props}
          className={cn(error && "border-red-500", className)}
        />
        <div className="flex justify-end">
          <Button
            variant={"outline"}
            type="submit"
            size="icon"
            className="absolute bottom-2 right-2 size-6"
            onClick={onSubmit}
          >
            <ArrowUpIcon className="size-4" />
          </Button>
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
})

ChatTextarea.displayName = "ChatTextarea"
