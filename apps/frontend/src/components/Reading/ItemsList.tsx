import React from "react"

import { CalendarIcon, Link2Icon } from "lucide-react"

import ImageWithFallback from "../ui/ImageWithFallback"
import { type ReadingItem } from "@/src/lib/@types/Items/Reading"
import { truncateString } from "@/src/utils/helpers"

interface ItemsListProps {
  items: ReadingItem[]
  handleExpand: (item: ReadingItem) => void
}

const ItemsList: React.FC<ItemsListProps> = ({ items, handleExpand }) => {
  if (items.length === 0) {
    return <p>Reading list is empty </p>
  }

  return (
    <div className="flex w-3/4 flex-col gap-2">
      {[...items].reverse().map((item: ReadingItem) => {
        const url = item.metadata?.url
        const favicon = item.metadata?.favicon
        console.log("ulr: ", item.metadata?.url)
        return (
          <button
            key={item._id}
            className="group flex flex-col justify-center gap-2 rounded-lg py-1"
            onClick={() => handleExpand(item)}
          >
            <div className="flex items-center gap-2">
              <div className="grow overflow-hidden">
                <h3 className="flex flex-wrap items-center gap-2 text-xs font-semibold text-foreground">
                  <span className="break-all">
                    {truncateString(item.title, 50)}
                  </span>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block ${url ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <span>
                      {favicon ? (
                        <ImageWithFallback
                          src={favicon}
                          FallbackIcon={Link2Icon}
                          alt="Favicon"
                          width={16}
                          height={16}
                          className="mt-0.5 size-3 shrink-0"
                        />
                      ) : (
                        ""
                      )}
                    </span>
                  </a>
                  <span className="invisible group-hover:visible">
                    <CalendarIcon size={13} className="hover-text" />
                  </span>
                </h3>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default ItemsList
