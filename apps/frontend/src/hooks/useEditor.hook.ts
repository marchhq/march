import Link from "@tiptap/extension-link"
import TaskItem from "@tiptap/extension-task-item"
import TaskList from "@tiptap/extension-task-list"
import { type Editor, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

import { SlashCommand } from "../extensions/SlashCommand"

interface Props {
  content: string
  setContent: (content: string) => void
}

const useEditorHook = ({ content, setContent }: Props): Editor | null => {
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
    ],
    content,
    autofocus: "end",
    onBlur: ({ editor }) => {
      setContent(editor.getHTML())
    },
    immediatelyRender: false,
  })

  return editor
}

export default useEditorHook
