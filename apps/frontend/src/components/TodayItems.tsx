"use client"
import React, { useState, useEffect } from "react"

import { SkeletonCard } from "./atoms/SkeletonCard"
import { DropdownItem } from "./DropDownItems"
import { useAuth } from "../contexts/AuthContext"
import { CycleItem } from "../lib/@types/Items/Cycle"
import { useCycleItemStore } from "../lib/store/cycle.store"
import { getTodayISODate } from "../utils/datetime"

interface TodayEventsProps {
  selectedDate: Date
}

export const TodayItems: React.FC<TodayEventsProps> = ({
  selectedDate,
}): JSX.Element => {
  const [optimisticItems, setOptimisticItems] = useState<CycleItem[]>([])
  const { session } = useAuth()

  const { today, isLoading, fetchItems, updateItem } = useCycleItemStore()
  const { items } = today

  useEffect(() => {
    const date = getTodayISODate(selectedDate)
    fetchItems(session, date)
  }, [session, fetchItems, selectedDate])

  useEffect(() => {
    setOptimisticItems(items) // Always update optimisticItems with items
  }, [items])

  const handleToggleComplete = async (item: CycleItem) => {
    const updatedItems = optimisticItems.map((i) =>
      i._id === item._id
        ? { ...i, status: i.status === "done" ? "todo" : "done" }
        : i
    )
    setOptimisticItems(updatedItems)

    const newStatus = item.status === "done" ? "todo" : "done"

    try {
      await updateItem(
        session,
        {
          status: newStatus,
        },
        item._id
      )
    } catch (error) {
      console.error("Error updating item:", error)
      setOptimisticItems(items)
    }
  }

  if (isLoading && optimisticItems.length === 0) {
    return <SkeletonCard />
  }

  return (
    <ul className="space-y-2">
      {optimisticItems.map((item) => (
        <React.Fragment key={item._id}>
          <DropdownItem item={item} onToggleComplete={handleToggleComplete} />
        </React.Fragment>
      ))}
    </ul>
  )
}
