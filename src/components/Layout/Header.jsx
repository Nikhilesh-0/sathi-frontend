import LanguagePicker from "../UI/LanguagePicker";
import { useAuth } from "../../hooks/useAuth";

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-saffron flex items-center justify-center text-white font-bold text-base shadow-sm">
          S
        </div>
        <div>
          <p className="font-bold text-charcoal text-sm leading-none">Sathi</p>
          <p className="text-xs text-muted mt-0.5">साथी · ਸਾਥੀ · সাথী</p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <LanguagePicker />
        {user && (
          <div className="flex items-center gap-2 ml-1">
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-7 h-7 rounded-full border border-border"
              />
            )}
            <button
              onClick={signOut}
              className="text-xs text-muted hover:text-charcoal transition-colors hidden sm:block"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
