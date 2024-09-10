import Link from "@tiptap/extension-link"
import TaskItem from "@tiptap/extension-task-item"
import TaskList from "@tiptap/extension-task-list"
import { type Editor, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from '@tiptap/extension-placeholder'

import { SlashCommand } from "../extensions/SlashCommand"
import React from "react"

interface Props {
  content: string
  placeholder?: string
  setContent: (content: string) => void
}

const useEditorHook = ({ content, setContent, placeholder }: Props): Editor | null => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      TaskList,
      Placeholder.configure({
        placeholder: placeholder || "Press '/' for markdown"
      }),
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
    ],
    content,
    autofocus: "end",
    onBlur: ({ editor }) => {
      setContent(editor.getHTML())
    },
    immediatelyRender: false,
  })

    // Update editor content when `content` prop changes
    React.useEffect(() => {
      if (editor && content !== editor.getHTML()) {
        editor.commands.setContent(content)
      }
    }, [content, editor])

  return editor
}

export default useEditorHook
