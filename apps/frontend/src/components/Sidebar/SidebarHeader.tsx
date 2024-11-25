import { ChevronRight } from "lucide-react"
import Link from "next/link"

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
      <Link href={`/space/${name.toLowerCase().replace(/\s+/g, "-")}`}>
        {name}
      </Link>
    </button>
  )
}
