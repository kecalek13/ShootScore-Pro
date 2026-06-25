import React, { useState, useMemo, useRef } from "react";
import { useCompetitionData } from "../hooks/use-competition-data";
import { Layout } from "../components/layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, MonitorPlay, Download, Upload, Printer, Edit2, Trash2, MoreHorizontal } from "lucide-react";
import { Link } from "wouter";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CompetitorDialog } from "../components/competitor-dialog";
import { CompetitionDialog } from "../components/competition-dialog";
import { DeleteConfirmDialog } from "../components/delete-confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "../hooks/use-language";
import { Competitor, Competition } from "../types";

export default function MainPage() {
  const { data, addCompetitor, updateCompetitor, deleteCompetitor, updateScore, addCompetition, updateCompetition, deleteCompetition, importData } = useCompetitionData();
  const { toast } = useToast();
  const { t } = useLanguage();

  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("all");

  const [compDialog, setCompDialog] = useState<{ open: boolean; competitor: Competitor | null }>({ open: false, competitor: null });
  const [colDialog, setColDialog] = useState<{ open: boolean; competition: Competition | null }>({ open: false, competition: null });
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; type: "competitor" | "competition"; id: string; name: string }>({ open: false, type: "competitor", id: "", name: "" });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScoreEdit = (competitorId: string, compId: string, currentScore: number) => {
    const val = window.prompt(t.scorePrompt, currentScore?.toString() || "0");
    if (val !== null) {
      const parsed = parseFloat(val);
      if (!isNaN(parsed)) {
        updateScore(competitorId, compId, parsed);
      }
    }
  };

  const teams = useMemo(() => {
    const t = new Set<string>();
    data.competitors.forEach(c => {
      if (c.teamName) t.add(c.teamName);
    });
    return Array.from(t).sort();
  }, [data.competitors]);

  const competitorsWithTotal = useMemo(() => {
    let filtered = data.competitors;
    if (search) {
      const lower = search.toLowerCase();
      filtered = filtered.filter(c => c.name.toLowerCase().includes(lower) || c.teamName?.toLowerCase().includes(lower));
    }
    if (teamFilter !== "all") {
      filtered = filtered.filter(c => c.teamName === teamFilter);
    }

    return filtered.map(c => {
      const total = Object.values(c.scores || {}).reduce((acc, score) => acc + (score || 0), 0);
      return { ...c, total };
    }).sort((a, b) => b.total - a.total);
  }, [data.competitors, search, teamFilter, data.competitions]);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shooting-competition-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: t.exportSuccess, description: t.exportSuccessDesc });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.competitions && json.competitors) {
          importData(json);
          toast({ title: t.importSuccess, description: t.importSuccessDesc });
        } else {
          throw new Error("Invalid format");
        }
      } catch {
        toast({ title: t.importFailed, description: t.importFailedDesc, variant: "destructive" });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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

  return (
    <Layout>
      <div className="container mx-auto p-4 py-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{t.competitionManagement}</h1>
            <p className="text-muted-foreground mt-1">{t.manageSubtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => setColDialog({ open: true, competition: null })} data-testid="btn-add-competition">
              <Plus className="w-4 h-4 mr-2" /> {t.addCompetition}
            </Button>
            <Button onClick={() => setCompDialog({ open: true, competitor: null })} data-testid="btn-add-competitor">
              <Plus className="w-4 h-4 mr-2" /> {t.addCompetitor}
            </Button>
            <Link href="/display" target="_blank" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-9 px-4 py-2 gap-2">
              <MonitorPlay className="w-4 h-4" />
              {t.displayMode}
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-card p-4 rounded-lg border">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
                data-testid="input-search"
              />
            </div>
            <div className="w-full sm:w-48">
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
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleImport} data-testid="input-file-import" />
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} data-testid="btn-import">
              <Upload className="w-4 h-4 mr-2" /> {t.import}
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport} data-testid="btn-export">
              <Download className="w-4 h-4 mr-2" /> {t.export}
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()} data-testid="btn-print">
              <Printer className="w-4 h-4 mr-2" /> {t.printPdf}
            </Button>
          </div>
        </div>

        <div id="print-area" className="border rounded-lg overflow-x-auto custom-scrollbar bg-card shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted text-muted-foreground sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-4 py-3 font-semibold w-16">{t.rank}</th>
                <th className="px-4 py-3 font-semibold">{t.competitor}</th>
                <th className="px-4 py-3 font-semibold">{t.team}</th>
                {data.competitions.map(comp => (
                  <th key={comp.id} className="px-4 py-3 font-semibold text-center whitespace-nowrap group">
                    <div className="flex items-center justify-center gap-2">
                      {comp.name}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 no-print" data-testid={`btn-comp-menu-${comp.id}`}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center">
                          <DropdownMenuItem onClick={() => setColDialog({ open: true, competition: comp })}>
                            <Edit2 className="h-4 w-4 mr-2" /> {t.editName}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => setDeleteConfirm({ open: true, type: "competition", id: comp.id, name: comp.name })}>
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
              {competitorsWithTotal.map((competitor, idx) => (
                <tr key={competitor.id} className="border-b hover:bg-muted/50 transition-colors group">
                  <td className="px-4 py-3 font-mono font-medium">#{idx + 1}</td>
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{competitor.name}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{competitor.teamName || '-'}</td>
                  {data.competitions.map(comp => (
                    <td
                      key={comp.id}
                      className="px-4 py-3 text-center cursor-pointer hover:bg-primary/10 font-mono transition-colors border-l border-r border-transparent hover:border-border"
                      onClick={() => handleScoreEdit(competitor.id, comp.id, competitor.scores[comp.id])}
                      data-testid={`score-${competitor.id}-${comp.id}`}
                    >
                      {competitor.scores[comp.id] ?? 0}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center font-bold text-primary font-mono bg-primary/5">
                    {competitor.total}
                  </td>
                  <td className="px-4 py-3 text-right no-print">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setCompDialog({ open: true, competitor })} data-testid={`btn-edit-${competitor.id}`}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setDeleteConfirm({ open: true, type: "competitor", id: competitor.id, name: competitor.name })} data-testid={`btn-delete-${competitor.id}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {competitorsWithTotal.length === 0 && (
                <tr>
                  <td colSpan={100} className="px-4 py-8 text-center text-muted-foreground">
                    {t.noCompetitors}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CompetitorDialog
        open={compDialog.open}
        onOpenChange={(open) => setCompDialog({ ...compDialog, open })}
        competitor={compDialog.competitor}
        onSave={(compData) => {
          if (compDialog.competitor) {
            updateCompetitor(compDialog.competitor.id, compData);
            toast({ title: t.competitorUpdated });
          } else {
            addCompetitor(compData);
            toast({ title: t.competitorAdded });
          }
        }}
      />

      <CompetitionDialog
        open={colDialog.open}
        onOpenChange={(open) => setColDialog({ ...colDialog, open })}
        competition={colDialog.competition}
        onSave={(name) => {
          if (colDialog.competition) {
            updateCompetition(colDialog.competition.id, name);
            toast({ title: t.competitionUpdated });
          } else {
            addCompetition(name);
            toast({ title: t.competitionAdded });
          }
        }}
      />

      <DeleteConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ ...deleteConfirm, open })}
        onConfirm={confirmDelete}
        title={deleteConfirm.type === "competitor" ? t.deleteCompetitorTitle : t.deleteCompetitionTitle}
        description={t.deleteDescription(deleteConfirm.name)}
      />
    </Layout>
  );
}
