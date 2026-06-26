/**
 * i18n.ts
 * -------
 * Internationalisation (i18n) module for the app.
 *
 * Supported languages: English ("en") and Czech ("cs").
 * The active language is stored in localStorage and managed via
 * LanguageContext / useLanguage. Every UI string that the user sees
 * should come from the `t` object returned by `useLanguage()`.
 */

/** Union of all supported language codes. */
export type Language = "en" | "cs";

/**
 * Full set of translated strings used throughout the UI.
 * Every key must have a value in BOTH "en" and "cs" objects below.
 */
export interface Translations {
  /** App name shown in the header. */
  appName: string;

  // ── Header buttons ──────────────────────────────────────────────────
  /** Tooltip for the light/dark mode toggle button. */
  toggleTheme: string;
  /** Tooltip / label for the language-switch button. */
  toggleLanguage: string;

  // ── Main page headings ───────────────────────────────────────────────
  /** Page heading on the management screen. */
  competitionManagement: string;
  /** Subtitle / description below the main heading. */
  manageSubtitle: string;

  // ── Main page action buttons ─────────────────────────────────────────
  /** Label for the button that opens the "add competition" dialog. */
  addCompetition: string;
  /** Label for the button that opens the "add competitor" dialog. */
  addCompetitor: string;
  /** Label for the link that opens the fullscreen display page. */
  displayMode: string;
  /** Label for the import-from-JSON button. */
  import: string;
  /** Label for the export-to-JSON button. */
  export: string;
  /** Label for the print/PDF button. */
  printPdf: string;

  // ── Search and filter bar ────────────────────────────────────────────
  /** Placeholder text inside the competitor search input. */
  searchPlaceholder: string;
  /** Default option in the team-filter dropdown ("show all teams"). */
  allTeams: string;

  // ── View-mode toggle ─────────────────────────────────────────────────
  /** Label for the "Individuals" view toggle button. */
  viewIndividuals: string;
  /** Label for the "Teams" view toggle button. */
  viewTeams: string;
  /** Label shown for competitors that have no team assigned. */
  noTeam: string;
  /** Column header for the summed score of a whole team. */
  teamTotal: string;
  /** Unit label showing how many members are in a team. */
  members: string;

  // ── Table column headers ─────────────────────────────────────────────
  /** "Rank" column header. */
  rank: string;
  /** "Competitor name" column header. */
  competitor: string;
  /** "Team" column header. */
  team: string;
  /** "Total score" column header. */
  total: string;
  /** "Actions" column header (edit/delete buttons). */
  actions: string;

  // ── Per-column dropdown menu items ───────────────────────────────────
  /** Menu item to rename a competition column. */
  editName: string;
  /** Menu item to delete a competition column or competitor row. */
  delete: string;

  // ── Empty-state message ──────────────────────────────────────────────
  /** Shown in the table body when no competitors match the current filters. */
  noCompetitors: string;

  // ── Toast notification messages ──────────────────────────────────────
  /** Toast title after a successful JSON export. */
  exportSuccess: string;
  /** Toast body after a successful JSON export. */
  exportSuccessDesc: string;
  /** Toast title after a successful JSON import. */
  importSuccess: string;
  /** Toast body after a successful JSON import. */
  importSuccessDesc: string;
  /** Toast title after a failed JSON import. */
  importFailed: string;
  /** Toast body after a failed JSON import. */
  importFailedDesc: string;
  /** Toast title after a competitor is deleted. */
  competitorDeleted: string;
  /** Toast title after a competition discipline is deleted. */
  competitionDeleted: string;
  /** Toast title after a competitor's details are updated. */
  competitorUpdated: string;
  /** Toast title after a new competitor is added. */
  competitorAdded: string;
  /** Toast title after a competition discipline is renamed. */
  competitionUpdated: string;
  /** Toast title after a new competition discipline is added. */
  competitionAdded: string;

  // ── Delete confirmation dialog ───────────────────────────────────────
  /** Title of the delete dialog when deleting a competitor. */
  deleteCompetitorTitle: string;
  /** Title of the delete dialog when deleting a competition discipline. */
  deleteCompetitionTitle: string;
  /**
   * Body text of the delete confirmation dialog.
   * @param name - The name of the item being deleted (used in the message).
   */
  deleteDescription: (name: string) => string;

  // ── Inline score editing ─────────────────────────────────────────────
  /** Prompt text shown in the browser's native prompt() dialog when editing a score. */
  scorePrompt: string;

  // ── Competitor dialog ────────────────────────────────────────────────
  /** Title of the dialog when editing an existing competitor. */
  editCompetitor: string;
  /** Title of the dialog when creating a new competitor. */
  addCompetitorTitle: string;
  /** Label for the "Name" input field. */
  name: string;
  /** Label for the optional "Team" input field. */
  teamOptional: string;
  /** Label for the Cancel button in dialogs. */
  cancel: string;
  /** Label for the Save button in dialogs. */
  save: string;

  // ── Competition dialog ───────────────────────────────────────────────
  /** Title of the dialog when editing an existing competition discipline. */
  editCompetition: string;
  /** Title of the dialog when creating a new competition discipline. */
  addCompetitionTitle: string;

  // ── Delete confirm button ────────────────────────────────────────────
  /** Label for the destructive "confirm delete" button. */
  confirmDelete: string;

  // ── Display (live scoreboard) page ───────────────────────────────────
  /** Large heading shown on the fullscreen display page. */
  liveRanking: string;
  /** Label for the auto-scroll speed slider. */
  speed: string;
  /** Button label to stop automatic scrolling. */
  stopAuto: string;
  /** Button label to start/resume automatic scrolling. */
  autoScroll: string;
  /** Toast title after the display page URL is copied to clipboard. */
  linkCopied: string;
  /** Toast body after the display page URL is copied to clipboard. */
  linkCopiedDesc: string;
}

