"use client"
import * as React from "react"

import { Check, Plus, X } from "@phosphor-icons/react"
import axios from "axios"

import { useAuth } from "../../contexts/AuthContext"
import { useToast } from "../../hooks/use-toast"
import useEditorHook from "../../hooks/useEditor.hook"
import { BACKEND_URL } from "../../lib/constants/urls"
import useInboxStore from "../../lib/store/inbox.store"
import useSpaceStore from "../../lib/store/space.store"
import Button from "../atoms/Button"
import { Input } from "../ui/input"
import TextEditor from "@/src/components/atoms/Editor"

const InboxSection: React.FC = () => {
  const { session } = useAuth()
  const [title, setTitle] = React.useState<string>("")
  const [description, setDescription] = React.useState("")
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [selectedPages, setSelectedPages] = React.useState<string[]>([])
  const [, setIsSaved] = React.useState(false)
  const [isAddItem, setIsAddItem] = React.useState<boolean>(false)
  const [selectedItemId, setSelectedItemId] = React.useState<string>("")

  const editor = useEditorHook({
    content: description,
    setContent: setDescription,
    setIsSaved,
    placeholder: "Enter your description here or use '/' for markdown",
  })

  const { toast } = useToast()
  const { fetchPages, pages } = useSpaceStore()

  const config = {
    headers: {
      Authorization: `Bearer ${session}`,
    },
  }

  React.useEffect(() => {
    void fetchPages(session)
  }, [])

  const addItemToInbox = async () => {
    if (!session) {
      console.error("User is not authenticated")
      return
    }

    if (!title.trim()) {
      toast({
        title: "Title is required",
        variant: "destructive",
      })
      return
    }
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/items/create`,
        {
          title: title,
          description: description,
          dueDate: date,
          pages: selectedPages,
        },
        config
      )
    } catch (error) {
      console.error("Error adding item to inbox:", error)
    }
  }

  return (
    <section>
      <h1 className="mb-4 flex items-center gap-4 text-4xl font-semibold text-black dark:text-zinc-300">
        Inbox
      </h1>
      {!isAddItem && (
        <Button
          onClick={() => setIsAddItem(true)}
          variant={"invisible"}
          className="my-6 flex items-center gap-4 py-2 text-zinc-700 hover:text-white dark:text-zinc-300"
        >
          <Plus size={21} />
          <h1 className="text-lg">Click to add an item</h1>
        </Button>
      )}
      {isAddItem && editor && (
        <div>
          <div className="group mb-6 h-full rounded-xl border bg-white p-2 focus-within:border-border dark:border-border dark:bg-background dark:text-white dark:focus-within:border-border">
            <div className="flex items-center justify-between">
              <Input
                placeholder="Title"
                className="mb-2 border-none text-xl outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <div>inbox actions</div>
                <div className="group">inbox actions</div>
                <button
                  className="rounded-lg p-1 text-primary-foreground hover:bg-secondary-foreground"
                  onClick={addItemToInbox}
                >
                  <Check size={20} />
                </button>
                <button
                  className="rounded-lg p-1 text-primary-foreground hover:bg-secondary-foreground"
                  onClick={() => {
                    setIsAddItem(false)
                    setDescription("")
                    editor.commands.setContent("") //Reset the text-editor content
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="pl-3">
              <TextEditor minH="40px" editor={editor} />
            </div>
          </div>
        </div>
      )}

      {/* Inbox items section */}
      <div>inbox items</div>
    </section>
  )
}

export default InboxSection
