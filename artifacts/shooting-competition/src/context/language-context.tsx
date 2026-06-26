// =============================================================================
// language-context.tsx — React context that provides the active language
// and the translation strings to the entire component tree.
//
// Wrap the app's root element with <LanguageProvider> (done in main.tsx).
// Then call useLanguage() from any component to get the "t" translations object
// and the ability to switch languages.
//
// The selected language is persisted in LocalStorage so it survives page refreshes.
// =============================================================================

import React, { createContext, useState } from "react";
import { Language, Translations, translations } from "../lib/i18n";

/** The LocalStorage key where the chosen language code is saved. */
const STORAGE_KEY = "shooting-competition-language";

/** Shape of the value provided to every consumer of this context. */
interface LanguageContextValue {
  language: Language;                  // Currently active language code ("en" | "cs")
  setLanguage: (lang: Language) => void; // Call this to switch languages
  t: Translations;                     // All translated strings for the active language
}

/**
 * The React context object itself.
 * Exported so the useLanguage hook (in a separate file) can read from it
 * without mixing component and hook exports in the same file.
 */
export const LanguageContext = createContext<LanguageContextValue | null>(null);

// ---------------------------------------------------------------------------
// LanguageProvider
//
// Wraps the app and makes language/translation data available to every child.
// Place this at the very top of the component tree (see main.tsx).
// ---------------------------------------------------------------------------
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Read the saved language from LocalStorage on first render.
  // Falls back to English if nothing is stored or the stored value is invalid.
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "cs") return stored;
    } catch {
      // LocalStorage may be unavailable in some browser configurations.
    }
    return "en";
  });

  /**
   * Switches the active language and saves the choice to LocalStorage
   * so it is remembered the next time the page loads.
   */
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore write errors (e.g. private browsing with storage disabled).
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language], // Always pass the correct translation object
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
