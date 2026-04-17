import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { handleRedirectResult } from "../lib/firebase";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(
    () => localStorage.getItem("sathi_language") || "hindi"
  );

  useEffect(() => {
    // First, process any pending OAuth redirect result (from signInWithRedirect).
    // This must complete before we subscribe to onAuthStateChanged so the user
    // object is correctly set on the first emission and we avoid the redirect loop.
    handleRedirectResult()
      .catch(() => {
        // Ignore errors (e.g. no pending redirect) — auth state will still resolve
      })
      .finally(() => {
        // Subscribe to auth state changes after redirect is processed
        const unsub = onAuthStateChanged(auth, (u) => {
          setUser(u);
          setLoading(false);
        });
        // Return value from finally is ignored, cleanup handled below
      });

    // Also subscribe immediately so direct loads (no redirect) resolve auth fast
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("sathi_language", lang);
  };

  return (
    <AppContext.Provider value={{ user, loading, language, changeLanguage }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
