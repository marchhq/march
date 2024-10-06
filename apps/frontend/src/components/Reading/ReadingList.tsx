import React from "react"
import { useAuth } from "@/src/contexts/AuthContext"
import useReadingStore from "@/src/lib/store/reading.store"
import { Icon } from "@iconify-icon/react"
import { type ReadingItem } from "@/src/lib/@types/Items/Reading"

interface ReadingListProps {
  blockId: string | null
}

const ReadingList: React.FC<ReadingListProps> = ({ blockId }) => {
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
        const isUrl = item.metadata?.isUrl
        return (
          <div key={item._id} className="flex items-start gap-4 group">
            <Icon
              icon="ph:circle-bold"
              className="text-secondary-foreground mt-2 text-[16px]"
            />
            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <h3 className="text-foreground font-semibold text-lg flex items-center">
                  {item.title}
                  {isUrl && (
                    <a
                      href={item.title}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 flex items-center"
                    >
                      <Icon
                        icon="fluent:link-24-regular"
                        className="text-secondary-foreground hover:text-foreground text-[20px]"
                      />
                    </a>
                  )}
                </h3>
              </div>
              {!isUrl && item.description && (
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

export default ReadingList