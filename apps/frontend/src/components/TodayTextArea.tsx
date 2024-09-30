import { useEffect, useState, useRef } from "react";
import TextEditor from "./atoms/Editor";
import useEditorHook from "../hooks/useEditor.hook";
import { useJournal } from "../hooks/useJournal";
import axios from "axios";
import { BACKEND_URL } from "../lib/constants/urls";
import { useAuth } from "../contexts/AuthContext";

interface JournalProps {
  selectedDate: Date
}

const formatDate = (date: Date) => {
  const isoDate = date.toISOString();
  return isoDate.split("T")[0];
}

export const TodayTextArea = ({ selectedDate }: JournalProps): JSX.Element => {
  const [content, setContent] = useState("<p></p>");
  const [isSaved, setIsSaved] = useState(true);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const journal = useJournal();
  const formattedDate = formatDate(selectedDate);
  const { session } = useAuth();

  const editor = useEditorHook({
    content,
    setContent,
    setIsSaved,
    placeholder: "press / for markdown format",
  });

  const saveJournal = async (content: string) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/journals/create-update/`, {
        date: formattedDate,
        content: content
      }, {
        headers: {
          Authorization: `Bearer ${session}`
        }
      });

      if (!response) {
        console.error('Failed to save journal');
      } else {
        console.log('Journal saved');
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Error saving journal: ', err);
    }
  };

  useEffect(() => {
    if (journal?.journal?.content && journal?.journal?.date) {
      const isoJournalDate = journal.journal.date;
      const cleanJournalDate = isoJournalDate.split('T')[0];

      if (formattedDate === cleanJournalDate) {
        console.log("Updating content with journal data:", journal.journal.content);
        setContent(journal.journal.content);
      } else {
        setContent("<p></p>");
      }
    }
  }, [journal, formattedDate]);

  useEffect(() => {
    if (!isSaved) {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      saveTimerRef.current = setTimeout(() => {
        saveJournal(content);
        setIsSaved(false);
      }, 1000);
    }

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [content, isSaved]);

  return (
    <TextEditor editor={editor} minH="5vh" />
  );
};
