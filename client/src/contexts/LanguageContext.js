"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const LanguageContext = createContext();

// Provider component
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en"); // default to English

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("language") : null;
    if (stored) setLanguage(stored);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("language", language);
    }
  }, [language]);

  const value = { language, setLanguage };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook for easy usage
export function useLanguage() {
  return useContext(LanguageContext);
}

// Export the context itself if you need to use it directly
export { LanguageContext };
