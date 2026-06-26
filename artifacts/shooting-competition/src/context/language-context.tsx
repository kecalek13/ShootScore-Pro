/**
 * language-context.tsx
 * --------------------
 * Provides a React Context that makes the active UI language and all
 * translated strings available to any component in the tree.
 *
 * The selected language is persisted to localStorage so it survives
 * page reloads without prompting the user again.
 *
 * How to use in a component:
 *   import { useLanguage } from "../hooks/use-language";
 *   const { t, language, setLanguage } = useLanguage();
 *   // t.addCompetitor → "Add Competitor" (en) or "Přidat závodníka" (cs)
 */

import React, { createContext, useState } from "react";
import { Language, Translations, translations } from "../lib/i18n";

/** localStorage key used to persist the user's language preference. */
const STORAGE_KEY = "shooting-competition-language";

/**
 * Shape of the value provided to every consumer of LanguageContext.
 */
interface LanguageContextValue {
  /** The currently active language code ("en" or "cs"). */
  language: Language;
  /**
   * Updates the active language and persists the choice to localStorage.
   * @param lang - The language code to switch to.
   */
  setLanguage: (lang: Language) => void;
  /**
   * The full set of translated strings for the active language.
   * Alias for `translations[language]` — use `t.someKey` in components.
   */
  t: Translations;
}

/**
 * The React context object.
 * Starts as null; consuming components must be wrapped in <LanguageProvider>
 * (enforced by the useLanguage hook which throws if the context is null).
 */
export const LanguageContext = createContext<LanguageContextValue | null>(null);

/**
 * Wrap your component tree with this provider to give all descendants
 * access to the active language and translation strings.
 *
 * Place it high in the tree — in main.tsx — so every page and component
 * can call useLanguage() without needing their own provider.
 *
 * @param children - Child components that will have access to the context.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  /**
   * Initialise the language from localStorage (persisted preference).
   * Falls back to "en" if nothing is stored or the stored value is invalid.
   * The initialiser function runs only once on first render.
   */
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // Only accept known valid language codes; reject any other string.
      if (stored === "en" || stored === "cs") return stored;
    } catch {
      // localStorage might throw in private/restricted browsing contexts.
    }
    return "en"; // Default language.
  });

  /**
   * Switches the active language and saves the choice to localStorage.
   * This triggers a re-render of all consumers, updating every UI string.
   *
   * @param lang - The language code to activate ("en" or "cs").
   */
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Silently ignore storage errors (e.g. in private browsing mode).
    }
  };

  return (
    // Provide language, setLanguage, and t (the current translation map)
    // to all child components via context.
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}
