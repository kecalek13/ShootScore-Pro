// =============================================================================
// MainPage.tsx — The primary management screen of the application.
//
// This is where the competition official does all day-to-day work:
//   • Adding, editing, and deleting competitors and shooting disciplines
//   • Entering or adjusting scores by clicking any score cell
//   • Switching between Individuals view and Teams view
//   • Searching by name and filtering by team
//   • Importing / exporting data as JSON
//   • Printing the results as a PDF via the browser's print dialog
//
// All data changes are instantly reflected in the table and auto-saved
// to LocalStorage — no Save button needed.
// =============================================================================

import React, { useState, useMemo, useRef } from "react";
import { useCompetitionData } from "../hooks/use-competition-data";
import { Layout }             from "../components/layout";
import { Input }              from "@/components/ui/input";
import { Button }             from "@/components/ui/button";
import {
  Search, Plus, MonitorPlay, Download, Upload, Printer,
  Edit2, Trash2, MoreHorizontal, User, Users, ChevronDown, ChevronRight,
} from "lucide-react";
import { Link } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CompetitorDialog }    from "../components/competitor-dialog";
import { CompetitionDialog }   from "../components/competition-dialog";
import { DeleteConfirmDialog } from "../components/delete-confirm-dialog";
import { useToast }            from "@/hooks/use-toast";
import { useLanguage }         from "../hooks/use-language";
import { Competitor, Competition } from "../types";
import {
  InputPromptWindow,
  InputPromptSetter
} from "@/components/ui/inputPromptWindow";

// Whether the table shows a flat ranked list or grouped by team.
type ViewMode = "individuals" | "teams";

