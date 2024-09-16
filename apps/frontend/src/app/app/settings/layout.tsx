import * as React from "react"

import Link from "next/link"

import { Settings } from "@/src/lib/icons/Settings"

interface Props {
  children: React.ReactNode
}

const options = [
  { id: "1", name: "Account", slug: "account" },
  { id: "2", name: "Preference", slug: "preference" },
  { id: "3", name: "Calendars", slug: "calendars" },
  { id: "4", name: "Integrations", slug: "integrations" },
  { id: "5", name: "About", slug: "about" },
]

const navLinkClassName =
  "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-secondary-foreground hover-bg cursor-pointer"

const SpaceLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex h-full gap-1">
      <div className="flex w-[210px] flex-col gap-0.5 rounded-xl border border-border bg-secondary px-3 pb-3 pt-5">
        <div className="flex items-center pl-3 text-sm font-medium text-secondary-foreground">
          <Settings />
          <span className="ml-2">SETTINGS</span>
        </div>
        <hr className="my-3 border-border" />
        {options.map((option) => (
          <Link
            key={option.id}
            className={navLinkClassName}
            href={`/app/settings/${option.slug}`}
          >
            {option.name}
          </Link>
        ))}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

export default SpaceLayout
