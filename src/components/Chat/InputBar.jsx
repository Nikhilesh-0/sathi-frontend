import { useState, useRef, useEffect } from "react";

const PLACEHOLDERS = {
  hindi: "अपना सवाल यहाँ लिखें...",
  punjabi: "ਆਪਣਾ ਸਵਾਲ ਇੱਥੇ ਲਿਖੋ...",
  bengali: "আপনার প্রশ্ন এখানে লিখুন...",
};

export default function InputBar({ onSend, disabled, language = "hindi" }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
    }
  }, [text]);

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-3 bg-white border-t border-border px-4 py-3">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={PLACEHOLDERS[language] || PLACEHOLDERS.hindi}
        rows={1}
        className="flex-1 resize-none rounded-xl border border-border px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent placeholder:text-muted disabled:opacity-50 bg-cream"
        style={{ maxHeight: "120px", minHeight: "44px" }}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        className="bg-saffron text-white rounded-xl px-5 py-3 text-sm font-medium hover:bg-amber-600 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 shadow-sm"
        aria-label="Send message"
      >
        {disabled ? (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        )}
      </button>
    </div>
  );
}
