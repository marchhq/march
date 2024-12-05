import React, { useEffect, useState } from "react"

import { ChevronDownIcon, ChevronRightIcon } from "lucide-react"
import Link from "next/link"

import { SidebarSpaceLink } from "./SidebarSpaceLink"
import { useAuth } from "@/src/contexts/AuthContext"
import useBlockStore, { Block } from "@/src/lib/store/block.store"

interface CollapsibleProps {
  spaceId: string
  href: string
  label: string
  isActive: boolean
}

export const SidebarCollapsibleSpace = ({
  spaceId,
  href,
  label,
  isActive,
}: CollapsibleProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { session } = useAuth()
  const { fetchBlocks } = useBlockStore()
  const [spaceBlocks, setSpaceBlocks] = useState<Block[]>([])

  useEffect(() => {
    const getBlocks = async () => {
      if (isOpen && session) {
        const result = await fetchBlocks(session, spaceId)
        if (result?.blocks) {
          setSpaceBlocks(result.blocks)
        }
      }
    }

    getBlocks()
  }, [isOpen, spaceId, session, fetchBlocks])

  return (
    <div className="flex flex-col">
      <div className=" flex items-center gap-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center p-1"
        >
          {isOpen ? (
            <ChevronDownIcon className="size-3" />
          ) : (
            <ChevronRightIcon className="size-3" />
          )}
        </button>
        <SidebarSpaceLink
          href={href}
          label={label}
          isActive={isActive}
          isSpace={true}
        />
      </div>

      {isOpen && spaceBlocks.length > 0 && (
        <div
          className={`ml-[0.6rem] mt-1 flex flex-col gap-1 border-l pl-4 ${
            isActive
              ? "border-primary-foreground text-primary-foreground"
              : "border-border"
          }`}
        >
          {spaceBlocks.map((block) => (
            <Link
              key={block._id}
              href={`/spaces/${spaceId}/blocks/${block._id}/items`}
              className="hover-text text-xs"
            >
              {block.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
