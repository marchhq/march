import NoteDetails from "@/src/components/header/note-details"
import { NoteLink } from "@/src/components/NoteLink"
import { formatDateHeader } from "@/src/utils/datetime"

interface SimplifiedNote {
  id: string
  title: string
  href: string
  createdAt: string
  isActive: boolean
  onDelete?: (id: string) => void
}

interface ModalProps {
  notes: SimplifiedNote[]
  handleClose: () => void
  buttonPosition?: { top: number; right: number }
}

export const NoteStackModal = ({
  notes,
  handleClose,
  buttonPosition,
}: ModalProps) => {
  const position = buttonPosition || { top: 0, right: 0 }

  return (
    <div>
      <div
        className="fixed inset-0 z-50 cursor-default"
        role="button"
        onClick={handleClose}
        onKeyDown={(e) => {
          if (e.key === "Escape" || e.key === "Esc") {
            handleClose()
          }
        }}
        tabIndex={0}
      />
      <div
        className="fixed z-50 h-[535px] w-[371px] overflow-y-auto rounded-lg border border-border bg-background p-6"
        style={{
          top: `${position.top + 10}px`,
          right: `${position.right}px`,
        }}
      >
        <div className="flex flex-col gap-2">
          {notes?.map((note) => (
            <div
              key={note.id}
              className="group flex flex-col items-start justify-between"
            >
              <NoteLink note={note} isActive={note.isActive} />
              <div className="pl-7 text-secondary-foreground">
                <NoteDetails
                  createdAt={note.createdAt}
                  formatDateHeader={formatDateHeader}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
