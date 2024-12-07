"use client"

import React, { useState, useEffect } from "react"

import { usePathname } from "next/navigation"

import { SidebarCollapsibleSpace } from "./SidebarCollapsibleSpace"
import { useAuth } from "@/src/contexts/AuthContext"
import { useSidebarCollapse } from "@/src/contexts/SidebarCollapseContext"
import useBlockStore from "@/src/lib/store/block.store"
import useSpaceStore from "@/src/lib/store/space.store"

export const SidebarSpaces: React.FC = () => {
  const pathname = usePathname()
  const { session } = useAuth()
  const [spaceBlocks, setSpaceBlocks] = useState<Record<string, string>>({})

  const [toggle, setToggle] = useState(true)
  const { isCollapsed, toggleCollapse } = useSidebarCollapse()

  const { error, spaces, fetchSpaces } = useSpaceStore()
  const { fetchBlocks, createBlock } = useBlockStore()

  useEffect(() => {
    if (toggle) {
      fetchSpaces(session)
    }
  }, [toggle, session, fetchSpaces])

  useEffect(() => {
    const fetchBlocksForSpaces = async () => {
      if (!spaces || !toggle) return

      const blockMap: Record<string, string> = {}

      for (const space of spaces) {
        try {
          const result = await fetchBlocks(session, space._id)

          if (result?.noBlocks) {
            await createBlock(session, space._id)
            const { blockId } = useBlockStore.getState()
            if (blockId) {
              blockMap[space._id] = blockId
            } else if (result?.blocks?.[0]?._id) {
              blockMap[space._id] = result.blocks[0]._id
            }
          }
        } catch (err) {
          console.error(`error fetching blocks for space ${space._id}:`, err)
        }
      }
      setSpaceBlocks(blockMap)
    }

    fetchBlocksForSpaces()
  }, [session, toggle, fetchBlocks, createBlock, spaces])

  useEffect(() => {
    if (toggle) {
      setToggle(!isCollapsed)
    }
  }, [toggle, isCollapsed])

  return (
    <div className="flex flex-col">
      <div className="flex flex-col ">
        {spaces?.map((space) => (
          <SidebarCollapsibleSpace
            key={space._id}
            spaceId={space._id}
            href={
              spaceBlocks[space._id]
                ? `/spaces/${space._id}/blocks/${spaceBlocks[space._id]}/items`
                : `/spaces/${space._id}`
            }
            label={space.name.toLowerCase()}
            isActive={pathname.includes(`/spaces/${space._id}`)}
          />
        ))}
        {error && (
          <div className="truncate text-xs text-danger-foreground">
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  )
}
