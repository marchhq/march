"use client";

import { useRef } from "react";
import { useEffect } from "react";
import { Textarea } from "../ui/textarea";

interface TitleTextareaProps {
  title: string;
  setTitle: (title: string) => void;
}

const TitleTextarea = ({ title, setTitle }: TitleTextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [title]);

  const handleBlur = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitle("Untitled");
    } else {
      setTitle(trimmedTitle);
    }
  };

  const handleFocus = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Move cursor to the end of the text
      const length = textarea.value.length;
      textarea.setSelectionRange(length, length);
    }
  };

  return (
    <div className="w-full">
      <Textarea
        ref={textareaRef}
        placeholder="Title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none overflow-hidden min-h-[20px] py-2 px-3 text-base leading-tight"
        rows={1}
      />
    </div>
  );
};

export { TitleTextarea };
