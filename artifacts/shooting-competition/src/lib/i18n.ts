// =============================================================================
// i18n.ts — Internationalisation (language) support.
//
// The app supports English ("en") and Czech ("cs"). All user-visible strings
// live here — nothing is hard-coded in the components. To add a new language,
// create a new object that satisfies the Translations interface and add it to
// the "translations" export at the bottom.
//
// Usage inside components:
//   const { t } = useLanguage();
//   <Button>{t.save}</Button>
// =============================================================================

/** Supported language codes. Add more here as needed. */
export type Language = "en" | "cs";

/**
 * Every user-visible string the app contains.
 * When you add a new string anywhere in the UI, add its key here first,
 * then provide values in both the "en" and "cs" objects below.
 */
export interface Translations {
  // ── App identity ──────────────────────────────────────────────────────────
  appName: string;

  // ── Header buttons ────────────────────────────────────────────────────────
  toggleTheme: string;    // Tooltip for the dark/light mode button
  toggleLanguage: string; // Tooltip for the language toggle button

  // ── Main page headings ────────────────────────────────────────────────────
  competitionManagement: string; // Page title
  manageSubtitle: string;        // Sub-heading beneath the title

  // ── Main page action buttons ──────────────────────────────────────────────
  addCompetition: string; // Add a new discipline (table column)
  addCompetitor: string;  // Add a new competitor (table row)
  displayMode: string;    // Open the TV/projector display page
  import: string;         // Load data from a JSON file
  export: string;         // Save data to a JSON file
  printPdf: string;       // Print / export as PDF

  // ── Search and filter bar ─────────────────────────────────────────────────
  searchPlaceholder: string; // Placeholder text in the search input
  allTeams: string;          // Default value for the team filter dropdown

  // ── View mode toggle (Individuals vs. Teams) ──────────────────────────────
  viewIndividuals: string; // Label for the "Individuals" view button
  viewTeams: string;       // Label for the "Teams" view button
  noTeam: string;          // Label shown for competitors without a team
  teamTotal: string;       // Column label for the summed team score
  members: string;         // Word used in "N members" inside team rows

  // ── Table column headers ──────────────────────────────────────────────────
  rank: string;       // Position column
  competitor: string; // Competitor name column
  team: string;       // Team name column
  total: string;      // Total score column
  actions: string;    // Edit/delete buttons column

  // ── Discipline column dropdown menu ───────────────────────────────────────
  editName: string; // Rename a competition column
  delete: string;   // Delete a competition column

  // ── Empty state ───────────────────────────────────────────────────────────
  noCompetitors: string; // Shown when the table has no rows

  // ── Toast notification messages ───────────────────────────────────────────
  exportSuccess: string;
  exportSuccessDesc: string;
  importSuccess: string;
  importSuccessDesc: string;
  importFailed: string;
  importFailedDesc: string;
  competitorDeleted: string;
  competitionDeleted: string;
  competitorUpdated: string;
  competitorAdded: string;
  competitionUpdated: string;
  competitionAdded: string;

  // ── Delete confirmation dialog ────────────────────────────────────────────
  deleteCompetitorTitle: string;  // Dialog title when deleting a competitor
  deleteCompetitionTitle: string; // Dialog title when deleting a discipline
  /** Returns the full confirmation sentence with the item's name inserted. */
  deleteDescription: (name: string) => string;

  // ── Inline score editing ──────────────────────────────────────────────────
  scorePrompt: string; // Text shown in the browser's native prompt() dialog

  // ── Competitor add/edit dialog ────────────────────────────────────────────
  editCompetitor: string;    // Dialog title when editing
  addCompetitorTitle: string; // Dialog title when adding
  name: string;              // "Name" field label
  teamOptional: string;      // "Team (optional)" field label
  cancel: string;            // Cancel button
  save: string;              // Save button

  // ── Discipline add/edit dialog ────────────────────────────────────────────
  editCompetition: string;    // Dialog title when editing
  addCompetitionTitle: string; // Dialog title when adding

  // ── Delete confirm dialog ─────────────────────────────────────────────────
  confirmDelete: string; // The destructive "Delete" action button

  // ── Display page (TV / projector mode) ────────────────────────────────────
  liveRanking: string;  // Heading shown on the display page
  speed: string;        // Label next to the autoscroll speed slider
  stopAuto: string;     // Button label when autoscroll is running
  autoScroll: string;   // Button label when autoscroll is paused
  linkCopied: string;   // Toast title after "Copy link" is pressed
  linkCopiedDesc: string; // Toast description after "Copy link" is pressed
}

