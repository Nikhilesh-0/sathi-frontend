import { useState, useEffect } from "react";
import { getSessions, getSessionMessages } from "../lib/api";
import { useAuth } from "./useAuth";

export const useHistory = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  const fetchSessions = async () => {
    if (!user) return;
    setLoadingSessions(true);
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (err) {
      console.error("Failed to fetch sessions", err);
    } finally {
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [user]);

  return { sessions, loadingSessions, fetchSessions, getSessionMessages };
};
