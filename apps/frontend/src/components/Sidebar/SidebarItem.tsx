import { ReactNode } from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarItemProps {
  href: string
  children: ReactNode
}

export const SidebarItem = ({ href, children }: SidebarItemProps) => {
  const pathname = usePathname()

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-lg px-2 py-1 text-sm ${
        pathname === href ? "text-primary-foreground" : ""
      }`}
    >
      {children}
    </Link>
  )
}
