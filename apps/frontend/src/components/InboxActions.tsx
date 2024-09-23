import { useState } from "react"

import { Check, NoteBlank, Plus } from "@phosphor-icons/react"
import { House } from "@phosphor-icons/react/dist/ssr"
import { Clock } from "lucide-react"

import Button from "./atoms/Button"
import { Popover, PopoverContent, PopoverTrigger } from "./atoms/Popover"
import CreateSpaceForm from "./CreateSpaceForm"
import { RescheduleCalendar } from "./RescheduleCalendar/RescheduleCalendar"
import { DialogDescription, DialogTitle } from "./ui/dialog"
import { useModal } from "../contexts/ModalProvider"
import { Page } from "../lib/@types/Items/space"

type ActionType = "reschedule" | "space"

interface InboxActionsProps {
  pages?: Page[]
  itemId?: string
  itemBelongsToPages?: string[]
  moveItemToSpace?: (
    itemId: string,
    spaceId: string,
    action: "add" | "remove"
  ) => void
  actions: ActionType[] | ""
  setDate?: (date: Date | undefined) => void
  setSelectedItemId?: (itemId: string) => void
  dueDate?: Date
}

const InboxActions = ({
  pages = [], // Default empty array if no pages provided
  itemId,
  itemBelongsToPages = [], // Default empty array for itemBelongsToPages
  moveItemToSpace,
  actions,
  setDate = () => {},
  setSelectedItemId,
  dueDate,
}: InboxActionsProps) => {
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const { showModal, hideModal } = useModal()

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

  return (
    <div>
      {/* Calendar Action */}
      {actions.includes("reschedule") && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            itemId && setSelectedItemId?.(itemId)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              itemId && setSelectedItemId?.(itemId)
            }
          }}
          className="invisible focus-within:visible group-hover:visible"
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
                  return (
                    <button
                      className="flex w-full items-center justify-between rounded-lg p-2 hover:bg-border"
                      key={page.uuid}
                      onClick={() =>
                        isItemInSpace
                          ? moveItemToSpace?.(
                              itemId || "",
                              page._id || "",
                              "remove"
                            )
                          : moveItemToSpace?.(
                              itemId || "",
                              page._id || "",
                              "add"
                            )
                      }
                    >
                      <div className="flex items-center gap-2">
                        {page.icon === "home" ? (
                          <span>
                            <House size={21} />
                          </span>
                        ) : (
                          <span>{page.icon}</span>
                        )}
                        {page.name}
                      </div>
                      {isItemInSpace && <Check />}
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
