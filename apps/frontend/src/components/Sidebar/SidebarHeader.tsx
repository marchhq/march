import { ChevronRight } from "lucide-react"

interface SidebarHeaderProps {
  name: string
  isOpen: boolean
  onToggle: () => void
}

export const SidebarHeader = ({
  name,
  isOpen,
  onToggle,
}: SidebarHeaderProps) => {
  return (
    <button
      onClick={onToggle}
      className="flex min-h-5 items-center gap-1 font-medium outline-none"
    >
      <ChevronRight
        className={`size-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
      />
      <span className="text-sm">{name}</span>
    </button>
  )
}
