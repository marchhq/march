"use client"

import React, { useEffect, useState, useCallback } from "react"

import AddItemForm from "@/src/components/Reading/AddItemForm"
import ItemsList from "@/src/components/Reading/ItemsList"
import { useAuth } from "@/src/contexts/AuthContext"
import { useSpace } from "@/src/hooks/useSpace"
import useReadingStore from "@/src/lib/store/reading.store"

const ReadingListComponent: React.FC = () => {
  const { session } = useAuth()
  const { spaces } = useSpace() || { spaces: [] }
  const { fetchReadingList } = useReadingStore()

  const [loading, setLoading] = useState(true)
  const [blockId, setBlockId] = useState<string | null>(null)
  const [readingListSpaceId, setReadingListSpaceId] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  const loadReadingList = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const readingListSpace = spaces.find(
        (space) => space.name.toLowerCase() === "reading list"
      )
      if (readingListSpace) {
        setReadingListSpaceId(readingListSpace._id)
        const fetchedBlockId = readingListSpace.blocks[0]
        console.log(readingListSpace._id)
        setBlockId(fetchedBlockId)
        await fetchReadingList(session, fetchedBlockId, readingListSpace._id)
      }
    } catch (err) {
      setError("Failed to load reading list. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [spaces, session, fetchReadingList])

  useEffect(() => {
    if (spaces.length > 0 && !blockId) {
      loadReadingList()
    }
  }, [spaces, blockId, loadReadingList])

  if (loading) {
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
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        {blockId && (
          <div className="ml-[10%] mt-32 flex w-3/5 flex-col gap-8 text-base">
            <AddItemForm blockId={blockId} spaceId={readingListSpaceId} />
            <ItemsList blockId={blockId}  spaceId={readingListSpaceId}/>
          </div>
        )}
      </div>
    </section>
  )
}

export default ReadingListComponent
