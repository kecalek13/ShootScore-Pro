// =============================================================================
// layout.tsx — The persistent page shell used by the main management page.
//
// Renders a sticky top header containing:
//   - The app logo and name (left side)
//   - A language toggle button ("EN" / "CZ") and a dark/light mode button (right side)
//
// Children passed to <Layout> are rendered in the scrollable area beneath
// the header. The header is hidden when printing (class "no-print").
// =============================================================================

import React from "react";
import { useTheme }    from "../hooks/use-theme";
import { useLanguage } from "../hooks/use-language";
import { Moon, Sun, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode; // The page content rendered below the header
}

export function Layout({ children }: LayoutProps) {
  const { theme, setTheme }       = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">

      {/* ── Sticky header ─────────────────────────────────────────────────── */}
      <header className="border-b no-print bg-card z-10 sticky top-0">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">

          {/* App logo and name */}
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg tracking-tight">{t.appName}</span>
          </div>

          {/* Right-side controls */}
          <div className="flex items-center gap-1">

            {/*
              Language toggle: displays "CZ" when English is active (clicking
              switches to Czech) and "EN" when Czech is active (clicking
              switches back to English).
            */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "cs" : "en")}
              data-testid="btn-toggle-language"
              className="font-semibold text-sm px-3"
              title={t.toggleLanguage}
            >
              {language === "en" ? "CZ" : "EN"}
            </Button>

            {/* Dark / light mode toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              data-testid="btn-toggle-theme"
              title={t.toggleTheme}
            >
              {/* Show Moon icon in light mode (clicking goes dark), Sun in dark mode */}
              {theme === "light"
                ? <Moon className="w-5 h-5" />
                : <Sun  className="w-5 h-5" />
              }
            </Button>

          </div>
        </div>
      </header>

      {/* ── Page content ──────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>

    </div>
  );
}
