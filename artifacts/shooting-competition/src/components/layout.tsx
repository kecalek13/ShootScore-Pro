import React from "react";
import { useTheme } from "../hooks/use-theme";
import { useLanguage } from "../hooks/use-language";
import { Moon, Sun, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="border-b no-print bg-card z-10 sticky top-0">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg tracking-tight">{t.appName}</span>
          </div>

          <div className="flex items-center gap-1">
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

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              data-testid="btn-toggle-theme"
              title={t.toggleTheme}
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
