import React from "react"

import Link from "next/link"

import classNames from "@/src/utils/classNames"

export const SidebarSpaceLink = ({
  href,
  label,
  customClass,
  isActive,
  isSpace,
}: {
  href: string
  label: string
  customClass: string
  isActive?: boolean
  isSpace?: boolean
}) => {
  const activeClass = isActive && "text-foreground"
  const activeClassSpace = isSpace && isActive && "border-secondary-foreground"
  return (
    <Link
      className={classNames(
        "truncate",
        customClass,
        activeClass,
        activeClassSpace
      )}
      href={href}
    >
      <span>{label}</span>
    </Link>
  )
}