/** ── English translations ─────────────────────────────────────────────── */
const en: Translations = {
  appName: "ShootScore Pro",

  toggleTheme: "Toggle theme",
  toggleLanguage: "Switch to Czech",

  competitionManagement: "Competition Management",
  manageSubtitle: "Manage competitors, scores, and exports.",

  addCompetition: "Add Competition",
  addCompetitor: "Add Competitor",
  displayMode: "Display Mode",
  import: "Import",
  export: "Export",
  printPdf: "Print PDF",

  searchPlaceholder: "Search competitors...",
  allTeams: "All Teams",

  viewIndividuals: "Individuals",
  viewTeams: "Teams",
  noTeam: "No Team",
  teamTotal: "Team Total",
  members: "Members",

  rank: "Rank",
  competitor: "Competitor",
  team: "Team",
  total: "Total",
  actions: "Actions",

  editName: "Edit Name",
  delete: "Delete",

  noCompetitors: "No competitors found.",

  exportSuccess: "Export Successful",
  exportSuccessDesc: "Data exported to JSON file.",
  importSuccess: "Import Successful",
  importSuccessDesc: "Data imported successfully.",
  importFailed: "Import Failed",
  importFailedDesc: "The selected file is not a valid competition data file.",
  competitorDeleted: "Competitor Deleted",
  competitionDeleted: "Competition Deleted",
  competitorUpdated: "Competitor Updated",
  competitorAdded: "Competitor Added",
  competitionUpdated: "Competition Updated",
  competitionAdded: "Competition Added",

  deleteCompetitorTitle: "Delete Competitor",
  deleteCompetitionTitle: "Delete Competition",
  deleteDescription: (name) => `Are you sure you want to delete "${name}"? This action cannot be undone.`,

  scorePrompt: "Enter new score:",

  editCompetitor: "Edit Competitor",
  addCompetitorTitle: "Add Competitor",
  name: "Name",
  teamOptional: "Team (Optional)",
  cancel: "Cancel",
  save: "Save",

  editCompetition: "Edit Competition",
  addCompetitionTitle: "Add Competition",

  confirmDelete: "Delete",

  liveRanking: "LIVE RANKING",
  speed: "Speed",
  stopAuto: "Stop Auto",
  autoScroll: "Auto Scroll",
  linkCopied: "Link Copied",
  linkCopiedDesc: "Display URL copied to clipboard.",
};

/** ── Czech translations ───────────────────────────────────────────────── */
const cs: Translations = {
  appName: "ShootScore Pro",

  toggleTheme: "Přepnout motiv",
  toggleLanguage: "Přepnout na angličtinu",

  competitionManagement: "Správa soutěže",
  manageSubtitle: "Spravujte závodníky, skóre a exporty.",

  addCompetition: "Přidat disciplínu",
  addCompetitor: "Přidat závodníka",
  displayMode: "Zobrazení",
  import: "Importovat",
  export: "Exportovat",
  printPdf: "Tisk / PDF",

  searchPlaceholder: "Hledat závodníky...",
  allTeams: "Všechny týmy",

  viewIndividuals: "Jednotlivci",
  viewTeams: "Týmy",
  noTeam: "Bez týmu",
  teamTotal: "Celkem za tým",
  members: "Členové",

  rank: "Pořadí",
  competitor: "Závodník",
  team: "Tým",
  total: "Celkem",
  actions: "Akce",

  editName: "Upravit název",
  delete: "Smazat",

  noCompetitors: "Žádní závodníci nenalezeni.",

  exportSuccess: "Export úspěšný",
  exportSuccessDesc: "Data byla exportována do souboru JSON.",
  importSuccess: "Import úspěšný",
  importSuccessDesc: "Data byla úspěšně importována.",
  importFailed: "Import selhal",
  importFailedDesc: "Vybraný soubor není platný soubor s daty soutěže.",
  competitorDeleted: "Závodník smazán",
  competitionDeleted: "Disciplína smazána",
  competitorUpdated: "Závodník aktualizován",
  competitorAdded: "Závodník přidán",
  competitionUpdated: "Disciplína aktualizována",
  competitionAdded: "Disciplína přidána",

  deleteCompetitorTitle: "Smazat závodníka",
  deleteCompetitionTitle: "Smazat disciplínu",
  deleteDescription: (name) => `Opravdu chcete smazat „${name}"? Tuto akci nelze vrátit zpět.`,

  scorePrompt: "Zadejte nové skóre:",

  editCompetitor: "Upravit závodníka",
  addCompetitorTitle: "Přidat závodníka",
  name: "Jméno",
  teamOptional: "Tým (volitelné)",
  cancel: "Zrušit",
  save: "Uložit",

  editCompetition: "Upravit disciplínu",
  addCompetitionTitle: "Přidat disciplínu",

  confirmDelete: "Smazat",

  liveRanking: "ŽIVÉ POŘADÍ",
  speed: "Rychlost",
  stopAuto: "Zastavit",
  autoScroll: "Auto-scroll",
  linkCopied: "Odkaz zkopírován",
  linkCopiedDesc: "URL pro zobrazení zkopírováno do schránky.",
};

/**
 * Lookup table that maps each supported language code to its translation object.
 * Used by LanguageContext to resolve `t` based on the currently active language.
 *
 * Usage: `translations["en"]` → English strings, `translations["cs"]` → Czech strings.
 */
export const translations: Record<Language, Translations> = { en, cs };
