import FDCard from "./FDCard";
import BookingReceipt from "./BookingReceipt";

// Comparison table shown below cards when 2 or more FDs are recommended
function FDComparisonTable({ fdCards }) {
  return (
    <div className="w-full overflow-x-auto mt-1">
      <p className="text-xs font-semibold text-charcoal mb-2 flex items-center gap-1">
        <span>⚖️</span>
        <span>Quick Comparison</span>
      </p>
      <table className="w-full text-xs border-collapse bg-white rounded-xl overflow-hidden shadow-sm border border-border">
        <thead>
          <tr className="bg-saffron-light">
            <th className="text-left px-3 py-2 font-semibold text-charcoal">Bank</th>
            <th className="text-center px-3 py-2 font-semibold text-charcoal">Rate</th>
            <th className="text-center px-3 py-2 font-semibold text-charcoal">Tenor</th>
            <th className="text-center px-3 py-2 font-semibold text-charcoal">DICGC</th>
            <th className="text-right px-3 py-2 font-semibold text-charcoal">Min</th>
          </tr>
        </thead>
        <tbody>
          {fdCards.map((fd, i) => {
            const isHighest = fd.interest_rate === Math.max(...fdCards.map((f) => f.interest_rate));
            return (
              <tr
                key={fd.id}
                className={`border-t border-border ${i % 2 === 0 ? "bg-white" : "bg-cream"}`}
              >
                <td className="px-3 py-2">
                  <span className="font-medium text-charcoal leading-tight block truncate max-w-[120px]">
                    {fd.bank_name}
                  </span>
                  {fd.tag && (
                    <span className="text-saffron text-xs">{fd.tag}</span>
                  )}
                </td>
                <td className="text-center px-3 py-2">
                  <span
                    className={`font-bold ${isHighest ? "text-green-600" : "text-charcoal"
                      }`}
                  >
                    {fd.interest_rate}%
                  </span>
                  {isHighest && (
                    <span className="ml-1 text-green-600">↑</span>
                  )}
                </td>
                <td className="text-center px-3 py-2 text-muted">
                  {fd.tenor_months}m
                </td>
                <td className="text-center px-3 py-2">
                  {fd.dicgc_insured ? (
                    <span className="text-green-600 font-medium">✓</span>
                  ) : (
                    <span className="text-red-400 font-medium">✗</span>
                  )}
                </td>
                <td className="text-right px-3 py-2 text-muted">
                  ₹{fd.min_amount.toLocaleString("en-IN")}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function MessageBubble({ message, onExplainFD }) {
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
        className={`flex flex-col gap-3 max-w-[80%] ${isUser ? "items-end" : "items-start"
          }`}
      >
        {/* Text bubble */}
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${isUser
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
              <FDCard key={fd.id} fd={fd} onExplain={onExplainFD} />
            ))}
            {/* Show comparison table only when 2 or more cards */}
            {message.fdCards.length >= 2 && (
              <FDComparisonTable fdCards={message.fdCards} />
            )}
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