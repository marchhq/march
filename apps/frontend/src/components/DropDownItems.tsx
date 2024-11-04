import { format } from "path"

import React from "react"

import { Icon } from "@iconify-icon/react/dist/iconify.mjs"

import { AddToSpace } from "./AddToSpace"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./atoms/Tooltip"
import { CycleItem } from "../lib/@types/Items/Cycle"
import { Box, CheckedBox } from "../lib/icons/Box"
import { LinearDark } from "../lib/icons/LinearCircle"
import { Link } from "../lib/icons/Link"
import { getOverdueText } from "../utils/datetime"
import { truncateString } from "../utils/helpers"

interface DropdownItemProps {
  item: CycleItem
  onToggleComplete: (item: CycleItem) => void
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
  return (
    <div className="group relative flex items-center gap-2">
      <button onClick={() => onToggleComplete(item)}>
        {item.status === "done" ? <CheckedBox /> : <Box />}
      </button>
      <li
        className={`${item.isCompleted ? "text-[#6D7077]" : "text-white"} flex min-w-0 items-center gap-2`}
      >
        {item.metadata?.url ? (
          <a
            href={item.metadata.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 truncate"
          >
            <span className="truncate">
              {truncateString(
                item.title.replace(/^https?:\/\/(www\.)?/, ""),
                25
              )}
            </span>
            <span className="shrink-0">
              {getSourceIcon(item.source) || <Link />}
            </span>
          </a>
        ) : (
          <span className="truncate">
            {truncateString(item.title.replace(/^https?:\/\/(www\.)?/, ""), 25)}
          </span>
        )}
        {isOverdue && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span className="inline-block size-2 shrink-0 rounded-full bg-[#E34136]/80"></span>
              </TooltipTrigger>
              <TooltipContent>
                {getOverdueText(item.dueDate?.toISOString() || "") ?? ""}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </li>
      <div className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <AddToSpace itemId={item._id} />
      </div>
    </div>
  )
}
