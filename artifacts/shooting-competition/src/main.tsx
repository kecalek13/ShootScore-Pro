// =============================================================================
// main.tsx — Application entry point.
//
// This is the very first file executed by the browser. It:
//   1. Imports global styles (Tailwind CSS + custom theme variables)
//   2. Wraps the app in <LanguageProvider> so every component can access
//      the translation strings and the language toggle.
//   3. Mounts the React app into the <div id="root"> element in index.html.
// =============================================================================

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { LanguageProvider } from "./context/language-context";

// Mount the app.
// <LanguageProvider> sits at the very top so the language context is available
// to every component in the tree, including those inside <App>.
createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <App />
  </LanguageProvider>
);
