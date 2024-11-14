import React from "react"

import { CalendarIcon, GithubIcon, MailsIcon } from "lucide-react"
import Image from "next/image"

import BoxIcon from "@/public/icons/box.svg"
import BoxDashed from "@/public/icons/boxdashed.svg"
import BoxFilledIcon from "@/public/icons/boxfilled.svg"
import LinearIcon from "@/public/icons/linear.svg"
import { CycleItem } from "@/src/lib/@types/Items/Cycle"
import classNames from "@/src/utils/classNames"

interface ItemListProps {
  items: CycleItem[]
  handleExpand: (item: CycleItem) => void
  handleDone: (event: React.MouseEvent, id: string, status: string) => void
  handleRescheduleCalendar: (
    event: React.MouseEvent,
    id: string,
    dueDate: Date | null,
    currentStatus?: string
  ) => void
  handleInProgress?: (
    event: React.MouseEvent,
    id: string,
    status: string
  ) => void
  isOverdue?: boolean
  doneLine?: boolean
  inProgressAction?: boolean
}

const getSourceIcon = (source: string) => {
  switch (source) {
    case "gmail":
      return <MailsIcon size={14} />
    case "githubIssue":
    case "githubPullRequest":
      return <GithubIcon size={14} />
    case "linear":
      return (
        <Image
          src={LinearIcon}
          alt="linear icon"
          width={14}
          height={14}
          className="opacity-50"
        />
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
  handleInProgress,
  handleDone,
  handleRescheduleCalendar,
  isOverdue = false,
  doneLine = false,
  inProgressAction = false,
}) => {
  return (
    <>
      {items.map((item) => (
        <button
          key={item._id}
          className={classNames(
            "group flex items-start gap-2 py-1 outline-none",
            !doneLine &&
              "hover-text text-primary-foreground hover:text-foreground focus:text-foreground",
            item.status === "done"
              ? "line-through text-secondary-foreground focus:text-secondary-foreground"
              : "text-primary-foreground hover-text-foreground hover:text-foreground focus:text-foreground"
          )}
          onClick={() => handleExpand(item)}
          data-item-id={item._id}
        >
          <div className="flex items-start gap-2 truncate">
            {item.status === "done" ? (
              <Image
                src={BoxFilledIcon}
                alt="checkbox filled icon"
                width={12}
                height={12}
                onClick={(e) => handleDone(e, item._id, item.status)}
                className="invisible mt-1 opacity-50 hover:opacity-100 group-hover:visible"
              />
            ) : (
              <Image
                src={BoxIcon}
                alt="checkbox icon"
                width={12}
                height={12}
                onClick={(e) => handleDone(e, item._id, item.status)}
                className="invisible mt-1 opacity-50 hover:opacity-100 group-hover:visible"
              />
            )}
            <span
              className={classNames(
                `truncate text-left ${
                  item.type === "link" ? "group-hover:underline" : ""
                }`,
                isOverdue && "flex gap-1",
                item.status === "in progress" && "flex gap-1"
              )}
            >
              {item.title}
              {item.status === "in progress" && (
                <span className="mt-1 inline-block size-1 shrink-0 rounded-full bg-[#FFD966]/80" />
              )}
              {isOverdue && (
                <span className="mt-1 inline-block size-1 shrink-0 rounded-full bg-[#E34136]/80" />
              )}
            </span>
            {item.source !== "march" && (
              <div className="mt-[3px] flex items-center text-secondary-foreground">
                {getSourceIcon(item.source)}
              </div>
            )}
          </div>
          <div className="invisible mt-[3px] flex items-center gap-2 text-secondary-foreground group-hover:visible">
            <CalendarIcon
              size={14}
              className="hover-text"
              onClick={(e) =>
                handleRescheduleCalendar(e, item._id, item.dueDate, item.status)
              }
            />
            {inProgressAction && handleInProgress && (
              <Image
                src={BoxDashed}
                alt="checkbox dashed icon"
                width={12}
                height={12}
                onClick={(e) => handleInProgress(e, item._id, item.status)}
                className="opacity-50 hover:opacity-100"
              />
            )}
          </div>
        </button>
      ))}
    </>
  )
}
