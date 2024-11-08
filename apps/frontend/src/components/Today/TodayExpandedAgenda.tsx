import { useCallback, useState } from "react"

import Image from "next/image"

import TextEditor from "../atoms/Editor"
import ChevronLeftIcon from "@/public/icons/chevronleft.svg"
import { useAuth } from "@/src/contexts/AuthContext"
import useEditorHook from "@/src/hooks/useEditor.hook"
import { useEventsStore } from "@/src/lib/store/events.store"
import useMeetsStore from "@/src/lib/store/meets.store"

export const TodayExpandedAgenda: React.FC = () => {
  const { session } = useAuth()
  const { currentEvent, setCurrentEvent } = useEventsStore()
  const { createMeet } = useMeetsStore()

  const [content, setContent] = useState("<p></p>")
  const [isSaved, setIsSaved] = useState(true)

  const saveContent = useCallback(() => {
    createMeet(
      {
        ...currentEvent,
        description: content,
      },
      session
    )
    setIsSaved(true)
  }, [session, content, createMeet, currentEvent])

  const handleClose = useCallback(() => {
    saveContent()
    setCurrentEvent(null)
  }, [setCurrentEvent])

  const editor = useEditorHook({
    content,
    setContent,
    setIsSaved,
  })

  if (currentEvent) {
    return (
      <div>
        <div
          className="fixed inset-0 z-50 cursor-default bg-black/80"
          role="button"
          onClick={handleClose}
          onKeyDown={(e) => {
            if (e.key === "Escape" || e.key === "Esc") {
              handleClose()
            }
          }}
          tabIndex={0}
        ></div>
        <div className="fixed left-1/2 top-1/2 z-50 h-4/5 w-3/5 -translate-x-1/2 -translate-y-1/2 overflow-y-scroll rounded-lg bg-background p-10 shadow-lg">
          <div>
            <div className="flex size-full flex-col gap-4 text-foreground">
              <div className="flex items-center gap-4 text-xs text-secondary-foreground">
                <button
                  className="group/button flex items-center"
                  onClick={handleClose}
                >
                  <Image
                    src={ChevronLeftIcon}
                    alt="chevron left icon"
                    width={16}
                    height={16}
                    className="opacity-50 group-hover/button:opacity-100"
                  />
                </button>
              </div>
              <div className="flex items-center">
                <textarea
                  value={currentEvent.summary}
                  placeholder="title"
                  className="w-full resize-none overflow-hidden truncate whitespace-pre-wrap break-words bg-background text-base font-semibold text-foreground outline-none placeholder:text-secondary-foreground focus:outline-none"
                  rows={1}
                />
              </div>
              <div className="mt-1 text-foreground">
                <TextEditor editor={editor} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
