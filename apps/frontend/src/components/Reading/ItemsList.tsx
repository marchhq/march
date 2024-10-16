import React from "react"

import { Icon } from "@iconify-icon/react"
import Image from "next/image"

import { useAuth } from "@/src/contexts/AuthContext"
import { type ReadingItem } from "@/src/lib/@types/Items/Reading"
import useReadingStore from "@/src/lib/store/reading.store"
import { Trash2Icon } from "lucide-react"

interface ItemsListProps {
  blockId: string | null
  spaceId: string
}

const ItemsList: React.FC<ItemsListProps> = ({ blockId, spaceId }) => {
  const { session } = useAuth()
  const { readingItems, deleteItem: deleteItemFromStore } = useReadingStore()

  const deleteItem = async (itemId: string) => {
    if (!blockId) return

    try {
      await deleteItemFromStore(session,spaceId, blockId, itemId)
    } catch (error) {
      console.error("Error deleting item:", error)
    }
  }

  if (readingItems.length === 0) {
    return <p>Reading list is empty </p>
  }

  return (
    <div className="flex flex-col gap-4 w-3/4">
      {[...readingItems].reverse().map((item: ReadingItem) => {
        const url = item.metadata?.url
        const favicon = item.metadata?.favicon
        return (
          <div key={item._id} className="group flex items-center gap-4 hover:bg-background-hover rounded-lg p-3">
            {favicon ? (
              <Image
                src={favicon}
                alt="Favicon"
                width={16}
                height={16}
                className="shrink-0"
              />
            ) : (
              <Icon
                icon="ph:circle-bold"
                className=" shrink-0 text-[16px] text-secondary-foreground"
              />
            )}
            <div className="grow overflow-hidden">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 ${url ? "cursor-pointer" : "cursor-default"}`}
              >
                <h3 className="flex flex-wrap items-center text-lg font-semibold text-foreground">
                  <span className="break-all">{item.title}</span>
                </h3>
              </a>
              {item.description && (
                <p className=" text-base text-secondary-foreground">
                  {item.description}
                </p>
              )}
            </div>
            <button
              className="invisible text-sm text-secondary-foreground hover:text-foreground group-hover:visible"
              onClick={() => deleteItem(item._id)}
            >
              <Trash2Icon color="red" size={18}/>
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default ItemsList
