import { useAuth } from "../../hooks/useAuth";

export default function GoogleSignIn() {
  const { signIn } = useAuth();

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-saffron opacity-5" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-saffron opacity-5" />
      </div>

      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-xl text-center relative z-10">
        {/* Logo */}
        <div className="w-16 h-16 bg-saffron rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-md">
          S
        </div>

        {/* Tagline */}
        <h1 className="text-2xl font-bold text-charcoal mb-1">
          Sathi में आपका स्वागत है
        </h1>
        <p className="text-sm text-muted mb-1">ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ · আপনাকে স্বাগতম</p>
        <p className="text-muted text-sm mb-8 leading-relaxed">
          Your trusted companion for Fixed Deposits. Ask in{" "}
          <strong>Hindi</strong>, <strong>Punjabi</strong>, or{" "}
          <strong>Bengali</strong> — get honest, jargon-free advice.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            "🏦 12 FD Products",
            "📚 RBI Guidelines",
            "🔒 DICGC Insured",
            "📄 Book FDs",
          ].map((f) => (
            <span
              key={f}
              className="text-xs bg-saffron-light text-saffron px-3 py-1 rounded-full font-medium"
            >
              {f}
            </span>
          ))}
        </div>

        {/* Sign in button */}
        <button
          onClick={signIn}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-border rounded-xl px-6 py-3 text-sm font-medium text-charcoal hover:border-saffron hover:text-saffron transition-all duration-200 shadow-sm"
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google से Sign In करें
        </button>

        <p className="text-xs text-muted mt-4">
          आपकी बातचीत सुरक्षित रहेगी · Your conversations are private
        </p>
      </div>
    </div>
  );
}
