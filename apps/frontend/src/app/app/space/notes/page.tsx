"use client"

import { useState, useRef, useEffect } from "react"

const NotesPage: React.FC = () => {
  const [title, setTitle] = useState("")
  const [height, setHeight] = useState("auto")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value)
  }

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      setHeight("auto")
      setHeight(`${textarea.scrollHeight}px`)
    }
  }, [title])

  return (
    <div className="w-full h-full px-8 py-16 bg-background">
      <textarea
        ref={textareaRef}
        value={title}
        onChange={handleInput}
        placeholder="Untitled"
        className="w-full text-3xl p-2 resize-none overflow-hidden outline-none focus:outline-none whitespace-pre-wrap break-words"
        style={{ height }}
        rows={1}
      />
    </div>
  )
}

export default NotesPage
