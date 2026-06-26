/**
 * use-language.ts
 * ---------------
 * Convenience hook that reads the current language, the setter function,
 * and the translated strings (`t`) from LanguageContext.
 *
 * Must be called inside a component that is a descendant of <LanguageProvider>.
 * Throws a clear error if used outside the provider so the mistake is caught early.
 *
 * Usage:
 *   const { t, language, setLanguage } = useLanguage();
 *   <h1>{t.competitionManagement}</h1>  // renders in the active language
 */

import { useContext } from "react";
import { LanguageContext } from "../context/language-context";

export function useLanguage() {
  // Read the current context value set by the nearest <LanguageProvider>.
  const ctx = useContext(LanguageContext);

  // Guard: if this hook is called outside <LanguageProvider>, ctx will be null.
  // Throw a descriptive error instead of silently returning undefined.
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");

  // Return the full context value: { language, setLanguage, t }.
  return ctx;
}
