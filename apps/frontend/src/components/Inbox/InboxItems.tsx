"use client"

import React, { useEffect, useCallback } from "react"

import { Icon } from "@iconify-icon/react"

import { ItemIcon } from "@/src/components/atoms/ItemIcon"
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
    <div className="flex h-full flex-col gap-2 overflow-y-auto pr-1">
      {inboxItems.length === 0 ? (
        <p>inbox empty</p>
      ) : (
        inboxItems.map((item: InboxItem) => (
          <div
            key={item._id}
            className={
              "group flex justify-between gap-1 rounded-lg border border-transparent bg-transparent p-4 text-left hover:border-border focus:border-border focus:outline-none"
            }
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
                  <ItemIcon type={item.source || "march"} />
                  <p className="mr-1">{item.title}</p>
                  <div className="flex items-center gap-2 text-xs text-secondary-foreground">
                    <button className="hover-text invisible group-hover:visible">
                      <Icon
                        icon="humbleicons:clock"
                        className="mt-0.5 text-[18px]"
                      />
                    </button>
                    <button className="hover-text invisible group-hover:visible">
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
            <div className="flex items-center text-xs text-secondary-foreground">
              <div className="flex gap-4">
                <button className="hover-text invisible group-hover:visible">
                  <Icon
                    icon="humbleicons:clock"
                    className="mt-0.5 text-[18px]"
                  />
                </button>
                <button className="hover-text invisible group-hover:visible">
                  <Icon
                    icon="mingcute:move-line"
                    className="mt-0.5 text-[18px]"
                  />
                </button>
                <button className="hover-text invisible group-hover:visible">
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
