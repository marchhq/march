import { useState } from "react"
import Button from "./atoms/Button"
import { Check, NoteBlank, Plus } from "@phosphor-icons/react"
import { Popover, PopoverContent, PopoverTrigger } from "./atoms/Popover"
import { Page } from "../lib/@types/Items/space"
import { useModal } from "../contexts/ModalProvider"
import CreateSpaceForm from "./CreateSpaceForm"
import { DialogDescription, DialogTitle } from "./ui/dialog"
import { House } from "@phosphor-icons/react/dist/ssr"
import { RescheduleCalendar } from "./RescheduleCalendar/RescheduleCalendar"
import { Clock } from "lucide-react"

type ActionType = "reschedule" | "space"

interface InboxActionsProps {
  pages?: Page[]
  itemId?: string
  itemBelongsToPages?: string[]
  moveItemToSpace?: (itemId: string, spaceId: string, action: "add" | "remove") => void
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
  dueDate
}: InboxActionsProps) => {
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const { showModal, hideModal } = useModal()

  const showCreateSpaceForm = () => {
    showModal(
      <>
        <DialogTitle className="dark:text-primary-foreground p-3">
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
      className="invisible group-hover:visible focus-within:visible"
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
              className="p-2 rounded-full hover:bg-secondary-foreground"
              type="button"
            >
              <NoteBlank size={21} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 dark:bg-background dark:text-primary-foreground">
            <div>
              {pages.length > 0 ? (
                pages.map((page) => {
                  const isItemInSpace = itemBelongsToPages.includes(page._id || "")
                  return (
                    <div
                      className="p-2 hover:bg-border cursor-pointer rounded-lg flex items-center justify-between"
                      key={page.uuid}
                      onClick={() =>
                        isItemInSpace
                          ? moveItemToSpace?.(itemId || "", page._id || "", "remove")
                          : moveItemToSpace?.(itemId || "", page._id || "", "add")
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
                    </div>
                  )
                })
              ) : (
                <div className="text-sm text-center">
                  Seems like you don't have any spaces
                </div>
              )}
            </div>

            <div className="w-full flex justify-center items-center mt-2">
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
