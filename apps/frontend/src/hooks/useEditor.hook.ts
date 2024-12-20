import { useRef } from "react"

import Bold from "@tiptap/extension-bold"
import Link from "@tiptap/extension-link"
import { Placeholder } from "@tiptap/extension-placeholder"
import TaskItem from "@tiptap/extension-task-item"
import TaskList from "@tiptap/extension-task-list"
import { type Editor, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

import { SlashCommand } from "../extensions/SlashCommand"

interface Props {
  content: string
  setContent: (content: string) => void
  setIsSaved?: (isSaved: boolean) => void
  placeholder?: string
}

const useEditorHook = ({
  content,
  setContent,
  setIsSaved,
  placeholder = "press / for markdown format",
}: Props): Editor | null => {
  const timeoutId = useRef<NodeJS.Timeout | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Bold,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: "https",
        HTMLAttributes: {
          rel: "noopener noreferrer nofollow",
        },
      }),
      SlashCommand,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    autofocus: false,
    onUpdate: ({ editor }) => {
      if (!setIsSaved) return
      setIsSaved(false)
      setContent(editor.getHTML())

      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }

      timeoutId.current = setTimeout(() => {
        setIsSaved(true)
      }, 1000)
    },
    immediatelyRender: false,
  })

  return editor
}

export default useEditorHook
