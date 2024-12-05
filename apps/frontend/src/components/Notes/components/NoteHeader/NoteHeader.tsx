import { memo } from "react"

import { PlusIcon } from "@radix-ui/react-icons"
import { Layers } from "lucide-react"

interface NoteActionsProps {
  loading: boolean
  closeToggle: boolean
  addNewNote: () => Promise<any>
  handleClose: () => void
}

const NoteActions = ({
  loading,
  closeToggle,
  addNewNote,
  handleClose,
}: NoteActionsProps) => {
  return (
    <div className="flex w-full items-center justify-end gap-4">
      {!loading ? (
        <button
          onClick={addNewNote}
          className="hover-bg flex items-center gap-1 truncate rounded-md px-1 text-secondary-foreground"
        >
          <PlusIcon />
        </button>
      ) : (
        <div className="flex items-center gap-1 rounded-md px-1 text-secondary-foreground">
          <span>loading...</span>
        </div>
      )}
      <button
        className={`hover-text flex items-center ${
          !closeToggle ? "text-foreground" : ""
        }`}
        onClick={handleClose}
      >
        <Layers size={16} />
      </button>
    </div>
  )
}

export default memo(NoteActions)
