import React, { useState } from "react"
import useSpaceStore from "../lib/store/space.inbox"
import { useAuth } from "../contexts/AuthContext"
import { Input } from "./ui/input"
import { useToast } from "../hooks/useToast"
import { AxiosError } from "axios"

const CreateSpaceForm = ({ hideModal }: { hideModal?: () => void }) => {
  const [name, setName] = useState("")
  const [icon, setIcon] = useState("home")
  const [blocks, setBlocks] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const { createPage } = useSpaceStore()
  const { session } = useAuth()
  const { toast } = useToast()

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
        title: "Space create successfully!"
      })
    hideModal && hideModal()
    } catch (err) {
      setError(err.message || "Error creating page")
      toast({
        title: "Error while creating space",
        variant: "destructive"
      })
    }
  }

  return (
    <form
      className="dark:text-primary-foreground p-4"
      onSubmit={handleCreatePage}
    >
      <div>
        <Input
          type="text"
          placeholder="Enter a space Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border border-border outline-none focus-visible:border-secondary-foreground"
        />
      </div>

    {/* TODO:: To be implemented whenever the space page is created */}

      {/* <div>
        <Input
          type="text"
          placeholder="Icon"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
        />
      </div>

      <div>
        <Input
        placeholder="Blocks"
          type="text"
          value={blocks.join(", ")} // For display only
          onChange={(e) => setBlocks(e.target.value.split(","))} // Convert input to array
        />
      </div> */}

      {error && <div style={{ color: "red" }}>{error}</div>}

      <button type="submit" className="p-2 hover:bg-border cursor-pointer rounded-lg mt-6 self-end w-full">Create Space</button>
    </form>
  )
}

export default CreateSpaceForm
