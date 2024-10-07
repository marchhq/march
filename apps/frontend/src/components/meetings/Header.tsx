"use client";

import { Link } from "@/src/lib/icons/Link"
import TextEditor from "../atoms/Editor"
import { useState } from "react"
import useEditorHook from "@/src/hooks/useEditor.hook"

const formatDate = (date: Date) => {
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const day = date.getDate();
  return `${weekday}, ${day} `;
};

export const Header = (): JSX.Element => {

  const [content, setContent] = useState("<p></p>")
  const [isSaved, setIsSaved] = useState(true)
  const editor = useEditorHook({ content, setContent, setIsSaved })
  const [currentWeek, setCurrentWeek] = useState();

  return (
    <>
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
    </>
  )
}
