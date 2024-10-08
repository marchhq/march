import React from "react"
import { useAuth } from "@/src/contexts/AuthContext"
import useReadingStore from "@/src/lib/store/reading.store"
import { Icon } from "@iconify-icon/react"
import { type ReadingItem } from "@/src/lib/@types/Items/Reading"
import Image from "next/image"

interface ItemsListProps {
  blockId: string | null
}

const ItemsList: React.FC<ItemsListProps> = ({ blockId }) => {
  const { session } = useAuth()
  const { readingItems, deleteItem: deleteItemFromStore } = useReadingStore()

  const deleteItem = async (itemId: string) => {
    if (!blockId) return

    try {
      await deleteItemFromStore(session, blockId, itemId)
    } catch (error) {
      console.error("Error deleting item:", error)
    }
  }

  if (readingItems.length === 0) {
    return <p>Reading list is empty</p>
  }

  return (
    <div className="flex flex-col gap-8">
      {[...readingItems].reverse().map((item: ReadingItem) => {
        const url = item.metadata?.url
        const favicon = item.metadata?.favicon
        return (
          <div key={item._id} className="flex items-start gap-4 group">
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
            <div className="flex-grow overflow-hidden">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 ${url ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <h3 className="text-foreground font-semibold text-lg flex items-center flex-wrap">
                  <span className="break-all">{item.title}</span>
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
              {item.description && (
                <p className="text-secondary-foreground text-base mt-1">
                  {item.description}
                </p>
              )}
            </div>
            <button
              className="invisible group-hover:visible text-secondary-foreground hover:text-foreground text-sm"
              onClick={() => deleteItem(item._id)}
            >
              delete
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default ItemsList
