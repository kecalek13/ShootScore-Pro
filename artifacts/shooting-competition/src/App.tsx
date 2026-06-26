// =============================================================================
// App.tsx — Root application component.
//
// Sets up the three global providers that every page depends on:
//   - QueryClientProvider : powers any data-fetching hooks (TanStack Query)
//   - TooltipProvider     : enables shadcn tooltip components
//   - WouterRouter        : handles client-side URL routing
//
// Then defines the route table:
//   /         → MainPage  (competitor management & score entry)
//   /display  → DisplayPage (TV / projector live ranking view)
//   *         → NotFound  (any unknown URL)
//
// Note: <LanguageProvider> is added one level higher in main.tsx so it wraps
// everything, including App itself.
// =============================================================================

import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound    from "@/pages/not-found";
import MainPage    from "@/pages/MainPage";
import DisplayPage from "@/pages/DisplayPage";

// A single QueryClient instance shared across the whole app.
// (Not heavily used since this app stores everything in LocalStorage,
// but required by shadcn components that depend on TanStack Query.)
const queryClient = new QueryClient();

// ---------------------------------------------------------------------------
// Router — maps URL paths to page components.
// ---------------------------------------------------------------------------
function Router() {
  return (
    <Switch>
      {/* Home page: management table, score entry, import/export */}
      <Route path="/"        component={MainPage} />

      {/* Display page: fullscreen live ranking for TVs and projectors */}
      <Route path="/display" component={DisplayPage} />

      {/* Catch-all: shown for any URL that doesn't match above */}
      <Route component={NotFound} />
    </Switch>
  );
}

// ---------------------------------------------------------------------------
// App — wraps everything in the necessary providers.
// ---------------------------------------------------------------------------
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/*
          WouterRouter uses BASE_URL (injected by Vite) as the base path.
          The trailing slash is removed because Wouter adds its own separators.
          This ensures the app works whether it is served from "/" or a sub-path.
        */}
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>

        {/* Global toast notification container (top-right corner pop-ups) */}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
