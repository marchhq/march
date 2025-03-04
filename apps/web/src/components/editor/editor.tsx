"use client";

import { EditorContent, EditorRoot, type JSONContent } from "novel";
import { useRef, useState } from "react";
import { defaultExtensions } from "./extentions";

const extensions = [...defaultExtensions];

export const defaultEditorContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [],
    },
  ],
};

interface EditorProps {
  initialValue?: JSONContent;
  onChange?: (content: string) => void;
  placeholder?: string;
}

const Editor = ({
  initialValue,
  onChange,
  placeholder = "write something...",
}: EditorProps) => {
  const contentRef = useRef<string>("");

  if (!initialValue) return null;
  return (
    <EditorRoot>
      <EditorContent
        immediatelyRender={false}
        initialContent={initialValue}
        extensions={extensions}
        className="min-h-96 max-w-[450px] sm:max-w-[600px]"
        editorProps={{
          attributes: {
            class:
              "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
            "data-placeholder": placeholder,
          },
        }}
        onUpdate={({ editor }) => {
          contentRef.current = editor.getHTML();
          onChange?.(contentRef.current);
        }}
      />
    </EditorRoot>
  );
};
export default Editor;
