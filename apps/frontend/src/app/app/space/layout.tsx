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
  "flex items-center gap-2 rounded-lg px-3 py-2.5 hover-bg text-sm text-gray-color dark:text-zinc-400 cursor-pointer"

const SpaceLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex h-full gap-1">
      <div className="flex w-[210px] flex-col gap-0.5 rounded-xl border border-button-stroke bg-[#dddddd] px-3 pb-3 pt-5 backdrop-blur-lg dark:border-white/10 dark:bg-white/10">
        <span className="pl-3 text-sm font-medium text-zinc-300">Spaces</span>
        <hr className="my-3 border-zinc-700/40" />
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
