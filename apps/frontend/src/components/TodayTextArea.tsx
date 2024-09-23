import { useState } from "react"

import TextEditor from "./atoms/Editor"
import useEditorHook from "../hooks/useEditor.hook"

export const TodayTextArea = (): JSX.Element => {
  const [content, setContent] = useState("<p></p>")
  const [isSaved, setIsSaved] = useState(false)
  const editor = useEditorHook({
    content,
    setContent,
    setIsSaved,
    placeholder: "press / for markdown format",
  })
  return <TextEditor editor={editor} />
}
