import React from "react";
import { useTheme } from "../hooks/use-theme";
import { useLanguage } from "../hooks/use-language";
import { useAuth } from "@workspace/replit-auth-web";
import { Moon, Sun, Target, LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();

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

            {/* Auth button */}
            {!isLoading && (
              isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2" data-testid="btn-user-menu">
                      {user?.profileImageUrl ? (
                        <img src={user.profileImageUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline text-sm">
                        {user?.firstName || user?.email || "Account"}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col">
                        {(user?.firstName || user?.lastName) && (
                          <span className="font-semibold">{[user.firstName, user.lastName].filter(Boolean).join(" ")}</span>
                        )}
                        {user?.email && (
                          <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} data-testid="btn-logout" className="text-destructive cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="outline" size="sm" onClick={login} className="gap-2" data-testid="btn-login">
                  <LogIn className="w-4 h-4" />
                  Log in
                </Button>
              )
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
