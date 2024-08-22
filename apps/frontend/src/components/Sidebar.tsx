"use client"
import * as React from "react"

import { Tray, Sun, User, Stack, Info, Gear } from "@phosphor-icons/react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navLinkClassName =
  "flex items-center gap-2 rounded-lg px-3 py-2.5 hover-bg text-sm text-gray-color dark:text-zinc-400 cursor-pointer"

const Sidebar: React.FC = () => {
  const pathname = usePathname()

  if (pathname.includes("auth")) {
    return null
  } else {
    return (
      <div className="flex flex-col gap-0.5 rounded-xl border border-button-stroke bg-[#dddddd] px-3 pb-3 pt-5 backdrop-blur-lg dark:border-white/10 dark:bg-white/10">
        <div className="px-3 font-semibold dark:text-zinc-300">
          {/* TODO: Logo Here */}
        </div>
        <hr className="mb-3 mt-6 border-zinc-700/40" />
        <Link className={navLinkClassName} href={"/app/inbox/"}>
          <Tray size={21} weight="duotone" />
        </Link>
        <Link className={navLinkClassName} href={"/app/today/"}>
          <Sun size={21} weight="duotone" />
        </Link>
        <Link className={navLinkClassName} href={"/app/collections/"}>
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
