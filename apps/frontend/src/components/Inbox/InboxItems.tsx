"use client"

import React, { useEffect, useCallback } from "react"

import { ItemIcon } from "../atoms/ItemIcon"
import { InboxItem } from "@/src/lib/@types/Items/Inbox"
import { Icon } from "@iconify-icon/react"

import { useAuth } from "@/src/contexts/AuthContext"
import useInboxStore from "@/src/lib/store/inbox.store"

export const InboxItems: React.FC = () => {
  const { session } = useAuth()

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
      fetchInboxData(session)
      setIsFetched(true)
    } catch (error) {
      setIsFetched(false)
    }
  }, [session, fetchInboxData, setIsFetched])

  useEffect(() => {
    if (!isFetched) {
      fetchInbox()
    }
  }, [session, fetchInboxData, setIsFetched])

  const handleExpand = (item: InboxItem) => {
    setSelectedItem(item)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <p>loading...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full gap-2 overflow-y-auto pr-1">
      {inboxItems.length === 0 ? (
        <p>inbox empty</p>
      ) : (
        inboxItems.map((item: InboxItem) => (
          <div
            key={item._id}
            className={
              "flex justify-between text-left gap-1 p-4 bg-transparent border-transparent border rounded-lg hover:border-border group"
            }
            onDoubleClick={() => handleExpand(item)}
          >
            <div className="flex flex-col w-full truncate">
              <div className="flex justify-between text-foreground">
                <div className="w-full flex items-start gap-2">
                  <ItemIcon type={item.source || "march"} />
                  <p>{item.title}</p>
                </div>
              </div>
              <div className="ml-[18px] pl-2 text-xs">
                <p className="truncate max-w-full">{item.description}</p>
              </div>
            </div>
            <div className="flex items-center text-secondary-foreground text-xs">
              <div className="flex gap-4">
                <button className="invisible group-hover:visible hover-text">
                  <Icon
                    icon="humbleicons:clock"
                    className="mt-0.5 text-[18px]"
                  />
                </button>
                <button className="invisible group-hover:visible hover-text">
                  <Icon
                    icon="mingcute:move-line"
                    className="mt-0.5 text-[18px]"
                  />
                </button>
                <button className="invisible group-hover:visible hover-text">
                  <Icon
                    icon="fluent:archive-24-regular"
                    className="mt-0.5 text-[18px]"
                  />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
