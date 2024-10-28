"use client"

import React, { useEffect, useCallback, useState } from "react"

import { Icon } from "@iconify-icon/react"
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@radix-ui/react-context-menu"

import { useAuth } from "@/src/contexts/AuthContext"
import { CycleItem } from "@/src/lib/@types/Items/Cycle"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"

export const InboxItems: React.FC = () => {
  const { session } = useAuth()
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set())
  const [optimisticDoneItems, setOptimisticDoneItems] = useState<Set<string>>(
    new Set()
  )

  const {
    inbox,
    currentItem,
    setCurrentItem,
    fetchInbox,
    updateItem,
    isLoading,
  } = useCycleItemStore()

  const { items } = inbox

  const fetchInboxItems = useCallback(async () => {
    try {
      await fetchInbox(session)
    } catch (error) {
      console.error("Error fetching inbox:", error)
    }
  }, [session, fetchInbox])

  useEffect(() => {
    fetchInboxItems()
  }, [fetchInboxItems])

  useEffect(() => {}, [items])

  const handleExpand = useCallback(
    (item: CycleItem) => {
      // Only update the current item if it's not already the selected item
      if (!currentItem || currentItem._id !== item._id) {
        setCurrentItem(item)
      }
    },
    [currentItem, setCurrentItem]
  )

  /* const handleDelete = useCallback(
    (id: string) => {
      if (id) {
        deleteItem(session, id)
      }
    },
    [deleteItem, session]
  ) */

  const handleDone = useCallback(
    (
      event: React.MouseEvent,
      id: string,
      currentStatus: string | undefined
    ) => {
      event.stopPropagation()
      if (id) {
        const newStatus = currentStatus === "done" ? "null" : "done"
        setAnimatingItems((prev) => new Set(prev).add(id))
        setOptimisticDoneItems((prev) => {
          const newSet = new Set(prev)
          if (newStatus === "done") {
            newSet.add(id)
          } else {
            newSet.delete(id)
          }
          return newSet
        })

        const today = new Date().toISOString()

        setTimeout(() => {
          updateItem(session, { status: newStatus, dueDate: today }, id)
          setAnimatingItems((prev) => {
            const newSet = new Set(prev)
            newSet.delete(id)
            return newSet
          })
        }, 400)
      }
    },
    [updateItem, session]
  )

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <p>loading...</p>
      </div>
    )
  }

  const menuItems = (item: CycleItem) => [
    {
      name: "Expand",
      icon: "ri:expand-diagonal-s-line",
      onClick: () => handleExpand(item),
    },
    {
      name: "Mark as done",
      icon: "weui:done-outlined",
      onClick: (event: React.MouseEvent) =>
        handleDone(event, item._id!, item.status),
    },
    { name: "Plan", icon: "humbleicons:clock", onClick: () => {} },
    { name: "Move", icon: "mingcute:move-line", onClick: () => {} },
    {
      name: "Delete",
      icon: "weui:delete-outlined",
      color: "#C45205",
      //     onClick: () => handleDelete(item._id!),
    },
  ]

  const filteredItems = items.filter((item) => item.status !== "done")

  return (
    <div className="no-scrollbar flex h-full flex-col gap-2 overflow-hidden overflow-y-auto pr-1">
      {filteredItems.length === 0 ? (
        <p>inbox empty</p>
      ) : (
        filteredItems.map((item) => (
          <ContextMenu key={item._id}>
            <ContextMenuTrigger asChild>
              <div
                className={`group relative flex justify-between gap-1 rounded-lg border p-4 text-left transition-all duration-300 hover:border-border focus:outline-none focus:ring-0 ${
                  animatingItems.has(item._id!)
                    ? "transform-none opacity-100 sm:translate-x-full sm:opacity-0 sm:blur-lg"
                    : ""
                } ${
                  currentItem && currentItem._id === item._id
                    ? "border-border"
                    : "border-transparent"
                }`}
                onClick={() => handleExpand(item)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleExpand(item)
                  }
                }}
                tabIndex={0}
                role="button"
                style={{
                  WebkitTapHighlightColor: "transparent",
                  outline: "none",
                }}
                data-item-id={item._id}
              >
                <div className="flex w-full flex-col truncate">
                  <div className="flex justify-between text-foreground">
                    <div className="flex w-full items-start gap-2">
                      <button
                        onClick={(e) => handleDone(e, item._id!, item.status)}
                        aria-label={
                          optimisticDoneItems.has(item._id!)
                            ? "Mark as not done"
                            : "Mark as done"
                        }
                        className="focus:outline-none focus:ring-0"
                      >
                        <Icon
                          icon={
                            optimisticDoneItems.has(item._id!)
                              ? "weui:done2-filled"
                              : "material-symbols:circle-outline"
                          }
                          className="mt-0.5 text-[18px]"
                        />
                      </button>
                      <p className="mr-1">{item.title}</p>
                      <div className="flex items-center gap-2 text-xs text-secondary-foreground">
                        <button className="invisible focus:outline-none focus:ring-0 group-hover:visible">
                          <Icon
                            icon="humbleicons:clock"
                            className="mt-0.5 text-[18px]"
                          />
                        </button>
                        <button className="invisible focus:outline-none focus:ring-0 group-hover:visible">
                          <Icon
                            icon="mingcute:move-line"
                            className="mt-0.5 text-[18px]"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="ml-[18px] pl-2 text-xs">
                    <p className="max-w-full truncate">{item.description}</p>
                  </div>
                </div>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="rounded-md border border-border">
              {menuItems(item).map((menuItem) => (
                <ContextMenuItem
                  key={menuItem.name}
                  className="hover-bg rounded-md px-2 py-0.5"
                >
                  <button
                    className="my-1 flex w-full items-center gap-3 text-primary-foreground"
                    style={{ color: menuItem.color }}
                    onClick={menuItem.onClick}
                  >
                    <Icon icon={menuItem.icon} className="text-[18px]" />
                    <span className="flex-1 text-left text-[15px]">
                      {menuItem.name}
                    </span>
                  </button>
                </ContextMenuItem>
              ))}
            </ContextMenuContent>
          </ContextMenu>
        ))
      )}
    </div>
  )
}
