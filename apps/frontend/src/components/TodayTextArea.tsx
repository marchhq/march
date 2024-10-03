"use client";
import { useEffect, useState, useCallback } from "react";
import TextEditor from "./atoms/Editor";
import useEditorHook from "../hooks/useEditor.hook";
import { useJournal } from "../hooks/useJournal";

interface JournalProps {
  selectedDate: Date;
}

const formatDate = (date: Date) => {
  const isoDate = date.toISOString();
  return isoDate.split("T")[0];
};

export const TodayTextArea = ({ selectedDate }: JournalProps): JSX.Element => {
  const [content, setContent] = useState("<p></p>");
  const [isSaved, setIsSaved] = useState(true);
  const formattedDate = formatDate(selectedDate);
  const { journal, fetchJournal } = useJournal(formattedDate);

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    setIsSaved(false);
  }, []);

  const editor = useEditorHook({
    content,
    setContent: handleContentChange,
    setIsSaved,
  });

  useEffect(() => {
    console.log("Fetching journal for date: ", formattedDate);
    fetchJournal();
  }, [formattedDate, fetchJournal]);

  useEffect(() => {
    if (journal?.journal?.content) {
      console.log("Updating editor content");
      setContent(journal.journal.content);
      editor?.commands.setContent(journal.journal.content);
    } else {
      console.log("No journal content, resetting editor");
      setContent("<p></p>");
      editor?.commands.setContent("<p></p>");
    }
  }, [journal, editor]);

  return <TextEditor editor={editor} minH="30vh" />;
};
