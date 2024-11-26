"use client"

import React, { useEffect, useCallback, useState } from "react"

import { ReadingExpandModal } from "./ReadingExpandModal"
import AddItemForm from "@/src/components/Reading/AddItemForm"
import ItemsList from "@/src/components/Reading/ItemsList"
import { useAuth } from "@/src/contexts/AuthContext"
import { useSpace } from "@/src/hooks/useSpace"
import { ReadingItem } from "@/src/lib/@types/Items/Reading"
import useBlockStore from "@/src/lib/store/block.store"
import useReadingStore from "@/src/lib/store/reading.store"

interface ReadingListComponentProps {
  spaceId: string
  blockId: string
}

const ReadingListComponent: React.FC<ReadingListComponentProps> = ({
  spaceId,
  blockId,
}) => {
  const { session } = useAuth()

  const { fetchReadingList, readingItems, currentItem, setCurrentItem } =
    useReadingStore()

  useEffect(() => {
    const loadReadingListItems = async () => {
      await fetchReadingList(session, spaceId, blockId)
    }

    loadReadingListItems()
  }, [session, blockId, spaceId, fetchReadingList])

  const handleExpand = useCallback(
    (item: ReadingItem) => {
      if (!currentItem || currentItem._id !== item._id) {
        setCurrentItem(item)
      }
    },
    [currentItem, setCurrentItem]
  )

  return (
    <section className="size-full overflow-y-auto bg-background text-secondary-foreground">
      <div className="p-16 px-8 pb-8 sm:px-8 lg:px-14">
        {blockId && (
          <div className="flex w-3/4 flex-col gap-3 text-base">
            <div className="sticky top-0 z-10 grid bg-background">
              <AddItemForm blockId={blockId} spaceId={spaceId} />
            </div>
            <div className="flex-1">
              <ItemsList
                blockId={blockId}
                spaceId={spaceId}
                items={readingItems}
                handleExpand={handleExpand}
              />
            </div>
          </div>
        )}
      </div>
      {blockId && <ReadingExpandModal blockId={blockId} spaceId={spaceId} />}
    </section>
  )
}

export default ReadingListComponent
