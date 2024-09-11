import { type FC } from "react"

import { Notepad } from "@phosphor-icons/react"

import { type Note } from "@/src/lib/@types/Items/Note"

interface EachNoteProps {
  note: Note
  handleSetNote: (uuid: string) => void
  isActive: boolean
}

const EachNote: FC<EachNoteProps> = ({ note, handleSetNote, isActive }) => {
  return (
    <button
      key={note.uuid}
      onClick={() => {
        handleSetNote(note.uuid)
      }}
    >
      <div
        className={`flex items-center justify-start rounded-lg border p-2 ${isActive ? "border-border bg-secondary" : "border-transparent hover:bg-secondary"} gap-x-4 text-sm text-tertiary-foreground`}
      >
        <Notepad size={24} weight="duotone" />
        <p>{note.title.length > 0 ? note.title : "Untitled"}</p>
      </div>
    </button>
  )
}

export default EachNote
