import React, { useState } from "react"

import { AxiosError } from "axios"
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react"
import { SmilePlusIcon } from "lucide-react"

import Button from "./atoms/Button"
import { Popover, PopoverContent, PopoverTrigger } from "./atoms/Popover"
import { Input } from "./ui/input"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../hooks/useToast"
import useSpaceStore from "../lib/store/space.inbox"

const CreateSpaceForm = ({ hideModal }: { hideModal?: () => void }) => {
  const [name, setName] = useState("")
  const [icon, setIcon] = useState("home")
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false)
  const [blocks, setBlocks] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const { createPage } = useSpaceStore()
  const { session } = useAuth()
  const { toast } = useToast()

  const onEmojiClick = (emojiData: EmojiClickData) => {
    console.log(typeof emojiData.emoji)
    setIcon(emojiData.emoji)
    setIsEmojiPickerOpen(false) // Close the picker after selection
  }

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Construct the new page data
    const newPage = {
      name,
      icon,
      blocks,
    }

    try {
      await createPage(newPage, session)
      toast({
        title: "Space create successfully!",
      })
      hideModal && hideModal()
    } catch (err) {
      setError(err.message || "Error creating page")
      toast({
        title: "Error while creating space",
        variant: "destructive",
      })
    }
  }

  return (
    <form
      className="p-4 dark:text-primary-foreground"
      onSubmit={handleCreatePage}
    >
      <div className="relative flex items-center gap-2">
        <Input
          type="text"
          placeholder="Enter a space Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border border-border outline-none focus-visible:border-secondary-foreground"
        />
        <button
          onClick={() => setIsEmojiPickerOpen((val) => !val)}
          type="button"
          className="cursor-pointer rounded-full p-2"
        >
          {icon && icon !== "home" ? (
            <div className="size-5">{icon}</div>
          ) : (
            <SmilePlusIcon />
          )}
        </button>
        {isEmojiPickerOpen && (
          <div className="absolute right-0 top-12 w-full">
            {/* TODO:: Need to optimize this picker, fetches icons on every time modal is opened
                       - One way would be to use a provider and move this to a separate component
            */}
            <EmojiPicker
              theme={Theme.AUTO}
              skinTonesDisabled
              height={350}
              width={"100%"}
              onEmojiClick={onEmojiClick}
            />
          </div>
        )}
      </div>

      {/* TODO:: To be implemented whenever the space page is created */}

      {/* <div>
        <Input
        placeholder="Blocks"
          type="text"
          value={blocks.join(", ")} // For display only
          onChange={(e) => setBlocks(e.target.value.split(","))} // Convert input to array
        />
      </div> */}

      {error && <div style={{ color: "red" }}>{error}</div>}

      <button
        type="submit"
        className="mt-6 w-full cursor-pointer self-end rounded-lg p-2 hover:bg-border"
      >
        Create Space
      </button>
    </form>
  )
}

export default CreateSpaceForm
