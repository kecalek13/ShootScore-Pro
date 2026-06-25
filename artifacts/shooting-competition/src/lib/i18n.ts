export type Language = "en" | "cs";

export interface Translations {
  appName: string;

  // Header
  toggleTheme: string;
  toggleLanguage: string;

  // Main page headings
  competitionManagement: string;
  manageSubtitle: string;

  // Main page buttons
  addCompetition: string;
  addCompetitor: string;
  displayMode: string;
  import: string;
  export: string;
  printPdf: string;

  // Search / filter
  searchPlaceholder: string;
  allTeams: string;

  // View mode toggle
  viewIndividuals: string;
  viewTeams: string;
  noTeam: string;
  teamTotal: string;
  members: string;

  // Table headers
  rank: string;
  competitor: string;
  team: string;
  total: string;
  actions: string;

  // Table column menu
  editName: string;
  delete: string;

  // Empty state
  noCompetitors: string;

  // Toast messages
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

  // Delete dialog (dynamic – use fn)
  deleteCompetitorTitle: string;
  deleteCompetitionTitle: string;
  deleteDescription: (name: string) => string;

  // Inline score prompt
  scorePrompt: string;

  // Competitor dialog
  editCompetitor: string;
  addCompetitorTitle: string;
  name: string;
  teamOptional: string;
  cancel: string;
  save: string;

  // Competition dialog
  editCompetition: string;
  addCompetitionTitle: string;

  // Delete confirm buttons
  confirmDelete: string;

  // Display page
  liveRanking: string;
  speed: string;
  stopAuto: string;
  autoScroll: string;
  linkCopied: string;
  linkCopiedDesc: string;
}

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

export const translations: Record<Language, Translations> = { en, cs };
