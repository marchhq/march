// ItemsList.tsx
import React, { useEffect, useMemo, useCallback } from "react"
import { useAuth } from "@/src/contexts/AuthContext"
import useReadingStore from "@/src/lib/store/reading.store"
import { Icon } from "@iconify-icon/react"
import Image from "next/image"
import { ReadingItem, ReadingLabelName } from "@/src/lib/@types/Items/Reading"

interface ItemsListProps {
  blockId: string | null
  selectedLabel: ReadingLabelName | "all"
}

const ItemsList: React.FC<ItemsListProps> = ({ blockId, selectedLabel }) => {
  const { session } = useAuth()
  const { readingItems, updateItem, labels, fetchLabels } = useReadingStore()

  useEffect(() => {
    if (session) {
      fetchLabels(session)
    }
  }, [session, fetchLabels])

  const toggleItemProperty = useCallback(
    async (itemId: string, property: ReadingLabelName) => {
      if (!blockId || !session) return

      const item = readingItems.find((item) => item._id === itemId)
      if (!item) return

      const labelToToggle = labels.find((label) => label.name === property)
      if (!labelToToggle) {
        console.error(`Label for ${property} not found`)
        return
      }

      const hasLabel = item.labels.some(
        (label) => label._id === labelToToggle._id
      )
      const updatedLabels = hasLabel
        ? item.labels.filter((label) => label._id !== labelToToggle._id)
        : [...item.labels, labelToToggle]

      const updatedItem = { ...item, labels: updatedLabels }
      await updateItem(session, itemId, updatedItem)
    },
    [blockId, session, readingItems, labels, updateItem]
  )

  const filteredItems = useMemo(() => {
    if (selectedLabel === "all") return readingItems
    return readingItems.filter((item) =>
      item.labels.some((label) => label.name === selectedLabel)
    )
  }, [readingItems, selectedLabel])

  if (filteredItems.length === 0) {
    return <p>No items found for the selected label</p>
  }

  return (
    <div className="flex flex-col gap-8">
      {filteredItems
        .slice()
        .reverse()
        .map((item: ReadingItem) => {
          const { _id, metadata, title, description, labels: itemLabels } = item
          const url = metadata?.url
          const favicon = metadata?.favicon
          const isLiked = itemLabels.some(
            (label) => label.name === ReadingLabelName.LIKED
          )
          const isArchived = itemLabels.some(
            (label) => label.name === ReadingLabelName.ARCHIVE
          )

          return (
            <div key={_id} className="flex items-start gap-4 group relative">
              {favicon ? (
                <Image
                  src={favicon}
                  alt="Favicon"
                  width={16}
                  height={16}
                  className="mt-2 flex-shrink-0"
                />
              ) : (
                <Icon
                  icon="ph:circle-bold"
                  className="text-secondary-foreground mt-2 text-[16px] flex-shrink-0"
                />
              )}
              <div className="flex-grow overflow-hidden pr-24">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 ${
                    url ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <h3 className="text-foreground font-semibold text-lg flex items-center flex-wrap">
                    <span className="break-all">{title}</span>
                    {url && (
                      <span className="ml-2 flex items-center flex-shrink-0">
                        <Icon
                          icon="fluent:link-24-regular"
                          className="text-secondary-foreground hover:text-foreground text-[20px]"
                        />
                      </span>
                    )}
                  </h3>
                </a>
                {description && (
                  <p className="text-secondary-foreground text-base mt-1">
                    {description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 absolute right-0 top-0">
                <button
                  className="text-secondary-foreground hover:text-foreground text-sm w-16"
                  onClick={() =>
                    toggleItemProperty(_id, ReadingLabelName.LIKED)
                  }
                >
                  {isLiked ? "Unlike" : "Like"}
                </button>
                <button
                  className="text-secondary-foreground hover:text-foreground text-sm w-16"
                  onClick={() =>
                    toggleItemProperty(_id, ReadingLabelName.ARCHIVE)
                  }
                >
                  {isArchived ? "Unarchive" : "Archive"}
                </button>
              </div>
            </div>
          )
        })}
    </div>
  )
}

export default ItemsList
