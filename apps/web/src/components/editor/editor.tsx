"use client";

import { EditorContent, EditorRoot, type JSONContent } from "novel";
import { useRef, useState } from "react";
import { defaultExtensions } from "./extentions";
import "./prosemirror.css";
import EditorMenu from "./editor-menu";
import { NodeSelector } from "./selectors/node-selector";
import { Separator } from "../ui/separator";
import { LinkSelector } from "./selectors/link-selector";
import { TextButtons } from "./selectors/text-buttons";
import { ColorSelector } from "./selectors/color-selector";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNodeSelectorOpen, setIsNodeSelectorOpen] = useState(false);
  const [isLinkSelectorOpen, setIsLinkSelectorOpen] = useState(false);
  const [isColorSelectorOpen, setIsColorSelectorOpen] = useState(false);

  if (!initialValue) return null;

  const handleUpdate = () => {
    const content = contentRef.current;
    onChange(content);
  };

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
        onUpdate={handleUpdate}
      >
        <EditorMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <NodeSelector
            open={isNodeSelectorOpen}
            onOpenChange={setIsNodeSelectorOpen}
          />
          <Separator orientation="vertical" />
          <LinkSelector
            open={isLinkSelectorOpen}
            onOpenChange={setIsLinkSelectorOpen}
          />
          <Separator orientation="vertical" />
          <TextButtons />
        </EditorMenu>
      </EditorContent>
    </EditorRoot>
  );
};
export default Editor;
