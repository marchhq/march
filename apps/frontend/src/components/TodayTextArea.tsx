"use client"
import { useEffect, useState } from "react";
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

  const { journal, fetchJournal } = useJournal();
  const formattedDate = formatDate(selectedDate);

  useEffect(() => {
    fetchJournal(formattedDate).then(() => {
      if (journal?.journal?.content) {
        setContent(journal?.journal?.content)
      }
    });
  }, [formattedDate, fetchJournal]);

  console.log('journal content: ', journal)

  console.log('selected date: ', selectedDate)

  const [content, setContent] = useState("<p></p>")
  const [isSaved, setIsSaved] = useState(true);

  const editor = useEditorHook({
    content,
    setContent,
    setIsSaved,
  });

  return (
    <TextEditor
      editor={editor}
      minH="30vh"
    />
  );
};
