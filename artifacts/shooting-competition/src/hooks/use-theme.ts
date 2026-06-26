// =============================================================================
// use-theme.ts — Hook for toggling between light and dark mode.
//
// The chosen theme is stored in LocalStorage under "shooting-competition-theme"
// so it persists across page refreshes. The hook applies the theme by adding
// a "light" or "dark" CSS class to the root <html> element, which Tailwind CSS
// uses to switch between light and dark colour palettes.
//
// Usage:
//   const { theme, setTheme } = useTheme();
//   <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
//     Toggle
//   </button>
// =============================================================================

import { useEffect, useState } from "react";

/** The LocalStorage key where the theme preference is saved. */
const STORAGE_KEY = "shooting-competition-theme";

/**
 * Provides the current theme ("light" | "dark") and a setter.
 * Automatically applies the theme class to <html> and saves the preference.
 */
export function useTheme() {
  // Initialise from LocalStorage, defaulting to "light" if nothing is stored.
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem(STORAGE_KEY) as "light" | "dark") || "light";
  });

  // Whenever the theme changes, update the CSS class on <html> and save
  // the new preference to LocalStorage.
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove whichever class was set before, then add the new one.
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return { theme, setTheme };
}
