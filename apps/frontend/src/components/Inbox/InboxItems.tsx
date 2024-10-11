"use client"

import React, { useEffect, useCallback, useState } from "react"

import { Icon } from "@iconify-icon/react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown"
import { ItemIcon } from "@/src/components/atoms/ItemIcon"
import { useAuth } from "@/src/contexts/AuthContext"
import { InboxItem } from "@/src/lib/@types/Items/Inbox"
import useInboxStore from "@/src/lib/store/inbox.store"

export const InboxItems: React.FC = () => {
  const { session } = useAuth()
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  const {
    isFetched,
    setIsFetched,
    fetchInboxData,
    inboxItems,
    isLoading,
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

  const handleRightClick = useCallback(
    (e: React.MouseEvent, item: InboxItem) => {
      e.preventDefault()
      setOpenDropdownId(item._id)
    },
    []
  )

  const handleDropdownClose = useCallback(() => {
    setOpenDropdownId(null)
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <p>loading...</p>
      </div>
    )
  }

  const menuItems = [
    { name: "Expand", icon: "ri:expand-diagonal-s-line" },
    { name: "Mark as done", icon: "weui:done-outlined" },
    { name: "Plan", icon: "humbleicons:clock" },
    { name: "Move", icon: "hugeicons:arrow-move-down-right" },
    { name: "Delete", icon: "weui:delete-outlined" },
  ]

  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto pr-1">
      {inboxItems.length === 0 ? (
        <p>inbox empty</p>
      ) : (
        inboxItems.map((item) => (
          <div
            key={item._id}
            className="group relative flex justify-between gap-1 rounded-lg border border-transparent bg-transparent p-4 text-left hover:border-border focus:border-border focus:outline-none"
            onClick={() => handleExpand(item)}
            onContextMenu={(e) => handleRightClick(e, item)}
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
                  <Icon
                    icon="material-symbols:circle-outline"
                    className="mt-0.5 text-[18px]"
                  />
                  <p className="mr-1">{item.title}</p>
                  {/* <ItemIcon type={item.source || "march"} />*/}
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
                  <DropdownMenu
                    open={openDropdownId === item._id}
                    onOpenChange={handleDropdownClose}
                  >
                    <DropdownMenuTrigger asChild>
                      <div className="absolute inset-0" />
                    </DropdownMenuTrigger>
                    {openDropdownId === item._id && (
                      <DropdownMenuContent
                        className="border-[#26262699] bg-background p-2 text-foreground"
                        align="start"
                        alignOffset={200}
                        sideOffset={-20}
                      >
                        {menuItems.map((menuItem) => (
                          <DropdownMenuItem
                            key={menuItem.name}
                            className="hover-bg"
                          >
                            <button className="hover-text hover-bg flex w-full items-center justify-start gap-3.5 text-primary-foreground group-hover:visible">
                              <Icon
                                icon={menuItem.icon}
                                className="text-[15px]"
                              />
                              <span>{menuItem.name}</span>
                            </button>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    )}
                  </DropdownMenu>
                </div>
              </div>
              <div className="ml-[18px] pl-2 text-xs">
                <p className="max-w-full truncate">{item.description}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
