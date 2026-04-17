import axios from "axios";
import { auth } from "./firebase";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeader = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
};

export const sendMessage = async ({ sessionId, message, language, history, bookingState }) => {
  const headers = await getAuthHeader();
  const response = await axios.post(
    `${BASE_URL}/api/v1/chat`,
    {
      user_id: auth.currentUser.uid,
      session_id: sessionId,
      message,
      language,
      history,
      booking_state: bookingState,
    },
    { headers }
  );
  return response.data;
};

export const getSessions = async () => {
  const headers = await getAuthHeader();
  const response = await axios.get(`${BASE_URL}/api/v1/history/sessions`, { headers });
  return response.data.sessions;
};

export const getSessionMessages = async (sessionId) => {
  const headers = await getAuthHeader();
  const response = await axios.get(`${BASE_URL}/api/v1/history/sessions/${sessionId}`, { headers });
  return response.data.messages;
};
