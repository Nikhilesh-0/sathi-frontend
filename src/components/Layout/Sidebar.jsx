import { useHistory } from "../../hooks/useHistory";

function SessionItem({ session, onClick }) {
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
      className="w-full text-left px-4 py-3 hover:bg-cream transition-colors border-b border-border group"
    >
      <p className="text-sm text-charcoal truncate group-hover:text-saffron transition-colors">
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

export default function Sidebar({ onSelectSession }) {
  const { sessions, loadingSessions } = useHistory();

  return (
    <aside className="w-64 bg-white border-r border-border flex-col hidden md:flex">
      <div className="px-4 py-3 border-b border-border">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider">
          Recent Chats
        </p>
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
        ) : sessions.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-xs text-muted">No conversations yet</p>
            <p className="text-xs text-muted mt-1">Start chatting with Sathi!</p>
          </div>
        ) : (
          sessions.map((session) => (
            <SessionItem
              key={session.session_id}
              session={session}
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
