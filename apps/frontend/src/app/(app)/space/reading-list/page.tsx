"use client"

import React, { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/src/contexts/AuthContext"
import { useSpace } from "@/src/hooks/useSpace"
import useReadingStore from "@/src/lib/store/reading.store"
import AddItemForm from "@/src/components/Reading/AddItemForm"
import ReadingList from "@/src/components/Reading/ReadingList"

const ReadingListPage: React.FC = () => {
  const { session } = useAuth()
  const { spaces } = useSpace() || { spaces: [] }
  const { fetchReadingList } = useReadingStore()

  const [loading, setLoading] = useState(true)
  const [blockId, setBlockId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadReadingList = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const readingListSpace = spaces.find(
        (space) => space.name.toLowerCase() === "reading list"
      )
      if (readingListSpace) {
        const fetchedBlockId = readingListSpace.blocks[0]
        setBlockId(fetchedBlockId)
        await fetchReadingList(session, fetchedBlockId)
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
      <div className="text-secondary-foreground p-16">
        Loading reading list...
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 p-16">{error}</div>
  }

  return (
    <section className="h-full overflow-y-auto bg-background text-secondary-foreground">
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        {blockId && (
          <div className="flex flex-col gap-8 text-base w-3/5 ml-[10%] mt-32">
            <AddItemForm blockId={blockId} />
            <ReadingList blockId={blockId} />
          </div>
        )}
      </div>
    </section>
  )
}

export default ReadingListPage
