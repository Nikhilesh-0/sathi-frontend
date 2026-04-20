import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import InputBar from "./InputBar";
import TypingIndicator from "../UI/TypingIndicator";
import { useChat } from "../../hooks/useChat";
import { useApp } from "../../context/AppContext";

const WELCOME_MESSAGES = {
  hindi:
    "नमस्ते! मैं Sathi हूँ — आपका FD सलाहकार। 😊\n\nबताइए, आप कितना पैसा कितने समय के लिए निवेश करना चाहते हैं? या FD के बारे में कोई सवाल पूछें — मैं आपकी मदद करूँगा!",
  punjabi:
    "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ Sathi ਹਾਂ — ਤੁਹਾਡਾ FD ਸਲਾਹਕਾਰ। 😊\n\nਦੱਸੋ, ਤੁਸੀਂ ਕਿੰਨੇ ਪੈਸੇ ਕਿੰਨੇ ਸਮੇਂ ਲਈ ਲਗਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ? ਜਾਂ FD ਬਾਰੇ ਕੋਈ ਸਵਾਲ ਪੁੱਛੋ!",
  bengali:
    "নমস্কার! আমি Sathi — আপনার FD পরামর্শদাতা। 😊\n\nবলুন, আপনি কত টাকা কতদিনের জন্য বিনিয়োগ করতে চান? অথবা FD সম্পর্কে যেকোনো প্রশ্ন জিজ্ঞেস করুন!",
};

const QUICK_PROMPTS = {
  hindi: [
    "FD kya hota hai?",
    "Mujhe best FD batao",
    "8% p.a. matlab kya hai?",
    "TDS kya hota hai?",
  ],
  punjabi: [
    "FD ki hunda hai?",
    "Mujhe best FD dasao",
    "DICGC insurance ki hai?",
    "FD book karna chahunda haan",
  ],
  bengali: [
    "FD কি?",
    "সেরা FD দেখান",
    "TDS কি?",
    "FD বুক করতে চাই",
  ],
};

export default function ChatWindow({ initialMessages, onNewChat }) {
  const { language } = useApp();
  const { messages, loading, sendUserMessage } = useChat(language);
  const bottomRef = useRef(null);

  // If initialMessages is set, we are in history-view mode.
  // We show the historical messages read-only, and new messages sent
  // go into the fresh useChat state (initialMessages becomes null via
  // the key prop on ChatWindow in ChatPage, so this branch is only
  // active when viewing history before typing anything).
  const isHistoryView = Array.isArray(initialMessages);

  const displayMessages = isHistoryView ? initialMessages : messages;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages, loading]);

  const welcomeMsg = {
    role: "assistant",
    content: WELCOME_MESSAGES[language] || WELCOME_MESSAGES.hindi,
  };

  // For a fresh chat: show welcome if no messages yet
  // For history view: show whatever came from Firestore (no welcome override)
  const allMessages =
    isHistoryView
      ? displayMessages
      : displayMessages.length === 0
        ? [welcomeMsg]
        : displayMessages;

  const showQuickPrompts = !isHistoryView && messages.length === 0;
  const prompts = QUICK_PROMPTS[language] || QUICK_PROMPTS.hindi;

  return (
    <div className="flex flex-col h-full">
      {/* History mode banner */}
      {isHistoryView && (
        <div className="flex items-center justify-between bg-amber-50 border-b border-amber-200 px-4 py-2 flex-shrink-0">
          <p className="text-xs text-amber-700 font-medium">
            📖 Viewing past conversation
          </p>
          <button
            onClick={onNewChat}
            className="text-xs text-saffron font-semibold hover:underline"
          >
            + New Chat
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cream">
        {allMessages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {/* Quick prompt chips — only show before first user message on fresh chat */}
        {showQuickPrompts && (
          <div className="flex flex-wrap gap-2 mt-2 ml-11">
            {prompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendUserMessage(prompt)}
                className="text-xs bg-white border border-border text-charcoal px-3 py-1.5 rounded-full hover:border-saffron hover:text-saffron transition-all shadow-sm"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-saffron flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              S
            </div>
            <TypingIndicator />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar — disabled during history view with a prompt to start fresh */}
      {isHistoryView ? (
        <div className="bg-white border-t border-border px-4 py-3 flex items-center justify-center">
          <button
            onClick={onNewChat}
            className="text-sm text-saffron font-semibold hover:underline"
          >
            Start a new conversation →
          </button>
        </div>
      ) : (
        <InputBar onSend={sendUserMessage} disabled={loading} language={language} />
      )}
    </div>
  );
}
