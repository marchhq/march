"use client"
import * as React from "react"

import Editor from "@/components/atoms/Editor"

const InboxSection: React.FC = () => {
  const [content, setContent] = React.useState("Start by editing this text...")

  return <Editor content={content} setContent={setContent} />
}

export default InboxSection
