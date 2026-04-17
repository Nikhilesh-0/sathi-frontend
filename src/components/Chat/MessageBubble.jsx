import FDCard from "./FDCard";
import BookingReceipt from "./BookingReceipt";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Sathi avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-saffron flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5 shadow-sm">
          S
        </div>
      )}

      <div
        className={`flex flex-col gap-3 max-w-[80%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        {/* Text bubble */}
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "bg-saffron text-white rounded-tr-sm"
              : "bg-white text-charcoal rounded-tl-sm shadow-sm border border-border"
          }`}
        >
          {message.content}
        </div>

        {/* FD product cards */}
        {Array.isArray(message.fdCards) && message.fdCards.length > 0 && (
          <div className="flex flex-col gap-3 w-full">
            {message.fdCards.map((fd) => (
              <FDCard key={fd.id} fd={fd} />
            ))}
          </div>
        )}

        {/* Booking receipt */}
        {message.bookingReceipt && (
          <BookingReceipt receipt={message.bookingReceipt} />
        )}

        {/* RAG verification badge */}
        {message.retrievedContextUsed && (
          <p className="text-xs text-muted italic flex items-center gap-1">
            <span>📚</span>
            <span>Verified from RBI guidelines</span>
          </p>
        )}
      </div>
    </div>
  );
}
