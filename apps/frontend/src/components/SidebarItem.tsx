"use client"
import React from "react"

import Link from "next/link"

import classNames from "../utils/classNames"

export interface ItemProps {
  href: string
  name: string
  isActive: boolean
  baseUrl?: string
}

const navLinkClassName =
  "flex items-center gap-2 text-secondary-foreground cursor-pointer hover-text"

const SidebarItem: React.FC<ItemProps> = ({
  href,
  name,
  isActive,
  baseUrl = "/",
}) => {
  const activeClass = isActive ? "text-foreground" : ""
  return (
    <Link href={`${baseUrl}${href}`} className={navLinkClassName}>
      <span className={classNames(activeClass, "truncate")}>{name}</span>
    </Link>
  )
}

export default SidebarItem
