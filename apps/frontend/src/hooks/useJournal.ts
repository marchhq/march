import { useEffect, useState, useCallback } from "react";
import { Journal } from "../lib/@types/Items/Journal";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { BACKEND_URL } from "../lib/constants/urls";

export const useJournal = (selectedDate?: string) => {
  const [journal, setJournal] = useState<Journal | null>(null);
  const { session } = useAuth();

  const fetchJournal = useCallback(async () => {
    if (!selectedDate) return;

    try {
      const response = await axios.get<Journal>(`${BACKEND_URL}/api/journals/${selectedDate}/`, {
        headers: {
          Authorization: `Bearer ${session}`
        }
      });

      setJournal(response.data)

    } catch (error) {
      console.error(error)
      setJournal(null);
    }
  }, [session, selectedDate]);

  useEffect(() => {
    if (session && selectedDate) {
      fetchJournal();
    }
  }, [session, selectedDate, fetchJournal]);

  return { journal, fetchJournal };
};
