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
        className={`flex items-center rounded-lg border p-2 ${isActive ? "border-white/10 bg-white/10" : "border-transparent hover:bg-white/5"} justify-start gap-x-4 text-sm text-zinc-400`}
      >
        <Notepad size={24} weight="duotone" />
        <p>{note.title}</p>
      </div>
    </button>
  )
}

export default EachNote
