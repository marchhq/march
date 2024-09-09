"use client"
import * as React from "react"

import { EditorContent, type Editor } from "@tiptap/react"

interface Props {
  editor: Editor | null
  placeholder?: string
  content?: string
}

const TextEditor: React.FC<Props> = ({ editor }) => {
  return (
    <div>
      <EditorContent
        className="[&>.ProseMirror.tiptap]:min-h-[70vh]"
        editor={editor}
      />
    </div>
  )
}

export default TextEditor
