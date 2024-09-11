import * as React from "react"

import Link from "next/link"

interface Props {
  children: React.ReactNode
}

const spaces = [
  { id: "1", name: "Notes", slug: "notes" },
  { id: "2", name: "Meeting", slug: "meeting" },
]

const navLinkClassName =
  "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-secondary-foreground hover-bg cursor-pointer"

const SpaceLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="h-full flex gap-1">
      <div className="w-[210px] flex flex-col gap-0.5 px-3 pb-3 pt-5 border border-border rounded-xl bg-secondary">
        <span className="pl-3 text-sm font-medium text-secondary-foreground">
          Spaces
        </span>
        <hr className="my-3 border-border" />
        {spaces.map((space) => (
          <Link
            key={space.id}
            className={navLinkClassName}
            href={`/app/space/${space.slug}`}
          >
            {space.name}
          </Link>
        ))}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

export default SpaceLayout
