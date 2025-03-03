"use client";

import { EditorContent, EditorRoot } from "novel";

interface EditorProps {
  initialValue?: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function Editor({ initialValue }: EditorProps) {
  return (
    <EditorRoot>
      <EditorContent
        immediatelyRender={false}
        initialContent={initialValue}
      ></EditorContent>
    </EditorRoot>
  );
}
