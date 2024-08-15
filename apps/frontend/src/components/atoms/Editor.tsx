"use client"
import * as React from "react"

import {
  Code,
  ListBullets,
  ListChecks,
  ListNumbers,
  Quotes,
  TextBolder,
  TextItalic,
  TextStrikethrough,
  TextHOne,
  TextHTwo,
  TextHFour,
  TextHThree,
} from "@phosphor-icons/react"
import Link from "@tiptap/extension-link"
import TaskItem from "@tiptap/extension-task-item"
import TaskList from "@tiptap/extension-task-list"
import {
  useEditor,
  EditorContent,
  BubbleMenu,
  FloatingMenu,
} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

import classNames from "@/src/utils/classNames"

interface Props {
  placeholder?: string
  content?: string
  setContent?: (string) => void
}

const Editor: React.FC<Props> = ({ content, setContent }) => {
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
    ],
    content,
  })

  return (
    <>
      {editor !== null && (
        <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="ml-10 flex items-center gap-1 text-xs text-zinc-300">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={"hover-bg rounded-lg p-2 transition-all"}
            >
              <TextBolder size={18} weight="duotone" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={"hover-bg rounded-lg p-2 transition-all"}
            >
              <TextItalic size={18} weight="duotone" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={"hover-bg rounded-lg p-2 transition-all"}
            >
              <TextStrikethrough size={18} weight="duotone" />
            </button>
            <div className="h-6 w-px bg-zinc-900/50" />
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={"hover-bg rounded-lg p-2 transition-all"}
            >
              <TextHOne size={18} weight="duotone" />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={"hover-bg rounded-lg p-2 transition-all"}
            >
              <TextHTwo size={18} weight="duotone" />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={"hover-bg rounded-lg p-2 transition-all"}
            >
              <TextHThree size={18} weight="duotone" />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 4 }).run()
              }
              className={"hover-bg rounded-lg p-2 transition-all"}
            >
              <TextHFour size={18} weight="duotone" />
            </button>
            <div className="h-6 w-px bg-zinc-900/50" />
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={"hover-bg rounded-lg p-2 transition-all"}
            >
              <ListBullets size={18} weight="duotone" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={"hover-bg rounded-lg p-2 transition-all"}
            >
              <ListNumbers size={18} weight="duotone" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className={"hover-bg rounded-lg p-2 transition-all"}
            >
              <ListChecks size={18} weight="duotone" />
            </button>
            <div className="h-6 w-px bg-zinc-900/50" />
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={"hover-bg rounded-lg p-2 transition-all"}
            >
              <Quotes size={18} weight="duotone" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={"hover-bg rounded-lg p-2 transition-all"}
            >
              <Code size={18} weight="duotone" />
            </button>
          </div>
        </FloatingMenu>
      )}
      {editor !== null && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="w-max"
        >
          <div className="flex items-center gap-1 rounded-xl bg-zinc-700 p-1 text-xs text-zinc-300 shadow-lg">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={classNames(
                "p-2 rounded-lg hover-bg transition-all",
                editor.isActive("bold") ? "bg-zinc-900/50" : "bg-zinc-700"
              )}
            >
              <TextBolder size={18} weight="duotone" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={classNames(
                "p-2 rounded-lg hover-bg transition-all",
                editor.isActive("italic") ? "bg-zinc-900/50" : "bg-zinc-700"
              )}
            >
              <TextItalic size={18} weight="duotone" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={classNames(
                "p-2 rounded-lg hover-bg transition-all",
                editor.isActive("strike") ? "bg-zinc-900/50" : "bg-zinc-700"
              )}
            >
              <TextStrikethrough size={18} weight="duotone" />
            </button>
            <div className="h-6 w-px bg-zinc-900/50" />
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={classNames(
                "p-2 rounded-lg hover-bg transition-all",
                editor.isActive("heading") ? "bg-zinc-900/50" : "bg-zinc-700"
              )}
            >
              <TextHOne size={18} weight="duotone" />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={classNames(
                "p-2 rounded-lg hover-bg transition-all",
                editor.isActive("heading") ? "bg-zinc-900/50" : "bg-zinc-700"
              )}
            >
              <TextHTwo size={18} weight="duotone" />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={classNames(
                "p-2 rounded-lg hover-bg transition-all",
                editor.isActive("heading") ? "bg-zinc-900/50" : "bg-zinc-700"
              )}
            >
              <TextHThree size={18} weight="duotone" />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 4 }).run()
              }
              className={classNames(
                "p-2 rounded-lg hover-bg transition-all",
                editor.isActive("heading") ? "bg-zinc-900/50" : "bg-zinc-700"
              )}
            >
              <TextHFour size={18} weight="duotone" />
            </button>
            <div className="h-6 w-px bg-zinc-900/50" />
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={classNames(
                "p-2 rounded-lg hover-bg transition-all",
                editor.isActive("bulletList") ? "bg-zinc-900/50" : "bg-zinc-700"
              )}
            >
              <ListBullets size={18} weight="duotone" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={classNames(
                "p-2 rounded-lg hover-bg transition-all",
                editor.isActive("orderedList")
                  ? "bg-zinc-900/50"
                  : "bg-zinc-700"
              )}
            >
              <ListNumbers size={18} weight="duotone" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className={classNames(
                "p-2 rounded-lg hover-bg transition-all",
                editor.isActive("taskList") ? "bg-zinc-900/50" : "bg-zinc-700"
              )}
            >
              <ListChecks size={18} weight="duotone" />
            </button>
            <div className="h-6 w-px bg-zinc-900/50" />
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={classNames(
                "p-2 rounded-lg hover-bg transition-all",
                editor.isActive("blockquote") ? "bg-zinc-900/50" : "bg-zinc-700"
              )}
            >
              <Quotes size={18} weight="duotone" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={classNames(
                "p-2 rounded-lg hover-bg transition-all",
                editor.isActive("codeBlock") ? "bg-zinc-900/50" : "bg-zinc-700"
              )}
            >
              <Code size={18} weight="duotone" />
            </button>
          </div>
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </>
  )
}

export default Editor
