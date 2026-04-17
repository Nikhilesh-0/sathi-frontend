import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import LandingPage from "./pages/LandingPage";
import ChatPage from "./pages/ChatPage";

function ProtectedRoute({ children }) {
  const { user, loading } = useApp();

  if (loading) {
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

  return user ? children : <Navigate to="/" replace />;
}

function AppRoutes() {
  const { user, loading } = useApp();
  if (loading) return null;

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/chat" replace /> : <LandingPage />}
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
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
