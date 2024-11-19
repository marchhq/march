import React from "react"

import { CalendarIcon, GithubIcon, MailsIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import BoxIcon from "@/public/icons/box.svg"
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
  isOverdue?: boolean
  doneLine?: boolean
}

const getSourceIcon = (source: string, sourceUrl: string) => {
  switch (source) {
    case "gmail":
      return (
        <Link href={sourceUrl} target="_blank">
          <MailsIcon size={14} />
        </Link>
      )
    case "githubIssue":
    case "githubPullRequest":
      return (
        <Link href={sourceUrl} target="_blank">
          <GithubIcon size={14} />
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
            className="opacity-50"
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
  handleDone,
  handleRescheduleCalendar,
  isOverdue = false,
  doneLine = false,
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
                isOverdue && "flex gap-1"
              )}
            >
              {item.title}
              {isOverdue && (
                <span className="mt-1 inline-block size-1 shrink-0 rounded-full bg-[#E34136]/80" />
              )}
            </span>
            {item.source !== "march" && (
              <div className="mt-[3px] flex items-center text-secondary-foreground">
                {getSourceIcon(item.source, item.metadata?.url || "")}
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
          </div>
        </button>
      ))}
    </>
  )
}
