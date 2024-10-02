import { useEffect, useState, useCallback } from "react";
import { Journal } from "../lib/@types/Items/Journal";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { BACKEND_URL } from "../lib/constants/urls";

export const useJournal = (selectedDate?: string) => {
  const [journal, setJournal] = useState<Journal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();

  const fetchJournal = useCallback(async () => {
    if (!selectedDate) return;

    try {
      const response = await axios.get<Journal>(`${BACKEND_URL}/api/journals/${selectedDate}/`, {
        headers: {
          Authorization: `Bearer ${session}`
        }
      });

      if (response.data) {
        setJournal(response.data);
        setError(null);
      } else {
        setJournal(null);
        setError("No journal data received for the selected date");
      }
    } catch (error) {
      setJournal(null);
      setError(`Failed to fetch journal: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [session, selectedDate]);

  useEffect(() => {
    if (session && selectedDate) {
      fetchJournal();
    }
  }, [session, selectedDate, fetchJournal]);

  return { journal, error, fetchJournal };
};
