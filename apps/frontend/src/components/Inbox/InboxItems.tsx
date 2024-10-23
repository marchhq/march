"use client"

import React, { useEffect, useCallback, useState, useRef } from "react"

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
  const [date, setDate] = React.useState<Date | null>(new Date())
  const [scheduleItemId, setScheduleItemId] = useState<string | null>(null)
  const [optimisticDoneItems, setOptimisticDoneItems] = useState<Set<string>>(
    new Set()
  )

  const {
    items,
    currentItem,
    setCurrentItem,
    fetchItems,
    fetchBlocksBySpaceId,
    updateItem,
    isLoading,
    deleteItem,
  } = useCycleItemStore()

  const { spaces, fetchSpaces } = useSpaceStore()

  const fetchInbox = useCallback(async () => {
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
    if (scheduleItemId) {
      updateItem(session, { dueDate: date }, scheduleItemId)
      setScheduleItemId(null)
    }
  }, [date, updateItem, session, scheduleItemId])

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

  const handleMoveToSpace = async (item: CycleItem, spaceId: string) => {
    if (item) {
      const existingSpaces = item.spaces || []
      const existingBlocks = item.blocks || []

      const blocks = await fetchBlocksBySpaceId(session, spaceId)

      if (existingSpaces.includes(spaceId)) {
        const spaceIndex = existingSpaces.findIndex((id) => id === spaceId)
        if (spaceIndex !== -1) {
          existingSpaces.splice(spaceIndex, 1)
        }
        const blockIndex = existingBlocks.findIndex((id) => id === blocks[0])
        if (blockIndex !== -1) {
          existingBlocks.splice(blockIndex, 1)
        }
        updateItem(
          session,
          {
            spaces: [...existingSpaces],
            blocks: [...existingBlocks],
          },
          item._id
        )
      } else {
        updateItem(
          session,
          {
            spaces: [...existingSpaces, spaceId],
            blocks: [...existingBlocks, blocks[0]],
          },
          item._id
        )
      }
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
                        <div className="group/reschedule invisible focus:outline-none focus:ring-0 group-hover:visible">
                          <Icon
                            icon="humbleicons:clock"
                            className="mt-0.5 text-[18px] group-hover/reschedule:text-foreground"
                          />
                          <div className="invisible absolute z-50 flex min-w-32 flex-col gap-2 overflow-hidden rounded-lg border border-border bg-background p-2 text-neutral-950 shadow-md group-hover/reschedule:visible data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
                            <RescheduleCalendar
                              date={date}
                              setDate={setDate}
                              scheduleItemId={item._id}
                              setScheduleItemId={setScheduleItemId}
                            />
                          </div>
                        </div>
                        <div className="group/move invisible focus:outline-none focus:ring-0 group-hover:visible">
                          <Icon
                            icon="hugeicons:move"
                            className="mt-0.5 text-[18px] group-hover/move:text-foreground"
                          />
                          <div className="invisible absolute z-50 flex min-w-32 flex-col gap-2 overflow-hidden rounded-lg border border-border bg-background p-2 text-neutral-950 shadow-md group-hover/move:visible data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
                            {spaces.map((space) => (
                              <button
                                key={space._id}
                                className={classNames(
                                  "py-0.5 hover-bg cursor-pointer border hover-bg relative flex select-none items-start rounded-lg px-2 text-sm text-primary-foreground outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                  item.spaces.includes(space._id)
                                    ? "bg-background-hover border-border"
                                    : "border-transparent"
                                )}
                                onClick={() =>
                                  handleMoveToSpace(item, space._id)
                                }
                              >
                                <span className="my-1 flex w-full text-xs">
                                  {space.name}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-[18px] pl-2 text-xs">
                    <p className="max-w-full truncate">{item.description}</p>
                  </div>
                </div>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="border border-border ">
              {menuItems(item).map((menuItem) => (
                <div key={menuItem.name}>
                  <ContextMenuItem>
                    <button
                      className="my-1 flex w-full gap-4"
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
                  }}
                >
                  <div className="my-1 flex w-full items-center gap-4 text-primary-foreground">
                    <Icon
                      icon="humbleicons:clock"
                      className="text-[18px] text-secondary-foreground"
                    />
                    <span className="text-[15px]">Plan</span>
                  </div>
                </ContextMenuSubTrigger>
                <ContextMenuSubContent className="mx-5">
                  <RescheduleCalendar
                    date={date}
                    setDate={setDate}
                    scheduleItemId={item._id}
                    setScheduleItemId={setScheduleItemId}
                  />
                </ContextMenuSubContent>
              </ContextMenuSub>
              <ContextMenuSub>
                <ContextMenuSubTrigger>
                  <div className="my-1 flex w-full items-center gap-4 text-primary-foreground">
                    <Icon
                      icon="hugeicons:move"
                      className="text-[18px] text-secondary-foreground"
                    />
                    <span className="text-[15px]">Move</span>
                  </div>
                </ContextMenuSubTrigger>
                <ContextMenuSubContent className="mx-5 flex flex-col gap-2">
                  <ContextMenuItem className="pointer-events-none py-0.5 text-xs text-secondary-foreground">
                    <p>move to</p>
                  </ContextMenuItem>
                  <div className="flex flex-col gap-1">
                    {spaces.map((space) => (
                      <ContextMenuItem
                        key={space._id}
                        className={classNames(
                          "py-0.5 hover-bg cursor-pointer border border-transparent",
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
                  className="my-1 flex w-full items-center gap-4 text-primary-foreground"
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
