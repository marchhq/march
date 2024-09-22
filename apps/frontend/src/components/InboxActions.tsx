import { useState } from "react"
import Button from "./atoms/Button"
import { Plus } from "@phosphor-icons/react"
import { Popover, PopoverContent, PopoverTrigger } from "./atoms/Popover"
import useSpaceStore from "../lib/store/space.inbox"
import { Page } from "../lib/@types/Items/space"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../hooks/use-toast"

const InboxActions = ({ pages }: { pages: Page[] }) => {
  const [newPageName, setNewPageName] = useState<string>("")
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const { createPage, fetchPages } = useSpaceStore()
  const { toast } = useToast()
  const { session } = useAuth()



  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="p-2 rounded-full hover:bg-secondary-foreground"
          type="button"
        >
          <Plus />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 dark:bg-secondary-border dark:text-primary-foreground">
        <div>
          {pages.length > 0 ? (
            pages.map((page) => <div key={page.uuid}>{page.name}</div>)
          ) : (
            <div className="text-sm text-center">
              Seems like you don't have any spaces
            </div>
          )}
        </div>

        <div className="mt-4">
          <input
            type="text"
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            placeholder="Enter new space name"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="w-full flex justify-center items-center mt-2">
          <Button
            variant="invisible"
           
            className="flex items-center gap-2"
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : (
              <>
                <Plus /> Create a new space
              </>
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default InboxActions
