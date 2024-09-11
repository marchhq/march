"use client"
import * as React from "react"

import { Tray, Sun, User, Stack, Info, Gear } from "@phosphor-icons/react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navLinkClassName =
  "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-secondary-foreground hover-bg cursor-pointer"

const Sidebar: React.FC = () => {
  const pathname = usePathname()

  if (pathname.includes("auth")) {
    return null
  } else {
    return (
      <div className="flex flex-col gap-0.5 px-3 pb-3 pt-5 border border-border rounded-xl bg-secondary">
        <div className="px-3 pt-2 font-semibold dark:text-zinc-300">
          {/* TODO: Logo Here */}
        </div>
        <hr className="mb-3 mt-6 border-border" />
        <Link className={navLinkClassName} href={"/app/inbox/"}>
          <Tray size={21} weight="duotone" />
        </Link>
        <Link className={navLinkClassName} href={"/app/today/"}>
          <Sun size={21} weight="duotone" />
        </Link>
        <Link className={navLinkClassName} href={"/app/space/"}>
          <Stack size={21} weight="duotone" />
        </Link>
        <div className="mt-auto text-zinc-400">
          <button className={navLinkClassName}>
            <Info size={21} weight="duotone" />
          </button>
          <Link className={navLinkClassName} href={"/app/profile/"}>
            <User size={21} weight="duotone" />
          </Link>
          <Link className={navLinkClassName} href={"/app/settings/"}>
            <Gear size={21} weight="duotone" />
          </Link>
        </div>
      </div>
    )
  }
}

export default Sidebar
