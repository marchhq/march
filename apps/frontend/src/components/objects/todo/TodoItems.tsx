"use client"

import React from "react"

import { usePathname } from "next/navigation"

import { useAuth } from "@/src/contexts/AuthContext"
import { useItems } from "@/src/queries/useItem"

export const TodoItems: React.FC = () => {
  const { session } = useAuth()
  const pathname = usePathname()
  const slug = pathname?.split("/objects/")[1]?.replace("/", "")

  const { data: items } = useItems(session, slug)

  return (
    <div>
      type {slug}
      <section>
        <pre>{JSON.stringify(items, null, 2)}</pre>
      </section>
    </div>
  )
}
