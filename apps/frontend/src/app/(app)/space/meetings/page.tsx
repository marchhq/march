"use client"
import { useState } from "react"

import { Icon } from "@iconify-icon/react/dist/iconify.mjs"

import TextEditor from "@/src/components/atoms/Editor"
import useEditorHook from "@/src/hooks/useEditor.hook"
import { Link } from "@/src/lib/icons/Link"
import classNames from "@/src/utils/classNames"

const MeetingPage: React.FC = () => {
  const [content, setContent] = useState("<p></p>")
  const [isSaved, setIsSaved] = useState(true)
  const editor = useEditorHook({ content, setContent, setIsSaved })
  const [closeToggle, setCloseToggle] = useState(false)
  const handleClose = () => setCloseToggle(!closeToggle)

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      handleClose()
    }
  }

  return (
    <main className="p-16 h-full text-gray-color flex justify-between">
      <section>
        <div className="flex items-center gap-1 text-sm">
          <div className="size-4 rounded-sm bg-[#E34136]/80 mr-4"></div>
          <p>Tue, Aug 06</p>
          <p>.</p>
          <p>17:00: 18:00.</p>
          <button className="flex items-center gap-3 px-4 rounded-md text-secondary-foreground hover-bg">
            <Link />
            Google Meet Url
          </button>
        </div>
        <div>
          <textarea
            value={"march stand up"}
            placeholder="Untitled"
            className="w-full py-6 text-2xl font-bold resize-none overflow-hidden bg-background text-foreground placeholder:text-secondary-foreground truncate whitespace-pre-wrap break-words outline-none focus:outline-none"
            rows={1}
          />
          <TextEditor editor={editor} />
        </div>
      </section>
      <section className="max-w-[200px] text-sm w-full text-secondary-foreground">
        <span
          role="button"
          tabIndex={0}
          onClick={handleClose}
          onKeyDown={handleKeyDown}
          className="hover:text-foreground cursor-pointer"
        >
          stack
        </span>
        <div className={classNames(closeToggle ? "hidden" : "visible", "mt-4")}>
          march stand up
        </div>
      </section>
    </main>
  )
}

export default MeetingPage
