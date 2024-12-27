import { memo } from "react"

import { Editor } from "@tiptap/react"

import TextEditor from "@/src/components/atoms/Editor"
import MetaDetails from "@/src/components/header/meta-details"
import NoteDetails from "@/src/components/header/note-details"
import { Item } from "@/src/lib/@types/Items/Items"
import { formatDateHeader, fromNow } from "@/src/utils/datetime"
import { calculateMeetDuration } from "@/src/utils/meet"

interface NoteEditorProps {
  type: string
  note: Item
  title: string
  editor: Editor | null
  handleTitleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleTextareaKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  handleTitleFocus: () => void
  handleSaveNote: () => void
  textareaRef: React.RefObject<HTMLTextAreaElement>
}

const NoteEditor = ({
  type,
  note,
  title,
  editor,
  handleTitleChange,
  handleTextareaKeyDown,
  handleTitleFocus,
  handleSaveNote,
  textareaRef,
}: NoteEditorProps) => {
  return (
    <div onBlur={handleSaveNote}>
      <textarea
        ref={textareaRef}
        value={title}
        onChange={handleTitleChange}
        onKeyDown={handleTextareaKeyDown}
        placeholder="Untitled"
        className="w-full resize-none overflow-hidden truncate whitespace-pre-wrap break-words bg-background py-2 text-[21px] font-bold text-foreground outline-none placeholder:text-secondary-foreground focus:outline-none"
        rows={1}
        /* eslint-disable-next-line jsx-a11y/no-autofocus */
        autoFocus={!title || title.trim() === ""}
        onFocus={handleTitleFocus}
      />
      <div className="ml-2 flex items-center gap-4 text-secondary-foreground">
        {type === "note" ? (
          <NoteDetails
            createdAt={note.createdAt}
            updatedAt={note.updatedAt}
            formatDateHeader={formatDateHeader}
            fromNow={fromNow}
          />
        ) : (
          <MetaDetails
            url={note.metadata?.hangoutLink}
            duration={calculateMeetDuration(
              note.metadata?.start.dateTime,
              note.metadata?.end.dateTime
            )}
          />
        )}
      </div>
      <div className="mt-4 max-w-6xl text-foreground">
        <TextEditor editor={editor} />
      </div>
    </div>
  )
}

export default memo(NoteEditor)
