import { useState, useCallback } from "react";
import Header from "../components/Layout/Header";
import Sidebar from "../components/Layout/Sidebar";
import ChatWindow from "../components/Chat/ChatWindow";
import { getSessionMessages } from "../lib/api";
import { useHistory } from "../hooks/useHistory";

export default function ChatPage() {
  const [historicalMessages, setHistoricalMessages] = useState(null);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // fetchSessions is used to refresh the sidebar after each message
  const { fetchSessions } = useHistory();

  const handleSelectSession = useCallback(async (sessionId) => {
    setLoadingHistory(true);
    try {
      const messages = await getSessionMessages(sessionId);
      setHistoricalMessages(messages);
      setActiveSessionId(sessionId);
    } catch (err) {
      console.error("Failed to load session:", err);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  const handleNewChat = useCallback(() => {
    setHistoricalMessages(null);
    setActiveSessionId(null);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-cream">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
          activeSessionId={activeSessionId}
        />
        <main className="flex-1 overflow-hidden relative">
          {loadingHistory && (
            <div className="absolute inset-0 bg-cream/80 flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 bg-saffron rounded-xl flex items-center justify-center text-white font-bold animate-pulse shadow">
                  S
                </div>
                <p className="text-xs text-muted">Loading chat...</p>
              </div>
            </div>
          )}
          {/*
            key= forces a full remount of ChatWindow when switching between
            history view and fresh chat. This resets useChat state cleanly
            so old messages never leak into new sessions.
          */}
          <ChatWindow
            key={historicalMessages ? `history-${activeSessionId}` : "new"}
            initialMessages={historicalMessages}
            onNewChat={handleNewChat}
            onMessageSent={fetchSessions}
          />
        </main>
      </div>
    </div>
  );
}