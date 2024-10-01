import { useEffect, useState, useCallback } from "react";
import { Journal } from "../lib/@types/Items/Journal";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { BACKEND_URL } from "../lib/constants/urls";

export const useJournal = (selectedDate?: string) => {
  const [journal, setJournal] = useState<Journal | null>(null);
  const { session } = useAuth();

  const fetchJournal = useCallback(async (date: string) => {
    try {
      const response = await axios.get<Journal>(`${BACKEND_URL}/api/journals/${date}`, {
        headers: {
          Authorization: `Bearer ${session}`
        }
      });
      setJournal(response.data);
    } catch (error) {
      console.error(`Failed to fetch journal for date ${date}: `, error);
    }
  }, [session]);

  useEffect(() => {
    if (session && selectedDate) {
      fetchJournal(selectedDate);
    }
  }, [session, selectedDate, fetchJournal]);

  return { journal, fetchJournal };
};
