"use client"
import TextEditor from "@/src/components/atoms/Editor"
import useEditorHook from "@/src/hooks/useEditor.hook"
import classNames from "@/src/utils/classNames"
import { Icon } from "@iconify-icon/react/dist/iconify.mjs"
import { PlusIcon } from "@radix-ui/react-icons"
import { useState } from "react"


const MeetingPage: React.FC = () => {

  const [content, setContent] = useState("<p></p>")
  const [isSaved, setIsSaved] = useState(true)
  const editor = useEditorHook({ content, setContent, setIsSaved })
  const [closeToggle, setCloseToggle] = useState(false)
  const handleClose = () => setCloseToggle(!closeToggle)

  return (
    <main className="p-16 h-full text-gray-color flex justify-between">
      <section>
        <div className="flex items-center gap-4 text-sm">
          <div className="size-4 rounded-sm bg-white mr-4"></div>
          <p>12/15/2001.</p>
          <p>Last Edited 24 Hours Ago.</p>
          <button className="flex items-center gap-1 px-2 rounded-md text-secondary-foreground hover-bg">
            <PlusIcon />
            Add A New Note
          </button>
          <button
            onClick={handleClose}
            className="flex items-center hover-text">
            <Icon icon="basil:stack-solid" style={{ fontSize: "15px" }} />
          </button>
        </div>
        <div>
          <textarea
            value={"The Power of Documenting"}
            placeholder="Untitled"
            className="w-full py-6 text-2xl font-bold resize-none overflow-hidden bg-background text-foreground placeholder:text-secondary-foreground truncate whitespace-pre-wrap break-words outline-none focus:outline-none"
            rows={1}
          />
          <TextEditor editor={editor} />
        </div>
      </section>
      <section className={classNames(
        closeToggle ? "hidden" : "visible", "max-w-[200px] text-sm w-full text-secondary-foreground"
      )}>
        <span className="text-foreground">meetings</span>
      </section>
    </main>
  )
}

export default MeetingPage
