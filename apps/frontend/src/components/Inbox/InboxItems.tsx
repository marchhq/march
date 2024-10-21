"use client"

import React, { useEffect, useCallback, useState } from "react"

import { Icon } from "@iconify-icon/react"

import { RescheduleCalendar } from "./RescheduleCalendar/RescheduleCalendar"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "../ui/context-menu"
import { useAuth } from "@/src/contexts/AuthContext"
import { CycleItem } from "@/src/lib/@types/Items/Cycle"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"
import useSpaceStore from "@/src/lib/store/space.store"
import classNames from "@/src/utils/classNames"

export const InboxItems: React.FC = () => {
  const { session } = useAuth()
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set())
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [scheduleItemId, setScheduleItemId] = React.useState<string>("")
  const [optimisticDoneItems, setOptimisticDoneItems] = useState<Set<string>>(
    new Set()
  )

  const {
    items,
    currentItem,
    setCurrentItem,
    fetchItems,
    updateItem,
    isLoading,
    deleteItem,
  } = useCycleItemStore()

  const { spaces, fetchSpaces } = useSpaceStore()

  const fetchInbox = useCallback(async () => {
    console.log("Fetching inbox...")
    try {
      await fetchItems(session)
    } catch (error) {
      console.error("Error fetching inbox:", error)
    }
  }, [session, fetchItems])

  useEffect(() => {
    fetchInbox()
  }, [fetchInbox])

  useEffect(() => {
    if (spaces.length == 0) {
      fetchSpaces(session)
    }
  }, [session, fetchSpaces, spaces])

  useEffect(() => {
    console.log("Current Items:", items)
  }, [items])

  useEffect(() => {
    console.log("date", date)
    if (date && scheduleItemId) {
      updateItem(session, { dueDate: date }, scheduleItemId)
    }
  }, [date, updateItem, session])

  const handleExpand = useCallback(
    (item: CycleItem) => {
      if (!currentItem || currentItem._id !== item._id) {
        setCurrentItem(item)
      }
    },
    [currentItem, setCurrentItem]
  )

  const handleDelete = (id: string) => {
    if (id) {
      deleteItem(session, { isDeleted: true }, id)
    }
  }

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

        setTimeout(() => {
          updateItem(session, { status: newStatus }, id)
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

  const handleMoveToSpace = (item: CycleItem, spaceId: string) => {
    if (item) {
      const existingSpaces = item.spaces || []
      updateItem(session, { spaces: [...existingSpaces, spaceId] }, item._id)
    }
  }

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
      icon: "ci:expand",
      onClick: () => handleExpand(item),
    },
    {
      name: "Done",
      icon: "material-symbols:done",
      onClick: (event: React.MouseEvent) =>
        handleDone(event, item._id!, item.status),
    },
  ]

  const filteredItems = items.filter((item) => item.status !== "done")
  console.log("Filtered items:", filteredItems)

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden overflow-y-auto pr-1">
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
            <ContextMenuContent className="rounded-md border border-border ">
              {menuItems(item).map((menuItem) => (
                <div key={menuItem.name}>
                  <ContextMenuItem>
                    <button
                      className="my-1 flex w-full items-center gap-3"
                      onClick={menuItem.onClick}
                    >
                      <Icon
                        icon={menuItem.icon}
                        className="text-[18px] text-secondary-foreground"
                      />
                      <span className="flex-1 text-left text-[15px]">
                        {menuItem.name}
                      </span>
                    </button>
                  </ContextMenuItem>
                  {menuItem.name === "Expand" && <ContextMenuSeparator />}
                </div>
              ))}
              <ContextMenuSub>
                <ContextMenuSubTrigger
                  onMouseEnter={() => {
                    setScheduleItemId(item._id)
                    console.log("hover", item._id)
                  }}
                >
                  <div className="my-1 flex w-full items-center gap-3 text-primary-foreground">
                    <Icon
                      icon="humbleicons:clock"
                      className="text-[18px] text-secondary-foreground"
                    />
                    <span className="text-[15px]">Plan</span>
                  </div>
                </ContextMenuSubTrigger>
                <ContextMenuSubContent className="mx-3">
                  <RescheduleCalendar date={date} setDate={setDate} />
                </ContextMenuSubContent>
              </ContextMenuSub>
              <ContextMenuSub>
                <ContextMenuSubTrigger>
                  <div className="my-1 flex w-full items-center gap-3 text-primary-foreground">
                    <Icon
                      icon="hugeicons:move"
                      className="text-[18px] text-secondary-foreground"
                    />
                    <span className="text-[15px]">Move</span>
                  </div>
                </ContextMenuSubTrigger>
                <ContextMenuSubContent className="ml-3 flex flex-col gap-2">
                  <ContextMenuItem className="pointer-events-none text-xs text-secondary-foreground">
                    <p>move to</p>
                  </ContextMenuItem>
                  <div className="flex flex-col gap-1">
                    {spaces.map((space) => (
                      <ContextMenuItem
                        key={space._id}
                        className={classNames(
                          "hover-bg cursor-pointer border border-transparent",
                          item.spaces.includes(space._id) &&
                            "bg-background-hover border-border"
                        )}
                        onClick={() => handleMoveToSpace(item, space._id)}
                      >
                        <span className="my-1 flex w-full text-xs">
                          {space.name}
                        </span>
                      </ContextMenuItem>
                    ))}
                  </div>
                </ContextMenuSubContent>
              </ContextMenuSub>
              <ContextMenuItem>
                <button
                  className="my-1 flex w-full items-center gap-3 text-primary-foreground"
                  onClick={() => handleDelete(item._id!)}
                >
                  <Icon
                    icon="typcn:delete-outline"
                    className="text-[18px] text-secondary-foreground"
                  />
                  <span className="text-[15px]">Delete</span>
                </button>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))
      )}
    </div>
  )
}
