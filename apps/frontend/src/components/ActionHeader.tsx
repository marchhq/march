import { memo, useEffect, useRef } from "react"

import { PlusIcon } from "@radix-ui/react-icons"
import { Layers } from "lucide-react"

interface ActionHeaderProps {
  closeToggle: boolean
  onAdd?: () => Promise<any>
  onClose: () => void
  addButtonLabel?: string
  onButtonPositionChange: (position: { top: number; right: number }) => void
}

const ActionHeader = ({
  closeToggle,
  onAdd,
  onClose,
  onButtonPositionChange,
  addButtonLabel,
}: ActionHeaderProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        onButtonPositionChange({
          top: rect.bottom,
          right: window.innerWidth - rect.right,
        })
      }
    }

    updatePosition()
    window.addEventListener("resize", updatePosition)
    return () => window.removeEventListener("resize", updatePosition)
  }, [onButtonPositionChange])

  return (
    <div className="flex w-full items-center justify-end gap-4">
      <button
        onClick={onAdd}
        className="hover-bg flex items-center gap-1 truncate rounded-md px-1 text-secondary-foreground"
        title={addButtonLabel || "add new note"}
      >
        <PlusIcon />
        {addButtonLabel && <span>{addButtonLabel}</span>}
      </button>
      <button
        ref={buttonRef}
        className={`hover-text flex items-center ${!closeToggle ? "text-foreground" : ""}`}
        onClick={onClose}
      >
        <Layers size={16} className="hover-text text-secondary-foreground" />
      </button>
    </div>
  )
}

export default memo(ActionHeader)
