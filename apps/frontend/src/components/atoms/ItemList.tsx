import React from "react"

import { CalendarIcon, GithubIcon, MailsIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import BoxIcon from "@/public/icons/box.svg"
import BoxFilledIcon from "@/public/icons/boxfilled.svg"
import LinearIcon from "@/public/icons/linear.svg"
import { CycleItem } from "@/src/lib/@types/Items/Cycle"
import { Event } from "@/src/lib/@types/Items/event"
import { GoogleCalendar } from "@/src/lib/icons/Calendar"
import classNames from "@/src/utils/classNames"

interface ItemListProps {
  items: (CycleItem | Event)[]
  handleExpand: (item: CycleItem) => void
  handleMeetingExpand?: (item: Event) => void
  handleDone?: (event: React.MouseEvent, id: string, status: string) => void
  handleRescheduleCalendar?: (
    event: React.MouseEvent,
    id: string,
    dueDate: Date | null,
    currentStatus?: string
  ) => void
  isOverdue?: boolean
  doneLine?: boolean
}

const getSourceIcon = (
  source: string,
  sourceUrl: string,
  item: Event | CycleItem
) => {
  if ("kind" in item && item.kind === "calendar#event") {
    // If it has conference data, handle it as before
    if (item.conferenceData?.conferenceSolution) {
      const { iconUri, name } = item.conferenceData.conferenceSolution
      return (
        <Link
          href={item.conferenceData.entryPoints?.[0]?.uri || item.htmlLink}
          target="_blank"
        >
          {iconUri ? (
            <Image
              src={iconUri}
              alt={`${name} icon`}
              width={14}
              height={14}
              className="opacity-50 hover:opacity-100"
              onError={(e) => {
                e.currentTarget.src = "/calendar-icon.png"
              }}
            />
          ) : (
            <span className="opacity-50 hover:opacity-100">
              <GoogleCalendar />
            </span>
          )}
        </Link>
      )
    }
    return (
      <Link
        href={item.htmlLink}
        target="_blank"
        className="opacity-50 hover:opacity-100"
      >
        <GoogleCalendar />
      </Link>
    )
  }

  switch (source) {
    case "gmail":
      return (
        <Link href={sourceUrl} target="_blank">
          <MailsIcon size={14} className="opacity-50 hover:opacity-100" />
        </Link>
      )
    case "githubIssue":
    case "githubPullRequest":
      return (
        <Link href={sourceUrl} target="_blank">
          <GithubIcon size={14} className="opacity-50 hover:opacity-100" />
        </Link>
      )
    case "linear":
      return (
        <Link href={sourceUrl} target="_blank">
          <Image
            src={LinearIcon}
            alt="linear icon"
            width={14}
            height={14}
            className="opacity-50 hover:opacity-100"
            onError={(e) => {
              e.currentTarget.src = "/fallback-icon.png"
            }}
          />
        </Link>
      )
    case "march":
    case "marchClipper":
      return null
    default:
      return null
  }
}

export const ItemList: React.FC<ItemListProps> = ({
  items,
  handleExpand,
  handleMeetingExpand,
  handleDone,
  handleRescheduleCalendar,
  isOverdue = false,
  doneLine = false,
}) => {
  const handleClick = (item: CycleItem | Event) => {
    if ("summary" in item) {
      // Type guard for Event
      if (handleMeetingExpand) {
        handleMeetingExpand(item)
      } else {
        console.error("handleMeetingExpand is undefined.")
      }
    } else {
      if (handleExpand) {
        handleExpand(item as CycleItem)
      } else {
        console.error("handleExpand is undefined.")
      }
    }
  }

  return (
    <>
      {items.map((item) => {
        const isEvent = "summary" in item
        const itemId = isEvent ? item.id : item._id
        const title = isEvent ? item.summary : item.title

        return (
          <button
            key={itemId}
            className={classNames(
              "group flex items-start gap-2 py-1 outline-none",
              !doneLine &&
                "hover-text text-primary-foreground hover:text-foreground focus:text-foreground",
              !isEvent && item.status === "done"
                ? "line-through text-secondary-foreground focus:text-secondary-foreground"
                : "text-primary-foreground hover-text-foreground hover:text-foreground focus:text-foreground"
            )}
            onClick={() => handleClick(item)}
            data-item-id={itemId}
          >
            <div className="flex items-start gap-2.5 truncate">
              {!isEvent && (
                <div>
                  {(item as CycleItem).status === "done" ? (
                    <Image
                      src={BoxFilledIcon}
                      alt="checkbox filled icon"
                      width={12}
                      height={12}
                      onClick={(e) =>
                        handleDone?.(
                          e,
                          (item as CycleItem)._id,
                          (item as CycleItem).status
                        )
                      }
                      className="invisible mt-1 opacity-50 hover:opacity-100 group-hover:visible"
                    />
                  ) : (
                    <Image
                      src={BoxIcon}
                      alt="checkbox icon"
                      width={12}
                      height={12}
                      onClick={(e) =>
                        handleDone?.(
                          e,
                          (item as CycleItem)._id,
                          (item as CycleItem).status
                        )
                      }
                      className="invisible mt-1 opacity-50 hover:opacity-100 group-hover:visible"
                    />
                  )}
                </div>
              )}
              <span
                className={classNames(
                  `truncate text-left ${
                    !isEvent && item.type === "link"
                      ? "group-hover:underline"
                      : ""
                  }`,
                  isEvent && "pl-5",
                  isOverdue && "flex gap-1"
                )}
              >
                {title}
                {isOverdue && !isEvent && (
                  <span className="mt-1 inline-block size-1 shrink-0 rounded-full bg-[#E34136]/80" />
                )}
              </span>
              {!isEvent && item.source !== "march" && (
                <div className="mt-[4.5px] flex items-center text-secondary-foreground">
                  {getSourceIcon(item.source, item.metadata?.url || "", item)}
                </div>
              )}
              {isEvent && (
                <div className="mt-[4.5px] flex items-center text-secondary-foreground">
                  {getSourceIcon("", "", item)}
                </div>
              )}
            </div>
            {!isEvent && (
              <div className="invisible mt-[3px] flex items-center gap-2 text-secondary-foreground group-hover:visible">
                <CalendarIcon
                  size={14}
                  className="hover-text"
                  onClick={(e) =>
                    handleRescheduleCalendar?.(
                      e,
                      item._id,
                      item.dueDate,
                      item.status
                    )
                  }
                />
              </div>
            )}
          </button>
        )
      })}
    </>
  )
}
