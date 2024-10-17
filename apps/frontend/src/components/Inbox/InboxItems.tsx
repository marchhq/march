"use client"

import React, { useEffect, useCallback, useState } from "react"

import { Icon } from "@iconify-icon/react"

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
import { InboxItem } from "@/src/lib/@types/Items/Inbox"
import useInboxStore from "@/src/lib/store/inbox.store"

export const InboxItems: React.FC = () => {
  const { session } = useAuth()
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set())
  const [optimisticDoneItems, setOptimisticDoneItems] = useState<Set<string>>(
    new Set()
  )
  const {
    isFetched,
    setIsFetched,
    fetchInboxData,
    inboxItems,
    isLoading,
    deleteItem,
    updateItem,
    selectedItem,
    setSelectedItem,
  } = useInboxStore()

  const fetchInbox = useCallback(async () => {
    try {
      await fetchInboxData(session)
      setIsFetched(true)
    } catch (error) {
      setIsFetched(false)
    }
  }, [session, fetchInboxData, setIsFetched])

  useEffect(() => {
    if (!isFetched) {
      fetchInbox()
    }
  }, [session, fetchInbox, isFetched])

  const handleExpand = useCallback(
    (item: InboxItem) => {
      setSelectedItem(item)
    },
    [setSelectedItem]
  )

  const handleDelete = useCallback(
    (id: string) => {
      if (id) {
        deleteItem(session, id)
      }
    },
    [deleteItem, session]
  )

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
        setSelectedItem(null)
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
    [session, updateItem, setSelectedItem]
  )

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <p>loading...</p>
      </div>
    )
  }

  const menuItems = (item: InboxItem) => [
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
    { name: "Plan", icon: "humbleicons:clock", onClick: () => {} },
  ]

  const subMenuItems = [
    {
      name: "Notes",
    },
    {
      name: "Meetings",
    },
    {
      name: "Reading List",
    },
  ]

  const filteredItems = inboxItems.filter((item) => item.status !== "done")

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
                  selectedItem && selectedItem._id === item._id
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
                <>
                  <ContextMenuItem key={menuItem.name}>
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
                </>
              ))}
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
                <ContextMenuSubContent className="ml-2">
                  <ContextMenuItem className="pointer-events-none text-xs text-secondary-foreground">
                    <p>move to</p>
                  </ContextMenuItem>
                  {subMenuItems.map((subItem) => (
                    <ContextMenuItem
                      key={subItem.name}
                      className="hover-bg cursor-pointer"
                    >
                      <span className="my-1 flex w-full text-xs">
                        {subItem.name}
                      </span>
                    </ContextMenuItem>
                  ))}
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
