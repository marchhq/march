"use client";

import { Link } from "@/src/lib/icons/Link"
import TextEditor from "../atoms/Editor"
import { useState } from "react"
import useEditorHook from "@/src/hooks/useEditor.hook"
import { useAuth } from "@/src/contexts/AuthContext";

const formatDate = (date: Date) => {
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const day = date.getDate();
  return `${weekday}, ${day.toString().padStart(2, '0')}`;
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

export const MeetNotes = ({ meetData }): JSX.Element => {

  const [content, setContent] = useState("<p></p>")
  const [isSaved, setIsSaved] = useState(true)
  const editor = useEditorHook({ content, setContent, setIsSaved })

  return (
    <>
      <div className="flex items-center gap-1 text-sm">
        <div className="size-4 rounded-sm bg-[#E34136]/80 mr-4"></div>
        <p>
          {meetData.metadata.start.dateTime ? formatDate(new Date(meetData.metadata.start.dateTime)) : 'Date not available'}
        </p>
        <p>.</p>
        <p>
          {meetData?.metadata.start?.dateTime && meetData?.metadata.end?.dateTime ?
            `${formatTime(new Date(meetData.metadata.start.dateTime))}: ${formatTime(new Date(meetData.metadata.end.dateTime))}`
            : 'Time not available'}
        </p>
        <a href={meetData?.metadata.hangoutLink} target="_blank" className="flex items-center gap-3 px-4 rounded-md text-secondary-foreground hover-bg">
          <Link />
          Google Meet Url
        </a>
      </div>
      <div>
        <textarea
          value={meetData?.title}
          placeholder="Untitled"
          className="w-full py-6 text-2xl font-bold resize-none overflow-hidden bg-background text-foreground placeholder:text-secondary-foreground truncate whitespace-pre-wrap break-words outline-none focus:outline-none"
          rows={1}
        />
        <TextEditor editor={editor} />
      </div>
    </>
  )
}
