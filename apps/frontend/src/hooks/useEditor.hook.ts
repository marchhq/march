import { useEffect, useState } from "react"

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
  setIsSaved: (isSaved: boolean) => void
  placeholder?: string
}

const useEditorHook = ({
  content,
  setContent,
  setIsSaved,
  placeholder = "press / for markdown format",
}: Props): Editor | null => {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  )

  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
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
    autofocus: "end",
    onUpdate: ({ editor }) => {
      setIsSaved(false)

      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }

      const newTimer = setTimeout(() => {
        setContent(editor.getHTML())
        setIsSaved(true)
      }, 2000)

      setDebounceTimer(newTimer)
    },
    immediatelyRender: false,
  })

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
    }
  }, [debounceTimer])

  return editor
}

export default useEditorHook
