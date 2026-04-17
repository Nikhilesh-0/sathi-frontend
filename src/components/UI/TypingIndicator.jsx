export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-white rounded-2xl rounded-tl-sm w-fit shadow-sm border border-border">
      <div
        className="w-2 h-2 bg-saffron rounded-full animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <div
        className="w-2 h-2 bg-saffron rounded-full animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <div
        className="w-2 h-2 bg-saffron rounded-full animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );
}
