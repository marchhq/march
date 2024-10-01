import { useEffect, useState, useRef, useCallback } from "react";
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
  const { journal, fetchJournal } = useJournal();
  const formattedDate = formatDate(selectedDate);
  const { session } = useAuth();

  const editor = useEditorHook({
    content,
    setContent,
    setIsSaved,
    placeholder: "press / for markdown format",
  });

  const saveJournal = useCallback(async (content: string) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/journals/create-update/`, {
        date: formattedDate,
        content
      }, {
        headers: {
          Authorization: `Bearer ${session}`
        }
      });

      if (response) {
        console.log('Journal saved');
        setIsSaved(true);
      } else {
        console.error('Failed to save journal');
      }
    } catch (err) {
      console.error('Error saving journal: ', err);
    }
  }, [formattedDate, session]);

  useEffect(() => {
    fetchJournal(formattedDate); // Fetch the journal for the selected date

    if (journal?.content && journal?.date) {
      const isoJournalDate = journal.date.split('T')[0];

      if (formattedDate === isoJournalDate) {
        setContent(journal.content);
      } else {
        setContent("<p></p>");
      }
    }
  }, [journal, formattedDate, fetchJournal]);

  useEffect(() => {
    if (!isSaved) {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      saveTimerRef.current = setTimeout(() => {
        saveJournal(content);
      }, 1000);
    }

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [content, isSaved, saveJournal]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  return (
    <TextEditor editor={editor} minH="5vh" />
  );
};
