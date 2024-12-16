import { memo } from "react"

import { Editor } from "@tiptap/react"

import MetaDetails from "../header/meta-details"
import TextEditor from "@/src/components/atoms/Editor"
import { Meet } from "@/src/lib/@types/Items/Meet"
import { calculateMeetDuration } from "@/src/utils/meet"

interface SpaceEditorProps {
  note: Meet
  title: string
  editor: Editor | null
  handleTitleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleTextareaKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  handleTitleFocus?: () => void
  handleTitleBlur?: () => void
  handleSaveNote?: () => void
  textareaRef: React.RefObject<HTMLTextAreaElement>
}

const SpaceEditor = ({
  note,
  title,
  editor,
  handleTitleChange,
  handleTextareaKeyDown,
  handleTitleFocus,
  handleTitleBlur,
  handleSaveNote,
  textareaRef,
}: SpaceEditorProps) => {
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
        onBlur={handleTitleBlur}
      />
      <div className="ml-2 flex items-center gap-4 text-secondary-foreground">
        <MetaDetails
          url={note.metadata?.hangoutLink}
          duration={calculateMeetDuration(
            note.metadata.start.dateTime,
            note.metadata.end.dateTime
          )}
        />
      </div>
      <div className="mt-4 max-w-6xl text-foreground">
        <TextEditor editor={editor} />
      </div>
    </div>
  )
}

export default memo(SpaceEditor)
