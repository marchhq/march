"use clent"

import { useModal } from "@/src/contexts/ModalProvider"
import React from "react"
import { Input } from "../ui/input"
import { DialogHeader, DialogTitle } from "../ui/dialog"
import useSpaceStore from "@/src/lib/store/space.store"
import { useAuth } from "@/src/contexts/AuthContext"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"
import { useToast } from "@/src/hooks/use-toast"

type Props = {
  inboxItemId: string
}

const MoveInboxItem = ({ inboxItemId }: Props) => {
  const { session } = useAuth()
  const {hideModal} = useModal()
  const [searchTerm, setSearchTerm] = React.useState("") // State for the search term
  const { spaces, fetchSpaces } = useSpaceStore()
  const { updateItem, fetchInbox } = useCycleItemStore()
  const {toast} = useToast()

  // Fetch spaces if they don't exist
  React.useEffect(() => {
    if (!spaces) {
      void fetchSpaces(session)
    }
  }, [fetchSpaces, session, spaces])

  const handleSpaceClick = async (spaceId: string) => {
    try {
      await updateItem(session, { spaces: [spaceId] },inboxItemId)
      await fetchInbox(session)
      toast({title: "🚀 Moved successfully!",})
      hideModal()
    } catch (error) {
      console.error("Failed to move item:", error)
    }
  }

  // Filter spaces based on the search term
  const filteredSpaces = spaces.filter(space =>
    space.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
    <DialogHeader className="p-0 h-0 hidden">
      <DialogTitle className="p-0 hidden">
      </DialogTitle>
      </DialogHeader>
      <div className="flex justify-between gap-2 text-xs text-secondary-foreground px-4 pt-1">
            <span className="flex-1 truncate text-primary-foreground">
            <Input
                autoFocus
                className="border-none outline-none w-full px-0 text-primary-foreground placeholder:text-secondary-foreground"
                placeholder="Specify the target item: todo, note, event etc"
                value={searchTerm} // Bind the input value to the search term
                onChange={(e) => setSearchTerm(e.target.value)} // Update the search term on input change
              />
            </span>
          </div>
      <div
        className="flex items-center gap-5 bg-transparent text-secondary-foreground">
        <div className="flex h-fit min-w-[350px] flex-col gap-5 overflow-hidden rounded-lg bg-background p-5 text-sm">
       
          <div className="flex flex-col gap-1.5 max-h-96 overflow-y-auto">
            {filteredSpaces.length > 0 ? filteredSpaces.map((space) => (
               <div
               key={space._id} 
               className="cursor-pointer hover:text-primary-foreground"
               onClick={() => handleSpaceClick(space._id)} 
             >
               {space.name}
             </div>
            )):
            <div>No matching results found!</div>
            }
          </div>
     
        </div>
      </div>
    </>
  )
}

export default MoveInboxItem
