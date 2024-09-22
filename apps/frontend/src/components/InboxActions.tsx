import { useState } from "react"
import Button from "./atoms/Button"
import { Check, Note, NoteBlank, Plus } from "@phosphor-icons/react"
import { Popover, PopoverContent, PopoverTrigger } from "./atoms/Popover"
import useSpaceStore from "../lib/store/space.inbox"
import { Page } from "../lib/@types/Items/space"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../hooks/use-toast"
import { useModal } from "../contexts/ModalProvider"
import CreateSpaceForm from "./CreateSpaceForm"
import { DialogDescription, DialogHeader } from "./ui/dialog"

const InboxActions = ({
  pages,
  itemId,
  itemBelongsToPages,
  moveItemToSpace,
}: {
  pages: Page[]
  itemId: string
  itemBelongsToPages: string[] | undefined
  moveItemToSpace: (itemId: string, spaceId: string, action: 'add' | 'remove') => void
}) => {
  const [newPageName, setNewPageName] = useState<string>("")
  const [isCreating, setIsCreating] = useState<boolean>(false)

  const { showModal, hideModal } = useModal()

  const showCreateSpaceForm = () => {
    showModal(
      <>
        <DialogHeader className="dark:text-primary-foreground p-3">
          Create a space
        </DialogHeader>
        <DialogDescription>
          <CreateSpaceForm hideModal={hideModal}/>
        </DialogDescription>
      </>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="p-2 rounded-full hover:bg-secondary-foreground"
          type="button"
        >
          <NoteBlank size={21}/>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 dark:bg-background dark:text-primary-foreground">
        <div>
          {pages.length > 0 ? (
            pages.map((page) => {
              const isItemInSpace = itemBelongsToPages?.includes(page._id || "")
              return (
                <div
                  className="p-2 hover:bg-border cursor-pointer rounded-lg flex items-center justify-between"
                  key={page.uuid}
                  onClick={() =>
                    // If item is in the page then remove it if clicked again
                  isItemInSpace ? moveItemToSpace(itemId, page._id ? page._id : "", "remove") :   moveItemToSpace(itemId, page._id ? page._id : "", "add")
                  }
                >
                  <span>{page.name}</span>
                  {/* Conditionally render the checkmark if the item belongs to this page */}
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
  )
}

export default InboxActions
