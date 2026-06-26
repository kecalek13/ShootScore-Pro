// =============================================================================
// use-language.ts — Hook for accessing language context in components.
//
// Kept in a separate file from language-context.tsx because Vite's Fast Refresh
// requires each file to export either only React components or only hooks/utilities
// — not a mixture. Splitting them avoids unnecessary full-page reloads during
// development.
//
// Usage:
//   const { t, language, setLanguage } = useLanguage();
//   <p>{t.save}</p>
// =============================================================================

import { useContext } from "react";
import { LanguageContext } from "@/context/language-context";

/**
 * Returns the current language, a setter to change it, and the "t" object
 * containing all translated strings for the active language.
 *
 * Must be called inside a component that is a descendant of <LanguageProvider>.
 */
export function useLanguage() {
  const ctx = useContext(LanguageContext);

  // If this hook is called outside of <LanguageProvider>, fail loudly
  // so the developer knows exactly what went wrong.
  if (!ctx) {
    throw new Error("useLanguage must be called inside a <LanguageProvider>.");
  }

  return ctx;
}