// =============================================================================
// MainPage component
// =============================================================================
export default function MainPage() {
  // ── Data and i18n ──────────────────────────────────────────────────────────
  const {
    data,
    addCompetitor, updateCompetitor, deleteCompetitor, updateScore,
    addCompetition, updateCompetition, deleteCompetition,
    importData,
  } = useCompetitionData();
  const { toast } = useToast();
  const { t }     = useLanguage();

  // ── UI state ───────────────────────────────────────────────────────────────
  const [search,     setSearch]     = useState("");         // Text in the search box
  const [teamFilter, setTeamFilter] = useState("all");      // Selected team in dropdown
  const [viewMode,   setViewMode]   = useState<ViewMode>("individuals");

  // Tracks which team rows the user has collapsed in the Teams view.
  const [collapsedTeams, setCollapsedTeams] = useState<Set<string>>(new Set());

  // Dialog open/close state and the item being edited (null = add mode).
  const [compDialog,    setCompDialog]    = useState<{ open: boolean; competitor:  Competitor  | null }>({ open: false, competitor:  null });
  const [colDialog,     setColDialog]     = useState<{ open: boolean; competition: Competition | null }>({ open: false, competition: null });
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    type: "competitor" | "competition";
    id: string;
    name: string;
  }>({ open: false, type: "competitor", id: "", name: "" });

  // Hidden file input used to trigger the OS file picker for JSON import.
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Score editing ──────────────────────────────────────────────────────────
  /**
   * Opens the browser's native prompt() dialog when the user clicks a score cell.
   * Simple and works without any extra UI components.
   */
  const handleScoreEdit = async (
    competitorId: string,
    compId: string,
    currentScore: number
  ) => {
    const result = await (window as any).InputPromptSetter(
      competitorId,
      compId,
      currentScore
    );

    if (result === null) return;

    updateScore(competitorId, compId, result);
  };

  // ── Derived data: unique team names for the filter dropdown ────────────────
  const teams = useMemo(() => {
    const s = new Set<string>();
    data.competitors.forEach(c => { if (c.teamName) s.add(c.teamName); });
    return Array.from(s).sort();
  }, [data.competitors]);

  // ── Individuals view: flat sorted list ────────────────────────────────────
  /**
   * Applies search and team-filter, computes each competitor's total score,
   * and sorts the result from best to worst.
   * useMemo prevents recalculation unless the underlying data changes.
   */
  const individualsRanked = useMemo(() => {
    let filtered = data.competitors;

    // Text search: matches competitor name or team name (case-insensitive).
    if (search) {
      const lower = search.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(lower) ||
        c.teamName?.toLowerCase().includes(lower)
      );
    }

    // Team filter dropdown.
    if (teamFilter !== "all") {
      filtered = filtered.filter(c => c.teamName === teamFilter);
    }

    // Add a computed "total" field and sort descending.
    return filtered
      .map(c => {
        const total = Object.values(c.scores || {}).reduce((acc, s) => acc + (s || 0), 0);
        return { ...c, total };
      })
      .sort((a, b) => b.total - a.total);
  }, [data.competitors, search, teamFilter]);

  // ── Teams view: competitors grouped by team ────────────────────────────────
  /**
   * Groups competitors into teams, computes individual and team totals,
   * then sorts teams by their combined score (best team first).
   * Competitors without a team are placed in a group at the end.
   */
  const teamsRanked = useMemo(() => {
    type TeamGroup = {
      key:       string;
      name:      string;
      members:   (Competitor & { total: number })[];
      teamTotal: number;
    };

    const groups = new Map<string, TeamGroup>();

    // Apply search filter before grouping.
    let filtered = data.competitors;
    if (search) {
      const lower = search.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(lower) ||
        c.teamName?.toLowerCase().includes(lower)
      );
    }

    // Build group map, keyed by team name (empty string for "no team").
    filtered.forEach(c => {
      const total = Object.values(c.scores || {}).reduce((acc, s) => acc + (s || 0), 0);
      const key   = c.teamName || "";

      if (!groups.has(key)) {
        groups.set(key, { key, name: c.teamName || "", members: [], teamTotal: 0 });
      }
      groups.get(key)!.members.push({ ...c, total });
    });

    // Sort members within each team and compute team totals.
    groups.forEach(g => {
      g.members.sort((a, b) => b.total - a.total);
      g.teamTotal = g.members.reduce((acc, m) => acc + m.total, 0);
    });

    // Sort teams: named teams first (by score desc), unnamed group last.
    return Array.from(groups.values()).sort((a, b) => {
      if (!a.name && b.name) return 1;
      if (a.name && !b.name) return -1;
      return b.teamTotal - a.teamTotal;
    });
  }, [data.competitors, search]);

  /** Toggle whether a team's member rows are visible in the Teams table. */
  const toggleTeamCollapse = (key: string) => {
    setCollapsedTeams(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else               next.add(key);
      return next;
    });
  };

  // ── Export / Import ────────────────────────────────────────────────────────

  /** Serialises the current app state to a JSON file and triggers a download. */
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `shooting-competition-export-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: t.exportSuccess, description: t.exportSuccessDesc });
  };

  /**
   * Reads the selected JSON file, validates its structure, and imports the data.
   * Rejects files that don't have the expected "competitors" and "competitions" keys.
   */
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.competitions && json.competitors) {
          importData(json);
          toast({ title: t.importSuccess, description: t.importSuccessDesc });
        } else {
          throw new Error("Missing required fields");
        }
      } catch {
        toast({ title: t.importFailed, description: t.importFailedDesc, variant: "destructive" });
      }
    };
    reader.readAsText(file);

    // Reset the file input so the same file can be imported again if needed.
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /** Executes the deletion confirmed by the user in the DeleteConfirmDialog. */
  const confirmDelete = () => {
    if (deleteConfirm.type === "competitor") {
      deleteCompetitor(deleteConfirm.id);
      toast({ title: t.competitorDeleted });
    } else {
      deleteCompetition(deleteConfirm.id);
      toast({ title: t.competitionDeleted });
    }
    setDeleteConfirm({ ...deleteConfirm, open: false });
  };

  // Shorthand alias used in JSX to keep table markup concise.
  const scoreColumns = data.competitions;

  // =============================================================================
  // Render
  // =============================================================================
  return (
    <Layout>
      <InputPromptWindow />
      <div className="container mx-auto p-4 py-8 space-y-6">

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{t.competitionManagement}</h1>
            <p className="text-muted-foreground mt-1">{t.manageSubtitle}</p>
          </div>

          {/* Action buttons: Add Competition, Add Competitor, Display Mode */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setColDialog({ open: true, competition: null })}
              data-testid="btn-add-competition"
            >
              <Plus className="w-4 h-4 mr-2" /> {t.addCompetition}
            </Button>

            <Button
              onClick={() => setCompDialog({ open: true, competitor: null })}
              data-testid="btn-add-competitor"
            >
              <Plus className="w-4 h-4 mr-2" /> {t.addCompetitor}
            </Button>

            {/*
              Opens the Display page in a new tab. We use <Link> with target="_blank"
              so the management page stays open alongside the display view.
            */}
            <Link
              href="/display"
              target="_blank"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-9 px-4 py-2 gap-2"
            >
              <MonitorPlay className="w-4 h-4" />
              {t.displayMode}
            </Link>
          </div>
        </div>

        {/* ── Toolbar: view mode, search, team filter, import/export/print ── */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-card p-4 rounded-lg border">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">

            {/* Individuals / Teams view toggle */}
            <div className="flex rounded-md border overflow-hidden shrink-0">
              <button
                onClick={() => setViewMode("individuals")}
                data-testid="btn-view-individuals"
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${
                  viewMode === "individuals"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                {t.viewIndividuals}
              </button>
              <button
                onClick={() => setViewMode("teams")}
                data-testid="btn-view-teams"
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors border-l ${
                  viewMode === "teams"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                {t.viewTeams}
              </button>
            </div>

            {/* Search input */}
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t.searchPlaceholder}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8"
                data-testid="input-search"
              />
            </div>

            {/*
              Team filter dropdown — only shown in Individuals view.
              In Teams view the grouping already filters by team visually.
            */}
            {viewMode === "individuals" && (
              <div className="w-full sm:w-44">
                <Select value={teamFilter} onValueChange={setTeamFilter}>
                  <SelectTrigger data-testid="select-team-filter">
                    <SelectValue placeholder={t.allTeams} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.allTeams}</SelectItem>
                    {teams.map(team => (
                      <SelectItem key={team} value={team}>{team}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Import, Export, Print buttons */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {/* Hidden file input — triggered programmatically by the Import button */}
            <input
              type="file"
              accept=".json"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImport}
              data-testid="input-file-import"
            />
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} data-testid="btn-import">
              <Upload className="w-4 h-4 mr-2" /> {t.import}
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport} data-testid="btn-export">
              <Download className="w-4 h-4 mr-2" /> {t.export}
            </Button>
            {/* Print uses the browser's native print dialog with @media print CSS */}
            <Button variant="outline" size="sm" onClick={() => window.print()} data-testid="btn-print">
              <Printer className="w-4 h-4 mr-2" /> {t.printPdf}
            </Button>
          </div>
        </div>

        {/* ── Scores table ─────────────────────────────────────────────────── */}
        {/*
          The "print-area" id lets the @media print CSS in index.css scope
          what gets included in the printed / PDF output.
        */}
        <div id="print-area" className="border rounded-lg overflow-x-auto custom-scrollbar bg-card shadow-sm">

          {viewMode === "individuals" ? (

            // ── INDIVIDUALS TABLE ──────────────────────────────────────────
            // One row per competitor, sorted best → worst by total score.
            // Clicking any score cell opens a prompt to change the value.
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted text-muted-foreground sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-4 py-3 font-semibold w-16">{t.rank}</th>
                  <th className="px-4 py-3 font-semibold">{t.competitor}</th>
                  <th className="px-4 py-3 font-semibold">{t.team}</th>

                  {/* One column per shooting discipline */}
                  {scoreColumns.map(comp => (
                    <th key={comp.id} className="px-4 py-3 font-semibold text-center whitespace-nowrap group">
                      <div className="flex items-center justify-center gap-2">
                        {comp.name}
                        {/* Hover menu to rename or delete the discipline */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 no-print"
                              data-testid={`btn-comp-menu-${comp.id}`}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="center">
                            <DropdownMenuItem onClick={() => setColDialog({ open: true, competition: comp })}>
                              <Edit2 className="h-4 w-4 mr-2" /> {t.editName}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setDeleteConfirm({ open: true, type: "competition", id: comp.id, name: comp.name })}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> {t.delete}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </th>
                  ))}

                  <th className="px-4 py-3 font-bold text-center">{t.total}</th>
                  <th className="px-4 py-3 w-16 text-right no-print">{t.actions}</th>
                </tr>
              </thead>

              <tbody>
                {individualsRanked.map((competitor, idx) => (
                  <tr key={competitor.id} className="border-b hover:bg-muted/50 transition-colors group">
                    <td className="px-4 py-3 font-mono font-medium">#{idx + 1}</td>
                    <td className="px-4 py-3 font-medium whitespace-nowrap">{competitor.name}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{competitor.teamName || "-"}</td>

                    {/* Score cells — clickable to edit */}
                    {scoreColumns.map(comp => (
                      <td
                        key={comp.id}
                        className="px-4 py-3 text-center cursor-pointer hover:bg-primary/10 font-mono transition-colors border-l border-r border-transparent hover:border-border"
                        onClick={() => {
                          console.log("Kliknutí")
                          handleScoreEdit(competitor.id, comp.id, competitor.scores[comp.id])}
                        }
                        data-testid={`score-${competitor.id}-${comp.id}`}
                      >
                        {competitor.scores[comp.id] ?? 0}
                      </td>
                    ))}

                    {/* Total score — computed, not editable */}
                    <td className="px-4 py-3 text-center font-bold text-primary font-mono bg-primary/5">
                      {competitor.total}
                    </td>

                    {/* Edit / delete buttons — fade in on row hover */}
                    <td className="px-4 py-3 text-right no-print">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost" size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => setCompDialog({ open: true, competitor })}
                          data-testid={`btn-edit-${competitor.id}`}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost" size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeleteConfirm({ open: true, type: "competitor", id: competitor.id, name: competitor.name })}
                          data-testid={`btn-delete-${competitor.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Empty state */}
                {individualsRanked.length === 0 && (
                  <tr>
                    <td colSpan={100} className="px-4 py-8 text-center text-muted-foreground">
                      {t.noCompetitors}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

          ) : (

            // ── TEAMS TABLE ────────────────────────────────────────────────
            // One highlighted header row per team (ranked by team total),
            // followed by collapsible member rows indented beneath each team.
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted text-muted-foreground sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-4 py-3 font-semibold w-16">{t.rank}</th>
                  <th className="px-4 py-3 font-semibold">{t.team} / {t.competitor}</th>
                  {scoreColumns.map(comp => (
                    <th key={comp.id} className="px-4 py-3 font-semibold text-center whitespace-nowrap">
                      {comp.name}
                    </th>
                  ))}
                  <th className="px-4 py-3 font-bold text-center">{t.total}</th>
                  <th className="px-4 py-3 w-16 text-right no-print">{t.actions}</th>
                </tr>
              </thead>

              <tbody>
                {teamsRanked.map((group, groupIdx) => {
                  const isCollapsed = collapsedTeams.has(group.key);

                  return (
                    <React.Fragment key={group.key}>

                      {/* Team header row — click to collapse/expand members */}
                      <tr
                        className="border-b bg-muted/60 hover:bg-muted/80 cursor-pointer transition-colors"
                        onClick={() => toggleTeamCollapse(group.key)}
                        data-testid={`team-row-${group.key}`}
                      >
                        <td className="px-4 py-3 font-mono font-bold text-primary">
                          {group.name ? `#${groupIdx + 1}` : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 font-semibold">
                            {/* Chevron shows whether members are expanded or collapsed */}
                            {isCollapsed
                              ? <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              : <ChevronDown  className="h-4 w-4 text-muted-foreground" />
                            }
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{group.name || t.noTeam}</span>
                            <span className="text-muted-foreground font-normal text-xs ml-1">
                              ({group.members.length} {t.members})
                            </span>
                          </div>
                        </td>

                        {/* Per-discipline totals for the whole team */}
                        {scoreColumns.map(comp => (
                          <td key={comp.id} className="px-4 py-3 text-center text-muted-foreground text-xs">
                            {group.members.reduce((acc, m) => acc + (m.scores[comp.id] || 0), 0)}
                          </td>
                        ))}

                        {/* Combined team total */}
                        <td className="px-4 py-3 text-center font-bold text-primary font-mono bg-primary/5">
                          {group.teamTotal}
                        </td>
                        <td className="px-4 py-3" />
                      </tr>

                      {/* Member rows — only rendered when the team is not collapsed */}
                      {!isCollapsed && group.members.map((competitor, memberIdx) => (
                        <tr
                          key={competitor.id}
                          className="border-b hover:bg-muted/30 transition-colors group"
                        >
                          {/* Rank within the team (not overall rank) */}
                          <td className="px-4 py-2.5 text-muted-foreground font-mono text-xs pl-8">
                            {memberIdx + 1}.
                          </td>
                          <td className="px-4 py-2.5 pl-10">
                            <div className="flex items-center gap-2">
                              <User className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                              <span className="font-medium">{competitor.name}</span>
                            </div>
                          </td>

                          {/* Individual score cells — clickable to edit */}
                          {scoreColumns.map(comp => (
                            <td
                              key={comp.id}
                              className="px-4 py-2.5 text-center cursor-pointer hover:bg-primary/10 font-mono transition-colors"
                              onClick={() => handleScoreEdit(competitor.id, comp.id, competitor.scores[comp.id])}
                              data-testid={`score-${competitor.id}-${comp.id}`}
                            >
                              {competitor.scores[comp.id] ?? 0}
                            </td>
                          ))}

                          <td className="px-4 py-2.5 text-center font-bold text-primary font-mono bg-primary/5">
                            {competitor.total}
                          </td>

                          <td className="px-4 py-2.5 text-right no-print">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost" size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                onClick={() => setCompDialog({ open: true, competitor })}
                                data-testid={`btn-edit-${competitor.id}`}
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost" size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                onClick={e => {
                                  // stopPropagation prevents the row click (collapse toggle)
                                  // from firing when the delete button is pressed.
                                  e.stopPropagation();
                                  setDeleteConfirm({ open: true, type: "competitor", id: competitor.id, name: competitor.name });
                                }}
                                data-testid={`btn-delete-${competitor.id}`}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}

                {/* Empty state */}
                {teamsRanked.length === 0 && (
                  <tr>
                    <td colSpan={100} className="px-4 py-8 text-center text-muted-foreground">
                      {t.noCompetitors}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Dialogs ────────────────────────────────────────────────────────── */}

      {/* Add / Edit Competitor dialog */}
      <CompetitorDialog
        open={compDialog.open}
        onOpenChange={open => setCompDialog({ ...compDialog, open })}
        competitor={compDialog.competitor}
        onSave={compData => {
          if (compDialog.competitor) {
            updateCompetitor(compDialog.competitor.id, compData);
            toast({ title: t.competitorUpdated });
          } else {
            addCompetitor(compData);
            toast({ title: t.competitorAdded });
          }
        }}
      />

      {/* Add / Edit Competition (discipline) dialog */}
      <CompetitionDialog
        open={colDialog.open}
        onOpenChange={open => setColDialog({ ...colDialog, open })}
        competition={colDialog.competition}
        onSave={name => {
          if (colDialog.competition) {
            updateCompetition(colDialog.competition.id, name);
            toast({ title: t.competitionUpdated });
          } else {
            addCompetition(name);
            toast({ title: t.competitionAdded });
          }
        }}
      />

      {/* Delete confirmation dialog (used for both competitors and competitions) */}
      <DeleteConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={open => setDeleteConfirm({ ...deleteConfirm, open })}
        onConfirm={confirmDelete}
        title={deleteConfirm.type === "competitor" ? t.deleteCompetitorTitle : t.deleteCompetitionTitle}
        description={t.deleteDescription(deleteConfirm.name)}
      />
    </Layout>
  );
}
