"use client"

import React, { useEffect, useCallback } from "react"

import { Icon } from "@iconify-icon/react"
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@radix-ui/react-context-menu"

import { useAuth } from "@/src/contexts/AuthContext"
import { InboxItem } from "@/src/lib/@types/Items/Inbox"
import useInboxStore from "@/src/lib/store/inbox.store"

export const InboxItems: React.FC = () => {
  const { session } = useAuth()

  const {
    isFetched,
    setIsFetched,
    fetchInboxData,
    inboxItems,
    isLoading,
    deleteItem,
    updateItem,
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
  }, [isFetched, fetchInbox])

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
        updateItem(session, { status: newStatus }, id)
      }
    },
    [session, updateItem]
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
      onClick: () => handleDelete(item._id!),
    },
  ]

  const filteredItems = inboxItems.filter((item) => item.status !== "done")

  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto pr-1">
      {filteredItems.length === 0 ? (
        <p>inbox empty</p>
      ) : (
        filteredItems.map((item) => (
          <ContextMenu key={item._id}>
            <ContextMenuTrigger asChild>
              <div
                className="group relative flex justify-between gap-1 rounded-lg border border-transparent bg-transparent p-4 text-left hover:border-border focus:border-border focus:outline-none"
                onClick={() => handleExpand(item)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleExpand(item)
                  }
                }}
                tabIndex={0}
                role="button"
              >
                <div className="flex w-full flex-col truncate">
                  <div className="flex justify-between text-foreground">
                    <div className="flex w-full items-start gap-2">
                      <button
                        onClick={(e) => handleDone(e, item._id!, item.status)}
                        aria-label={
                          item.status === "done"
                            ? "Mark as not done"
                            : "Mark as done"
                        }
                      >
                        <Icon
                          icon={
                            item.status === "done"
                              ? "weui:done2-filled"
                              : "material-symbols:circle-outline"
                          }
                          className="mt-0.5 text-[18px]"
                        />
                      </button>
                      <p className="mr-1">{item.title}</p>
                      <div className="flex items-center gap-2 text-xs text-secondary-foreground">
                        <button className="invisible group-hover:visible">
                          <Icon
                            icon="humbleicons:clock"
                            className="mt-0.5 text-[18px]"
                          />
                        </button>
                        <button className="invisible group-hover:visible">
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
