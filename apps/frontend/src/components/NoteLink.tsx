import Link from "next/link"

import classNames from "@/src/utils/classNames"

interface NoteLinkProps {
  note: {
    href: string
    title: string
  }
  isActive: boolean
}

export function NoteLink({ note, isActive }: NoteLinkProps) {
  return (
    <Link href={note.href} className="flex flex-1 items-center">
      <div className="flex items-center py-0.5 pl-2">
        <span
          className={classNames(
            "w-1 h-1 rounded-full mr-2",
            isActive ? "bg-[#F9CF27]" : "bg-transparent"
          )}
        />
        <p
          className={classNames(
            "truncate text-primary-foreground text-sm hover:text-foreground",
            isActive
          )}
        >
          {note.title || "Untitled"}
        </p>
      </div>
    </Link>
  )
}
