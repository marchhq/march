import { type FC } from "react"

import { Notepad, Trash } from "@phosphor-icons/react"

import { type Note } from "@/src/lib/@types/Items/Note"

interface EachNoteProps {
  note: Note
  handleSetNote: (uuid: string) => void
  handleDeleteNote: (note: Note) => void
  isActive: boolean
}

const EachNote: FC<EachNoteProps> = ({
  note,
  handleSetNote,
  handleDeleteNote,
  isActive,
}) => {
  return (
    <div className="group flex gap-2">
      <button
        key={note.uuid}
        onClick={() => {
          handleSetNote(note.uuid)
        }}
        className="w-full truncate"
      >
        <div
          className={`flex items-center justify-between gap-x-4 border rounded-lg p-2 ${isActive ? "border-border bg-background" : "border-transparent hover:bg-background"} text-sm text-tertiary-foreground`}
        >
          <div className="flex items-center gap-x-4 truncate">
            <Notepad size={18} weight="duotone" className="flex-shrink-0" />
            <p className="min-w-0 truncate">{note.title || "Untitled"}</p>
          </div>
        </div>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation()
          handleDeleteNote(note)
        }}
        className="text-red-500 opacity-0 hover:text-red-700 group-hover:opacity-100"
      >
        <Trash size={16} className="flex-shrink-0" />
      </button>
    </div>
  )
}

export default EachNote
