import * as React from "react"

import { Check, PencilLine, X } from "@phosphor-icons/react"
import axios from "axios"

import InboxActions from "./InboxActions"
import { useAuth } from "../../contexts/AuthContext"
import { useToast } from "../../hooks/useToast"
import useInboxStore from "../../lib/store/inbox.store"
import useSpaceStore from "../../lib/store/space.inbox"
import TextEditor from "../atoms/Editor"
import { Input } from "../ui/input"
import { InboxItemProps } from "@/src/extensions/SlashCommand/types"
import useEditorHook from "@/src/hooks/useEditor.hook"
import { BACKEND_URL } from "@/src/lib/constants/urls"

const InboxItems: React.FC<InboxItemProps> = ({
  selectedItemId,
  setSelectedItemId,
  isAddItem = false,
}) => {
  const { toast } = useToast()
  const { pages } = useSpaceStore()
  const { session } = useAuth()
  const { fetchInboxData } = useInboxStore()
  const [, setIsSaved] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  // State for tracking the item being edited
  const [editItemId, setEditItemId] = React.useState<string | null>(null)
  const [editedItem, setEditedItem] = React.useState<{
    title: string
    description: string
  }>({
    title: "",
    description: "",
  })

  const [focusedItems, setFocusedItems] = React.useState<{
    [key: string]: boolean
  }>({})
  const { moveItemToDate, inboxItems } = useInboxStore()

  const editor = useEditorHook({
    content: editedItem.description,
    setContent: (content) =>
      setEditedItem((prev) => ({ ...prev, description: content })),
    setIsSaved,
    placeholder: "Enter your description here or use '/' for markdown",
  })

  React.useEffect(() => {
    if (editItemId && editor) {
      editor.commands.setContent(editedItem.description)
    }
  }, [editItemId])

  React.useEffect(() => {
    const updateDate = async () => {
      if (selectedItemId) {
        const result = await moveItemToDate(session, selectedItemId, date)
        if (result) {
          toast({
            title: "Updated successfully!",
          })
        }
      }
    }

    if (!isAddItem) {
      updateDate()
    }
  }, [date])

  const moveItemToSpace = async (
    itemId: string,
    spaceId: string,
    action: "add" | "remove"
  ) => {
    try {
      const updatedData =
        action === "add"
          ? { pageId: spaceId } // Adding the item to the space
          : { removePageId: spaceId } // Removing the item from the space

      const response = await axios.put(
        `${BACKEND_URL}/api/items/${itemId}/`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )
      void fetchInboxData(session)
      toast({
        title: "Updated successfully!",
      })
    } catch (error) {
      console.error(
        "Error moving item to the page:",
        error?.response?.data?.message || error.message
      )
    }
  }

  // Start editing title and description
  const handleEdit = (item: any) => {
    setEditItemId(item.uuid)
    setEditedItem({
      title: item.title,
      description: item.description,
    })
  }

  // Cancel editing title and description
  const cancelEdit = () => {
    setEditItemId(null)
    setEditedItem({ title: "", description: "" })
  }

  // Save edited changes
  const saveChanges = async (item: any) => {
    if (!editedItem.title.trim()) {
        toast({
          title: "Title is required",
          variant: "destructive",
        })
        return
      }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      }

      await axios.put(
        `${BACKEND_URL}/api/items/${item._id}`,
        editedItem,
        config
      )

      toast({
        title: "Item updated successfully!",
      })
      void fetchInboxData(session)
      cancelEdit()
    } catch (error) {
      console.error("Error updating item:", error)
      toast({
        title: "Failed to update item",
        variant: "destructive",
      })
    }
  }

  const handleFocus = (uuid: string) => {
    setFocusedItems((prev) => ({ ...prev, [uuid]: true }))
  }

  const handleBlur = (uuid: string) => {
    setFocusedItems((prev) => ({ ...prev, [uuid]: false }))
  }

  return (
    <div>
      {inboxItems.length === 0 ? (
        <div className="my-6 flex size-full items-center justify-center text-gray-500 dark:text-zinc-300">
          Inbox seems empty!
        </div>
      ) : (
        inboxItems.map((item) => (
          <div
            key={item.uuid}
            className={`group my-2 flex items-center justify-between rounded-xl bg-white p-4 text-gray-500 focus-within:border-border focus-within:ring-2 hover:bg-gray-100 dark:bg-background dark:text-zinc-300 dark:hover:border dark:hover:border-border ${
              focusedItems[item.uuid] ? "border border-border" : ""
            }`}
            onFocus={() => handleFocus(item.uuid)}
            onBlur={() => handleBlur(item.uuid)}
          >
            <div className="w-full">
              {editItemId === item.uuid ? (
                <>
                  {/* Editing Mode: Show Input Fields */}
                  <div className="flex items-center justify-between">
                    <Input
                      value={editedItem.title}
                      onChange={(e) =>
                        setEditedItem((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Title"
                      className="mb-2 w-full border-none p-0 text-xl font-bold outline-none"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        className="rounded-lg p-1 hover:bg-secondary-foreground text-primary-foreground"
                        onClick={() => saveChanges(item)}
                      >
                        <Check size={20} />
                      </button>
                      <button
                        className="rounded-lg p-1 hover:bg-secondary-foreground text-primary-foreground"
                        onClick={cancelEdit}
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="cursor-text">
                    <TextEditor minH="20px" editor={editor} />
                  </div>
                </>
              ) : (
                <>
                  {/* Normal Mode: Show Title and Description */}
                  <div className="flex cursor-pointer items-center justify-between">
                    <h3 className="mb-2 w-full cursor-pointer text-xl font-bold">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      {/* Inbox Actions */}
                      <button
                        className="invisible rounded-full p-2 focus-within:visible hover:bg-secondary-foreground group-hover:visible text-primary-foreground"
                        onClick={() => handleEdit(item)}
                      >
                        <PencilLine size={20} />
                      </button>
                      <InboxActions
                        dueDate={
                          item.dueDate ? new Date(item.dueDate) : undefined
                        }
                        setSelectedItemId={setSelectedItemId}
                        setDate={setDate}
                        itemId={item._id || ""}
                        actions={["reschedule"]}
                      />
                      <div className="invisible focus-within:visible group-hover:visible">
                        <InboxActions
                          pages={pages}
                          itemId={item._id || ""}
                          actions={["space"]}
                          moveItemToSpace={moveItemToSpace}
                          itemBelongsToPages={item.pages}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="rendered-content cursor-pointer">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: item.description || "",
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default InboxItems
