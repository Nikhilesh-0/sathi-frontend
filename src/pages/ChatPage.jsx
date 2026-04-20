import { useState, useCallback } from "react";
import Header from "../components/Layout/Header";
import Sidebar from "../components/Layout/Sidebar";
import ChatWindow from "../components/Chat/ChatWindow";
import { getSessionMessages } from "../lib/api";

export default function ChatPage() {
  const [historicalMessages, setHistoricalMessages] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const handleSelectSession = useCallback(async (sessionId) => {
    setLoadingHistory(true);
    try {
      const messages = await getSessionMessages(sessionId);
      // messages from API: [{role, content}] — same shape MessageBubble expects
      setHistoricalMessages(messages);
    } catch (err) {
      console.error("Failed to load session:", err);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  const handleNewChat = useCallback(() => {
    setHistoricalMessages(null);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-cream">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onSelectSession={handleSelectSession} />
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
          <ChatWindow
            key={historicalMessages ? "history" : "new"}
            initialMessages={historicalMessages}
            onNewChat={handleNewChat}
          />
        </main>
      </div>
    </div>
  );
}
