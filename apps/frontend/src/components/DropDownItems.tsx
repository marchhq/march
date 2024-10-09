import React from "react"

import { Icon } from "@iconify-icon/react/dist/iconify.mjs"

import { AddToSpace } from "./AddToSpace"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./atoms/Tooltip"
import { Item } from "../lib/@types/Items/TodayItems"
import { Box, CheckedBox } from "../lib/icons/Box"
import { LinearDark } from "../lib/icons/LinearCircle"
import { Link } from "../lib/icons/Link"

interface DropdownItemProps {
  item: Item
  onToggleComplete: (item: Item) => void
  isOverdue?: boolean
}

const getSourceIcon = (source) => {
  switch (source) {
    case "github":
      return (
        <Icon
          icon="ri:github-fill"
          style={{ fontSize: "18px", marginTop: "6px" }}
        />
      )
    case "linear":
      return <LinearDark />
    case "notion":
      return (
        <Icon
          icon="ri:notion-fill"
          style={{ fontSize: "18px", marginTop: "6px" }}
        />
      )
    case "gmail":
      return (
        <Icon icon="mdi:gmail" style={{ fontSize: "18px", marginTop: "6px" }} />
      )
    default:
      return null
  }
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  item,
  onToggleComplete,
  isOverdue,
}) => {
  const getOverdueText = () => {
    if (!item.dueDate) return ""

    const dueDate = new Date(item.dueDate)
    const now = new Date()
    const timeDiff = Math.abs(now.getTime() - dueDate.getTime())
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

    if (daysDiff === 1) return "since yesterday"
    if (daysDiff <= 7)
      return `since ${dueDate.toLocaleDateString("en-US", { weekday: "long" })}`
    return `since ${daysDiff} days`
  }

  return (
    <div className="flex items-center gap-2 relative group">
      <button onClick={() => onToggleComplete(item)}>
        {item.isCompleted ? <CheckedBox /> : <Box />}
      </button>
      <li
        className={`${item.isCompleted ? "text-[#6D7077]" : "text-white"} flex items-center gap-2 min-w-0`}
      >
        {item.metadata?.url ? (
          <a
            href={item.metadata.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 truncate"
          >
            <span className="truncate">{item.title}</span>
            <span className="flex-shrink-0">
              {getSourceIcon(item.source) || <Link />}
            </span>
          </a>
        ) : (
          <span className="truncate">{item.title}</span>
        )}
        {isOverdue && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span className="size-2 bg-[#E34136]/80 rounded-full inline-block flex-shrink-0"></span>
              </TooltipTrigger>
              <TooltipContent>{getOverdueText()}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </li>
      <div className="transition-opacity duration-200 opacity-0 group-hover:opacity-100">
        <AddToSpace itemId={item._id} />
      </div>
    </div>
  )
}
