import { useState, useCallback } from "react";
import { sendMessage } from "../lib/api";

// Use built-in crypto.randomUUID — no external dependency, works in all modern browsers
const generateId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

export const useChat = (language) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => generateId());
  const [bookingState, setBookingState] = useState(null);

  const sendUserMessage = useCallback(
    async (text) => {
      const userMsg = { role: "user", content: text };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      try {
        const data = await sendMessage({
          sessionId,
          message: text,
          language,
          history: messages,
          bookingState,
        });

        const assistantMsg = {
          role: "assistant",
          content: data.reply,
          fdCards: data.fd_cards,
          bookingReceipt: data.booking_receipt,
          retrievedContextUsed: data.retrieved_context_used,
        };

        setMessages((prev) => [...prev, assistantMsg]);
        if (data.booking_state) setBookingState(data.booking_state);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "माफ करें, कुछ गड़बड़ हो गई। थोड़ी देर बाद कोशिश करें। / ਮਾਫ਼ ਕਰਨਾ, ਕੁਝ ਗੜਬੜ ਹੋ ਗਈ। / দুঃখিত, কিছু সমস্যা হয়েছে।",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, language, sessionId, bookingState]
  );

  const resetChat = () => {
    setMessages([]);
    setBookingState(null);
  };

  return { messages, loading, sendUserMessage, resetChat, bookingState, sessionId };
};
