import { memo } from "react"

import { PlusIcon } from "@radix-ui/react-icons"
import { Layers } from "lucide-react"

interface ActionHeaderProps {
  loading: boolean
  closeToggle: boolean
  onAdd: () => Promise<any>
  onClose: () => void
}

const ActionHeader = ({
  loading,
  closeToggle,
  onAdd,
  onClose,
}: ActionHeaderProps) => {
  return (
    <div className="flex w-full items-center justify-end gap-4">
      {!loading ? (
        <button
          onClick={onAdd}
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
        onClick={onClose}
      >
        <Layers size={16} />
      </button>
    </div>
  )
}

export default memo(ActionHeader)
