"use client"

import React, { useEffect, useRef, useState } from "react"

import { DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input"
import { useAuth } from "@/src/contexts/AuthContext"
import { useModal } from "@/src/contexts/ModalProvider"
import { useToast } from "@/src/hooks/use-toast"
import { CycleItem } from "@/src/lib/@types/Items/Cycle"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"
import useSpaceStore from "@/src/lib/store/space.store"

type Props = {
  inboxItemId: string
}

const MoveInboxItem = ({ inboxItemId }: Props) => {
  const { session } = useAuth()
  const { hideModal } = useModal()
  const inputRef = useRef<HTMLInputElement>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const { spaces, fetchSpaces, loading: isSpaceLoading } = useSpaceStore()
  const {
    updateItem,
    fetchInbox,
    items,
    isLoading: isInboxItemsLoading,
  } = useCycleItemStore()
  const [modalItems, setModalItems] = useState<CycleItem[]>(items)
  const { toast } = useToast()

  useEffect(() => {
    if (!spaces || spaces.length === 0) {
      void fetchSpaces(session)
    }
    if (!items || items.length === 0) {
      void fetchInbox(session)
    }
    // Filter out the selected inbox item from the list
    const availableInboxItems = items.filter((item) => item._id !== inboxItemId)
    setModalItems(availableInboxItems)
  }, [fetchSpaces, session, spaces, items])

  // Focus the input field when the modal opens
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSpaceClick = async (spaceId: string) => {
    try {
      await updateItem(session, { spaces: [spaceId] }, inboxItemId)
      await fetchInbox(session)
      toast({ title: "🚀 Moved successfully!" })
      hideModal()
    } catch (error) {
      toast({ title: "Oops something seems wrong!", variant: "destructive" })
      console.error("Failed to move item:", error)
    }
  }

  const handleItemClick = async (
    destiantionItemID: string,
    destinationItemDescription: string
  ) => {
    try {
      const sourceItem: CycleItem[] = items.filter(
        (item) => item._id === inboxItemId
      )
      await updateItem(
        session,
        {
          description: `
          <p>${destinationItemDescription}</p>
          <ul data-type="taskList">
            <li data-checked="false" data-type="taskItem">
              <label><input type="checkbox"><span></span></label>
              <div data-indent="true">
                <p>${sourceItem[0].title}</p>
              </div>
            </li>
          </ul>
          <span data-indent="true">${sourceItem[0].description}</span>
        `,
        },
        destiantionItemID
      )

      //Remove the item from the main list
      await updateItem(session, { isDeleted: true }, inboxItemId)
      await fetchInbox(session)
      toast({ title: "🚀 Moved successfully!" })
      hideModal()
    } catch (error) {
      console.error(
        "Error file moving item to another item description::",
        error
      )
      toast({ title: "Oops something seems wrong!", variant: "destructive" })
    }
  }

  // Filter spaces based on the search term
  const filteredSpaces = spaces.filter((space) =>
    space.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  //Filter items based on search term
  const filteredItems = modalItems.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <DialogHeader className="sr-only h-0 p-0">
        <DialogTitle className="sr-only p-0"></DialogTitle>
      </DialogHeader>
      <div className="flex justify-between gap-2 px-4 pt-1 text-xs text-secondary-foreground">
        <span className="flex-1 truncate text-primary-foreground">
          <Input
            ref={inputRef}
            className="w-full border-none px-0 text-primary-foreground outline-none placeholder:text-secondary-foreground"
            placeholder="Specify the target item: todo, note, event etc"
            aria-label="Search spaces or items"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isSpaceLoading || isInboxItemsLoading}
          />
        </span>
      </div>
      <div className="flex items-center gap-5 bg-transparent text-secondary-foreground">
        <div className="flex h-fit min-w-[350px] flex-col gap-5 overflow-hidden rounded-lg bg-background p-5 py-0 text-sm">
          <div className="flex max-h-48 flex-col gap-1.5 overflow-y-auto">
            {isInboxItemsLoading && <div>Loading Inbox Items...</div>}
            {filteredItems.length > 0 ? (
              filteredItems?.map((item) => (
                <button
                  key={item._id}
                  className="cursor-pointer text-left hover:text-primary-foreground"
                  onClick={() => handleItemClick(item._id, item.description)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleItemClick(item._id, item.description)
                    }
                  }}
                  type="button"
                  disabled={isInboxItemsLoading}
                  aria-label={`Move to ${item.title}`}
                >
                  {item.title}
                </button>
              ))
            ) : (
              <div>{modalItems.length === 0 && searchTerm.length === 0 && !isInboxItemsLoading ? "No items avaiable" : "No matching results found!"}</div>
            )}
          </div>
        </div>
      </div>
      <div className="flex w-full items-center gap-2 px-2 text-secondary-foreground">
        <span>Spaces</span>
        <span className="h-px w-full bg-secondary-foreground"></span>
      </div>
      <div className="flex items-center gap-5 bg-transparent text-secondary-foreground">
        <div className="flex h-fit min-w-[350px] flex-col gap-5 overflow-hidden rounded-lg bg-background p-5 pt-0 text-sm">
          <div className="flex max-h-48 flex-col gap-1.5 overflow-y-auto">
            {isSpaceLoading && <div>Loading spaces...</div>}
            {filteredSpaces.length > 0 ? (
              filteredSpaces.map((space) => (
                <button
                  key={space._id}
                  className="cursor-pointer text-left hover:text-primary-foreground"
                  onClick={() => handleSpaceClick(space._id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSpaceClick(space._id)
                    }
                  }}
                  disabled={isSpaceLoading}
                  aria-label={`Move to ${space.name}`}
                  type="button"
                >
                  {space.name}
                </button>
              ))
            ) : (
              <div>{!isSpaceLoading && "No matching results found!"}</div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default MoveInboxItem
