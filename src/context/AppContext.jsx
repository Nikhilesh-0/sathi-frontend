import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined = not yet known
  const [language, setLanguage] = useState(
    () => localStorage.getItem("sathi_language") || "hindi"
  );

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u); // null = logged out, object = logged in
    });
    return unsub;
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("sathi_language", lang);
  };

  // loading is true only while user is undefined (Firebase hasn't responded yet)
  const loading = user === undefined;

  return (
    <AppContext.Provider value={{ user: user ?? null, loading, language, changeLanguage }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
