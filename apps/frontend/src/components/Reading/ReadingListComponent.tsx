"use client"

import React, { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/src/contexts/AuthContext"
import { useSpace } from "@/src/hooks/useSpace"
import useReadingStore from "@/src/lib/store/reading.store"
import AddItemForm from "@/src/components/Reading/AddItemForm"
import ItemsList from "@/src/components/Reading/ItemsList"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const ReadingListComponent: React.FC = () => {
  const { session } = useAuth()
  const { spaces } = useSpace() || { spaces: [] }
  const { fetchReadingList, fetchLabels, labels } = useReadingStore()

  const [loading, setLoading] = useState(true)
  const [blockId, setBlockId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null)

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
        await fetchLabels(session, readingListSpace._id)
        await fetchReadingList(session, fetchedBlockId)
      }
    } catch (err) {
      setError("Failed to load reading list. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [spaces, session, fetchReadingList, fetchLabels])

  useEffect(() => {
    if (spaces.length > 0 && !blockId) {
      loadReadingList()
    }
  }, [spaces, blockId, loadReadingList])

  const handleLabelChange = (value: string) => {
    setSelectedLabel(value)
    // You can add filtering logic here based on the selected label
  }

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
            <div className="flex justify-between items-center mb-4">
              <Select onValueChange={handleLabelChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a label" />
                </SelectTrigger>
                <SelectContent>
                  {labels.map((label) => (
                    <SelectItem key={label._id} value={label._id}>
                      {label.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <AddItemForm blockId={blockId} />
            <ItemsList blockId={blockId} />
          </div>
        )}
      </div>
    </section>
  )
}

export default ReadingListComponent
