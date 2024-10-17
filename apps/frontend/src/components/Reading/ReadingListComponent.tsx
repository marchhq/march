"use client"

import React, { useEffect, useCallback } from "react"

import AddItemForm from "@/src/components/Reading/AddItemForm"
import ItemsList from "@/src/components/Reading/ItemsList"
import { useAuth } from "@/src/contexts/AuthContext"
import { useSpace } from "@/src/hooks/useSpace"
import useBlockStore from "@/src/lib/store/block.store"

const ReadingListComponent: React.FC = () => {
  const { session } = useAuth()
  const { spaces } = useSpace() || { spaces: [] }

  const { blocks, blockId, isLoading, error, fetchBlocks } = useBlockStore()

  // Load the reading list space and block
  const loadReadingList = useCallback(async () => {
    try {
      const readingListSpace = spaces.find(
        (space) => space.name.toLowerCase() === "reading list"
      )

      if (readingListSpace) {
        const spaceId = readingListSpace._id

        await fetchBlocks(session, spaceId)
      } else {
        throw new Error("Reading list space not found.")
      }
    } catch (err) {
      console.error(err)
    }
  }, [spaces, session, fetchBlocks])

  useEffect(() => {
    if (spaces.length > 0 && !blockId) {
      loadReadingList()
    }
  }, [spaces, blockId, loadReadingList])

  if (isLoading) {
    return (
      <div className="p-16 text-secondary-foreground">
        Loading reading list...
      </div>
    )
  }

  if (error) {
    return <div className="p-16 text-red-500">{error}</div>
  }

  return (
    <section className="h-full overflow-y-auto bg-background text-secondary-foreground">
      <div className="px-4 pb-16 sm:px-6 lg:px-8">
        {blockId && (
          <div className="ml-[10%] flex w-3/4 flex-col gap-8 text-base">
            <div className="sticky top-0 z-10 grid h-48 items-end bg-background">
              <AddItemForm
                blockId={blockId}
                spaceId={
                  blocks.find((block) => block._id === blockId)?.space || ""
                }
              />
            </div>
            <div className="flex-1">
              <ItemsList
                blockId={blockId}
                spaceId={
                  blocks.find((block) => block._id === blockId)?.space || ""
                }
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ReadingListComponent
