import { useHistory } from "../../hooks/useHistory";

function SessionItem({ session, onClick, isActive }) {
  const date = new Date(session.updated_at);
  const dateStr = date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

  const langLabel = {
    hindi: "हिंदी",
    punjabi: "ਪੰਜਾਬੀ",
    bengali: "বাংলা",
  }[session.language] || session.language;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 transition-colors border-b border-border group ${isActive ? "bg-saffron-light" : "hover:bg-cream"
        }`}
    >
      <p
        className={`text-sm truncate transition-colors ${isActive ? "text-saffron font-medium" : "text-charcoal group-hover:text-saffron"
          }`}
      >
        {session.title}
      </p>
      <div className="flex items-center gap-2 mt-0.5">
        <span className="text-xs text-muted">{langLabel}</span>
        <span className="text-xs text-border">·</span>
        <span className="text-xs text-muted">{dateStr}</span>
      </div>
    </button>
  );
}

export default function Sidebar({ onSelectSession, onNewChat, activeSessionId }) {
  const { sessions, loadingSessions } = useHistory();

  const safeSessions = Array.isArray(sessions) ? sessions : [];

  return (
    <aside className="w-64 bg-white border-r border-border flex-col hidden md:flex">
      {/* Header with New Chat button */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider">
          Recent Chats
        </p>
        <button
          onClick={onNewChat}
          className="text-xs font-semibold text-saffron hover:text-amber-600 transition-colors flex items-center gap-1"
          title="Start a new chat"
        >
          <span className="text-base leading-none">+</span>
          <span>New</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loadingSessions ? (
          <div className="p-4 space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-3 bg-border rounded w-3/4 mb-1" />
                <div className="h-2 bg-border rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : safeSessions.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-xs text-muted">No conversations yet</p>
            <p className="text-xs text-muted mt-1">Start chatting with Sathi!</p>
          </div>
        ) : (
          safeSessions.map((session) => (
            <SessionItem
              key={session.session_id}
              session={session}
              isActive={session.session_id === activeSessionId}
              onClick={() => onSelectSession(session.session_id)}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <p className="text-xs text-muted text-center">
          🔒 Your chats are private & secure
        </p>
      </div>
    </aside>
  );
}