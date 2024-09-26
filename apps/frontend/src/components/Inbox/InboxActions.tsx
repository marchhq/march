import React, { useState } from "react"

import { Check, NoteBlank, Plus } from "@phosphor-icons/react"
import { House } from "@phosphor-icons/react/dist/ssr"
import { Clock } from "lucide-react"

import { useModal } from "../../contexts/ModalProvider"
import { Page } from "../../lib/@types/Items/space"
import Button from "../atoms/Button"
import { Popover, PopoverContent, PopoverTrigger } from "../atoms/Popover"
import CreateSpaceForm from "../CreateSpaceForm"
import { RescheduleCalendar } from "../RescheduleCalendar/RescheduleCalendar"
import { DialogDescription, DialogTitle } from "../ui/dialog"
import { InboxActionsProps } from "@/src/extensions/SlashCommand/types"

const InboxActions = ({
  pages = [],
  itemId,
  itemBelongsToPages = [],
  dueDate,
  actions,
  isAddItem,
  selectedPages = [],
  moveItemToSpace,
  setDate = () => {},
  setSelectedItemId,
  setSelectedPages = () => {},
}: InboxActionsProps) => {
  const [isCreating] = useState<boolean>(false)
  const { showModal, hideModal } = useModal()

  // Show modal to create a new space
  const showCreateSpaceForm = () => {
    showModal(
      <>
        <DialogTitle className="p-3 dark:text-primary-foreground">
          Create a space
        </DialogTitle>
        <DialogDescription>
          <CreateSpaceForm hideModal={hideModal} />
        </DialogDescription>
      </>
    )
  }

  // Handle page selection for adding or moving items
  const handlePageSelection = (pageId: string) => {
    if (isAddItem) {
      setSelectedPages((prevSelectedPages) => {
        const isPageSelected = prevSelectedPages.includes(pageId)
        return isPageSelected
          ? prevSelectedPages.filter((id) => id !== pageId)
          : [...prevSelectedPages, pageId]
      })
    } else if (moveItemToSpace) {
      const isItemInSpace = itemBelongsToPages.includes(pageId)
      moveItemToSpace(itemId || "", pageId, isItemInSpace ? "remove" : "add")
    }
  }

  return (
    <div>
      {/* Calendar Action */}
      {actions.includes("reschedule") && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => itemId && setSelectedItemId?.(itemId)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              itemId && setSelectedItemId?.(itemId)
            }
          }}
          className={`${isAddItem ? "visible" : "invisible focus-within:visible group-hover:visible"}`}
        >
          <RescheduleCalendar
            date={dueDate}
            setDate={setDate}
            icon={<Clock size={20} />}
          />
        </div>
      )}

      {/* Space Action */}
      {actions.includes("space") && (
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="rounded-full p-2 hover:bg-secondary-foreground"
              type="button"
            >
              <NoteBlank size={21} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 dark:bg-background dark:text-primary-foreground">
            <div>
              {pages.length > 0 ? (
                pages.map((page) => {
                  const isItemInSpace = itemBelongsToPages.includes(
                    page._id || ""
                  )
                  const isPageSelected = selectedPages.includes(page._id || "")

                  return (
                    <button
                      className="flex w-full items-center justify-between rounded-lg p-2 hover:bg-border"
                      key={page.uuid}
                      onClick={() => handlePageSelection(page._id || "")}
                    >
                      <div className="flex items-center gap-2">
                        {page.icon === "home" ? (
                          <House size={21} />
                        ) : (
                          <span>{page.icon}</span>
                        )}
                        {page.name}
                      </div>
                      {(isItemInSpace || isPageSelected) && <Check />}
                    </button>
                  )
                })
              ) : (
                <div className="text-center text-sm">
                  Seems like you don&apos;t have any spaces
                </div>
              )}
            </div>

            <div className="mt-2 flex w-full items-center justify-center">
              <Button
                variant="invisible"
                onClick={showCreateSpaceForm}
                className="flex items-center gap-2"
                disabled={isCreating}
              >
                <Plus /> Create a new space
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}

export default InboxActions
