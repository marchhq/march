"use client"

import React, { useEffect, useCallback } from "react"

import { ReadingExpandModal } from "./ReadingExpandModal"
import AddItemForm from "@/src/components/Reading/AddItemForm"
import ItemsList from "@/src/components/Reading/ItemsList"
import { useAuth } from "@/src/contexts/AuthContext"
import { useSpace } from "@/src/hooks/useSpace"
import { ReadingItem } from "@/src/lib/@types/Items/Reading"
import useBlockStore from "@/src/lib/store/block.store"
import useReadingStore from "@/src/lib/store/reading.store"

const ReadingListComponent: React.FC = () => {
  const { session } = useAuth()
  const { spaces } = useSpace() || { spaces: [] }

  const { blocks, blockId, isLoading, error, fetchBlocks, createBlock } =
    useBlockStore()
  const { fetchReadingList, readingItems, currentItem, setCurrentItem } =
    useReadingStore()

  // Load the reading list space and block
  const loadReadingList = useCallback(async () => {
    try {
      const readingListSpace = spaces.find(
        (space) => space.name.toLowerCase() === "reading list"
      )

      if (readingListSpace) {
        const spaceId = readingListSpace._id

        const result = await fetchBlocks(session, spaceId)
        // Check if no blocks were returned
        if (result?.noBlocks) {
          await createBlock(session, spaceId) // Create a new block
        }
      } else {
        throw new Error("Reading list space not found.")
      }
    } catch (err) {
      console.error(err)
    }
  }, [spaces, session, fetchBlocks, createBlock])

  // Load reading list items if blockId is available
  const loadReadingListItems = useCallback(async () => {
    if (blockId) {
      const spaceId = blocks.find((block) => block._id === blockId)?.space
      if (spaceId) {
        await fetchReadingList(session, blockId, spaceId)
      }
    }
  }, [blockId, blocks, fetchReadingList, session])

  useEffect(() => {
    if (spaces.length > 0 && !blockId) {
      loadReadingList()
    } else if (spaces.length > 0 && blockId) {
      loadReadingListItems()
    }
  }, [spaces, blockId, loadReadingList, loadReadingListItems])

  const handleExpand = useCallback(
    (item: ReadingItem) => {
      if (!currentItem || currentItem._id !== item._id) {
        setCurrentItem(item)
      }
    },
    [currentItem, setCurrentItem]
  )

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
    <section className="size-full overflow-y-auto bg-background text-secondary-foreground">
      <div className="p-16 px-8 pb-8 sm:px-8 lg:px-14">
        {blockId && (
          <div className="flex w-3/4 flex-col gap-3 text-base">
            <div className="sticky top-0 z-10 grid bg-background">
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
                items={readingItems}
                handleExpand={handleExpand}
              />
            </div>
          </div>
        )}
      </div>
      {blockId && (
        <ReadingExpandModal
          blockId={blockId}
          spaceId={blocks.find((block) => block._id === blockId)?.space || ""}
        />
      )}
    </section>
  )
}

export default ReadingListComponent
