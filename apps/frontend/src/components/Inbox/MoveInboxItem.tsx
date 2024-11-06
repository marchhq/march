"use clent"

import { useModal } from "@/src/contexts/ModalProvider"
import React from "react"
import { Input } from "../ui/input"
import { DialogHeader, DialogTitle } from "../ui/dialog"
import useSpaceStore from "@/src/lib/store/space.store"
import { useAuth } from "@/src/contexts/AuthContext"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"

type Props = {
  itemId: string
}

const MoveInboxItem = (props: Props) => {
  const { session } = useAuth()
  const {hideModal} = useModal()

  console.log(props?.itemId)

  const { spaces, fetchSpaces } = useSpaceStore()
  const {updateItem, fetchInbox} = useCycleItemStore()
 
// Fetch spaces if they don't exist
React.useEffect(() => {
  if (!spaces) {
    void fetchSpaces(session)
  }
}, [fetchSpaces, session, spaces])

  console.log(spaces)
  //Should render all the spaces except the current one
  //Should render all the items like inbox today meeting etc except the current one(can use a prop for this to tell where is it coming from)
  //On clicking the item should move to that particular space
  //when the modal opens, it should have the item id

  const handleSpaceClick = async (spaceId: string) => {
    try {
      await updateItem(session, { spaces: [spaceId] }, props.itemId);
      // Update the item to move it to the selected space
      await fetchInbox(session)
      // Close the modal after moving the item
      hideModal()
    
    } catch (error) {
      console.error("Failed to move item:", error);
    }
  }

  return (
    <>
    <DialogHeader>
      <DialogTitle className="pl-4 py-2">
      <div className="flex justify-between gap-2 text-xs text-secondary-foreground">
            <span className="flex-1 truncate text-primary-foreground">
              <Input
                autoFocus
                className="border-none outline-none w-full px-0"
                placeholder="specify the target item: todo, note, event etc"
                />
            </span>
          </div>
      </DialogTitle>
      </DialogHeader>
      <div
        className="flex items-center gap-5 bg-transparent text-secondary-foreground"
        {...props}
      >
        <div className="flex h-fit min-w-[350px] flex-col gap-5 overflow-hidden rounded-lg bg-background p-5 text-sm">
       
          <div className="flex flex-col gap-1.5 max-h-96 overflow-y-auto">
            {spaces.map((space) => (
               <div
               key={space._id} 
               className="cursor-pointer hover:text-primary-foreground"
               onClick={() => handleSpaceClick(space._id)} 
             >
               {space.name}
             </div>
            ))}
          </div>
     
        </div>
      </div>
    </>
  )
}

export default MoveInboxItem
