import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import LandingPage from "./pages/LandingPage";
import ChatPage from "./pages/ChatPage";

function LoadingScreen() {
  return (
    <div className="h-screen flex items-center justify-center bg-cream">
      <div className="text-center">
        <div className="w-12 h-12 bg-saffron rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-3 shadow-md animate-pulse">
          S
        </div>
        <p className="text-muted text-sm">Loading Sathi...</p>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useApp();

  // Always show spinner while Firebase resolves auth state.
  // Never render routes until we know definitively whether user is logged in.
  // This prevents the redirect loop caused by navigating before auth settles.
  if (loading) return <LoadingScreen />;

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/chat" replace /> : <LandingPage />}
      />
      <Route
        path="/chat"
        element={user ? <ChatPage /> : <Navigate to="/" replace />}
      />
      {/* Catch-all — send unknown routes to root */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
