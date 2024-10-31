"use client"

import React, { useEffect, useCallback, useState } from "react"

import { Calendar, Move, GithubIcon, MailsIcon } from "lucide-react"
import Image from "next/image"

import BoxIcon from "@/public/icons/box.svg"
import LinearIcon from "@/public/icons/linear.svg"
import { useAuth } from "@/src/contexts/AuthContext"
import { CycleItem } from "@/src/lib/@types/Items/Cycle"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"
import classNames from "@/src/utils/classNames"

export const InboxItems: React.FC = () => {
  const { session } = useAuth()

  const [isControlHeld, setIsControlHeld] = useState(false)
  const { inbox, currentItem, setCurrentItem, fetchInbox, updateItem } =
    useCycleItemStore()

  const { items, error } = inbox

  useEffect(() => {
    fetchInbox(session)
  }, [fetchInbox, session])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Control" && event.location === 1) {
        setIsControlHeld(true)
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Control" && event.location === 1) {
        setIsControlHeld(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  const handleExpand = useCallback(
    (item: CycleItem) => {
      if (isControlHeld && item.type === "link") {
        window.open(item.metadata?.url, "_blank")
      } else if (!currentItem || currentItem._id !== item._id) {
        setCurrentItem(item)
      }
    },
    [currentItem, setCurrentItem, isControlHeld]
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
        const today = new Date().toISOString()
        updateItem(session, { status: newStatus, dueDate: today }, id)
      }
    },
    [updateItem, session]
  )

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "gmail":
        return <MailsIcon size={14} />
      case "githubIssue":
        return <GithubIcon size={14} />
      case "githubPullRequest":
        return <GithubIcon size={14} />
      case "linear":
        return (
          <Image src={LinearIcon} alt="linear icon" width={14} height={14} />
        )
      case "march":
      case "marchClipper":
        return null
      default:
        return null
    }
  }

  const filteredItems = items.filter((item) => item.status !== "done")

  return (
    <div className="no-scrollbar flex h-full flex-col gap-2 overflow-y-auto">
      {filteredItems.length === 0 ? (
        <span className="pl-5">inbox empty</span>
      ) : (
        <div>
          {error && (
            <div className="mb-2.5 truncate pl-5 text-xs text-danger-foreground">
              <span>{error}</span>
            </div>
          )}
          <div className="flex flex-col gap-2.5">
            {filteredItems.map((item) => (
              <button
                key={item._id}
                className="hover-text group flex items-start gap-2 py-1 text-primary-foreground outline-none hover:text-foreground focus:text-foreground"
                onClick={() => handleExpand(item)}
                data-item-id={item._id}
              >
                <div className="flex items-start gap-2">
                  <Image
                    src={BoxIcon}
                    alt="checkbox icon"
                    width={12}
                    height={12}
                    onClick={(e) => handleDone(e, item._id, item.status)}
                    className="invisible mt-1 opacity-50 hover:opacity-100 group-hover:visible"
                  />
                  <span
                    className={classNames(
                      "text-left",
                      item.type === "link" && "group-hover:underline"
                    )}
                  >
                    {item.title}
                  </span>
                  {item.source !== "march" && (
                    <div className="mt-[3px] flex items-center text-secondary-foreground">
                      {getSourceIcon(item.source)}
                    </div>
                  )}
                </div>
                <div className="invisible mt-[3px] flex items-center gap-2 text-secondary-foreground group-hover:visible">
                  <Calendar
                    size={14}
                    className="hover-text"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Move
                    size={14}
                    className="hover-text"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