// =============================================================================
// English translations
// =============================================================================
const en: Translations = {
  appName: "ShootScore Pro",

  toggleTheme:    "Toggle theme",
  toggleLanguage: "Switch to Czech",

  competitionManagement: "Competition Management",
  manageSubtitle:        "Manage competitors, scores, and exports.",

  addCompetition: "Add Competition",
  addCompetitor:  "Add Competitor",
  displayMode:    "Display Mode",
  import:         "Import",
  export:         "Export",
  printPdf:       "Print PDF",

  searchPlaceholder: "Search competitors...",
  allTeams:          "All Teams",

  viewIndividuals: "Individuals",
  viewTeams:       "Teams",
  noTeam:          "No Team",
  teamTotal:       "Team Total",
  members:         "Members",

  rank:       "Rank",
  competitor: "Competitor",
  team:       "Team",
  total:      "Total",
  actions:    "Actions",

  editName: "Edit Name",
  delete:   "Delete",

  noCompetitors: "No competitors found.",

  exportSuccess:     "Export Successful",
  exportSuccessDesc: "Data exported to JSON file.",
  importSuccess:     "Import Successful",
  importSuccessDesc: "Data imported successfully.",
  importFailed:      "Import Failed",
  importFailedDesc:  "The selected file is not a valid competition data file.",
  competitorDeleted:  "Competitor Deleted",
  competitionDeleted: "Competition Deleted",
  competitorUpdated:  "Competitor Updated",
  competitorAdded:    "Competitor Added",
  competitionUpdated: "Competition Updated",
  competitionAdded:   "Competition Added",

  deleteCompetitorTitle:  "Delete Competitor",
  deleteCompetitionTitle: "Delete Competition",
  deleteDescription: (name) =>
    `Are you sure you want to delete "${name}"? This action cannot be undone.`,

  scorePrompt: "Enter new score:",

  editCompetitor:     "Edit Competitor",
  addCompetitorTitle: "Add Competitor",
  name:         "Name",
  teamOptional: "Team (Optional)",
  cancel:       "Cancel",
  save:         "Save",

  editCompetition:     "Edit Competition",
  addCompetitionTitle: "Add Competition",

  confirmDelete: "Delete",

  liveRanking:   "LIVE RANKING",
  speed:         "Speed",
  stopAuto:      "Stop Auto",
  autoScroll:    "Auto Scroll",
  linkCopied:    "Link Copied",
  linkCopiedDesc: "Display URL copied to clipboard.",
};

// =============================================================================
// Czech translations
// =============================================================================
const cs: Translations = {
  appName: "ShootScore Pro",

  toggleTheme:    "Přepnout motiv",
  toggleLanguage: "Přepnout na angličtinu",

  competitionManagement: "Správa soutěže",
  manageSubtitle:        "Spravujte závodníky, skóre a exporty.",

  addCompetition: "Přidat disciplínu",
  addCompetitor:  "Přidat závodníka",
  displayMode:    "Zobrazení",
  import:         "Importovat",
  export:         "Exportovat",
  printPdf:       "Tisk / PDF",

  searchPlaceholder: "Hledat závodníky...",
  allTeams:          "Všechny týmy",

  viewIndividuals: "Jednotlivci",
  viewTeams:       "Týmy",
  noTeam:          "Bez týmu",
  teamTotal:       "Celkem za tým",
  members:         "Členové",

  rank:       "Pořadí",
  competitor: "Závodník",
  team:       "Tým",
  total:      "Celkem",
  actions:    "Akce",

  editName: "Upravit název",
  delete:   "Smazat",

  noCompetitors: "Žádní závodníci nenalezeni.",

  exportSuccess:     "Export úspěšný",
  exportSuccessDesc: "Data byla exportována do souboru JSON.",
  importSuccess:     "Import úspěšný",
  importSuccessDesc: "Data byla úspěšně importována.",
  importFailed:      "Import selhal",
  importFailedDesc:  "Vybraný soubor není platný soubor s daty soutěže.",
  competitorDeleted:  "Závodník smazán",
  competitionDeleted: "Disciplína smazána",
  competitorUpdated:  "Závodník aktualizován",
  competitorAdded:    "Závodník přidán",
  competitionUpdated: "Disciplína aktualizována",
  competitionAdded:   "Disciplína přidána",

  deleteCompetitorTitle:  "Smazat závodníka",
  deleteCompetitionTitle: "Smazat disciplínu",
  deleteDescription: (name) =>
    `Opravdu chcete smazat „${name}"? Tuto akci nelze vrátit zpět.`,

  scorePrompt: "Zadejte nové skóre:",

  editCompetitor:     "Upravit závodníka",
  addCompetitorTitle: "Přidat závodníka",
  name:         "Jméno",
  teamOptional: "Tým (volitelné)",
  cancel:       "Zrušit",
  save:         "Uložit",

  editCompetition:     "Upravit disciplínu",
  addCompetitionTitle: "Přidat disciplínu",

  confirmDelete: "Smazat",

  liveRanking:    "ŽIVÉ POŘADÍ",
  speed:          "Rychlost",
  stopAuto:       "Zastavit",
  autoScroll:     "Auto-scroll",
  linkCopied:     "Odkaz zkopírován",
  linkCopiedDesc: "URL pro zobrazení zkopírováno do schránky.",
};

// Export both language objects keyed by their language code.
// Add new languages here (e.g. de, fr) to extend language support.
export const translations: Record<Language, Translations> = { en, cs };
