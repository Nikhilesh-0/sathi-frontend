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

export default function ChatWindow() {
  const { language } = useApp();
  const { messages, loading, sendUserMessage } = useChat(language);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const welcomeMsg = {
    role: "assistant",
    content: WELCOME_MESSAGES[language] || WELCOME_MESSAGES.hindi,
  };

  const allMessages = messages.length === 0 ? [welcomeMsg] : messages;
  const showQuickPrompts = messages.length === 0;
  const prompts = QUICK_PROMPTS[language] || QUICK_PROMPTS.hindi;

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cream">
        {allMessages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {/* Quick prompt chips — only show before first user message */}
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

      <InputBar onSend={sendUserMessage} disabled={loading} language={language} />
    </div>
  );
}
