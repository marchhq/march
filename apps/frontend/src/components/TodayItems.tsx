"use client"
import React, { useState, useEffect } from "react"

import { SkeletonCard } from "./atoms/SkeletonCard"
import { DropdownItem, DropdownItemProps } from "./DropDownItems"
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
  const [optimisticTodayItems, setOptimisticTodayItems] = useState<CycleItem[]>(
    []
  )
  const [optimisticOverdueItems, setOptimisticOverdueItems] = useState<
    CycleItem[]
  >([])
  const { session } = useAuth()
  const { today, overdue, isLoading, fetchToday, fetchOverdue, updateItem } =
    useCycleItemStore()
  const { items: todayItems } = today
  const { items: overdueItems } = overdue

  useEffect(() => {
    const date = getTodayISODate(selectedDate)
    fetchToday(session, date)
    fetchOverdue(session, date)
  }, [session, selectedDate])

  useEffect(() => {
    setOptimisticTodayItems(todayItems)
  }, [todayItems])

  useEffect(() => {
    setOptimisticOverdueItems(overdueItems)
  }, [overdueItems])

  const handleToggleComplete = async (item: CycleItem) => {
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
      // Error handling is now managed by the store
    }
  }

  if (
    isLoading &&
    optimisticTodayItems.length === 0 &&
    optimisticOverdueItems.length === 0
  ) {
    return <SkeletonCard />
  }

  return (
    <div className="space-y-2">
      {optimisticTodayItems.length > 0 && (
        <ul className="space-y-2">
          {optimisticTodayItems.map((item) => (
            <React.Fragment key={item._id}>
              <DropdownItem
                item={item}
                onToggleComplete={(item) => handleToggleComplete(item)}
                isOverdue={false}
                maxTitleLength={50}
              />
            </React.Fragment>
          ))}
        </ul>
      )}
      {optimisticOverdueItems.length > 0 && (
        <ul className="space-y-2">
          {optimisticOverdueItems.map((item) => (
            <React.Fragment key={item._id}>
              <DropdownItem
                item={item}
                onToggleComplete={(item) => handleToggleComplete(item)}
                isOverdue={true}
                maxTitleLength={50}
              />
            </React.Fragment>
          ))}
        </ul>
      )}
    </div>
  )
}
