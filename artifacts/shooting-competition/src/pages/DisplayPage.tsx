import React, { useEffect, useState, useRef, useMemo } from "react";
import { useCompetitionData } from "../hooks/use-competition-data";
import { useLanguage } from "../hooks/use-language";
import { Maximize, Share2, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Competitor } from "../types";

type ViewMode = "individuals" | "teams";

type CompetitorWithTotal = Competitor & { total: number };

interface TeamGroup {
  key: string;
  name: string;
  members: CompetitorWithTotal[];
  teamTotal: number;
}

export default function DisplayPage() {
  const { data } = useCompetitionData();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [autoScroll, setAutoScroll] = useState(true);
  const [scrollSpeed, setScrollSpeed] = useState(2);
  const [viewMode, setViewMode] = useState<ViewMode>("individuals");
  const containerRef = useRef<HTMLDivElement>(null);

  // Individuals: flat sorted list
  const individualsRanking = useMemo<CompetitorWithTotal[]>(() => {
    return data.competitors.map(c => {
      const total = Object.values(c.scores || {}).reduce((acc, s) => acc + (s || 0), 0);
      return { ...c, total };
    }).sort((a, b) => b.total - a.total);
  }, [data.competitors, data.competitions]);

  // Teams: grouped by team, sorted by team total
  const teamsRanking = useMemo<TeamGroup[]>(() => {
    const groups = new Map<string, TeamGroup>();

    data.competitors.forEach(c => {
      const total = Object.values(c.scores || {}).reduce((acc, s) => acc + (s || 0), 0);
      const key = c.teamName || "";
      if (!groups.has(key)) {
        groups.set(key, { key, name: c.teamName || "", members: [], teamTotal: 0 });
      }
      groups.get(key)!.members.push({ ...c, total });
    });

    groups.forEach(g => {
      g.members.sort((a, b) => b.total - a.total);
      g.teamTotal = g.members.reduce((acc, m) => acc + m.total, 0);
    });

    return Array.from(groups.values()).sort((a, b) => {
      if (!a.name && b.name) return 1;
      if (a.name && !b.name) return -1;
      return b.teamTotal - a.teamTotal;
    });
  }, [data.competitors]);

  // Autoscroll
  useEffect(() => {
    if (!autoScroll) return;

    let animationId: number;
    let lastTime: number | null = null;

    const scroll = (timestamp: number) => {
      if (containerRef.current) {
        if (lastTime !== null) {
          const delta = timestamp - lastTime;
          containerRef.current.scrollTop += (scrollSpeed * delta) / 16;

          const maxScroll = containerRef.current.scrollHeight - containerRef.current.clientHeight;
          if (containerRef.current.scrollTop >= maxScroll) {
            containerRef.current.scrollTop = 0;
          }
        }
        lastTime = timestamp;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [autoScroll, scrollSpeed]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const shareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: t.linkCopied, description: t.linkCopiedDesc });
  };

  const medalClass = (idx: number) =>
    idx === 0 ? "text-yellow-400" :
    idx === 1 ? "text-slate-300" :
    idx === 2 ? "text-amber-600" :
    "text-white/40";

  const cardClass = (idx: number) =>
    idx === 0 ? "bg-gradient-to-r from-yellow-500/20 to-black border border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.2)]" :
    idx === 1 ? "bg-gradient-to-r from-slate-400/20 to-black border border-slate-400/50" :
    idx === 2 ? "bg-gradient-to-r from-amber-700/20 to-black border border-amber-700/50" :
    "bg-white/5 border border-white/10";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col overflow-hidden font-sans">
      {/* Control overlay */}
      <div className="absolute top-0 w-full p-4 flex justify-between opacity-20 hover:opacity-100 transition-opacity z-50 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-white/90">{t.liveRanking}</h1>
          {/* Mode toggle */}
          <div className="flex rounded-md overflow-hidden border border-white/20">
            <button
              onClick={() => setViewMode("individuals")}
              data-testid="btn-display-individuals"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${viewMode === "individuals" ? "bg-white text-black" : "text-white/70 hover:text-white hover:bg-white/10"}`}
            >
              <User className="w-3 h-3" />
              {t.viewIndividuals}
            </button>
            <button
              onClick={() => setViewMode("teams")}
              data-testid="btn-display-teams"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors border-l border-white/20 ${viewMode === "teams" ? "bg-white text-black" : "text-white/70 hover:text-white hover:bg-white/10"}`}
            >
              <Users className="w-3 h-3" />
              {t.viewTeams}
            </button>
          </div>
        </div>

        <div className="flex gap-4 items-center bg-black/50 p-2 rounded-lg backdrop-blur">
          <div className="flex items-center gap-2 w-32">
            <span className="text-xs text-white/70 uppercase">{t.speed}</span>
            <Slider
              value={[scrollSpeed]}
              min={0.5} max={5} step={0.5}
              onValueChange={(v) => setScrollSpeed(v[0])}
            />
          </div>
          <Button variant="ghost" size="sm" onClick={() => setAutoScroll(!autoScroll)} className="text-white hover:text-white hover:bg-white/20">
            {autoScroll ? t.stopAuto : t.autoScroll}
          </Button>
          <Button variant="ghost" size="icon" onClick={shareLink} className="text-white hover:text-white hover:bg-white/20">
            <Share2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:text-white hover:bg-white/20">
            <Maximize className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto relative pt-20" ref={containerRef}>
        <div className="container mx-auto px-8 pb-32">

          {viewMode === "individuals" ? (
            /* ── INDIVIDUALS DISPLAY ── */
            <div className="grid gap-4">
              <div className="grid grid-cols-12 gap-4 text-white/50 font-bold uppercase tracking-wider text-xl mb-4 px-6">
                <div className="col-span-2">{t.rank}</div>
                <div className="col-span-5">{t.competitor}</div>
                <div className="col-span-3">{t.team}</div>
                <div className="col-span-2 text-right">{t.total}</div>
              </div>

              {individualsRanking.map((competitor, idx) => (
                <div
                  key={competitor.id}
                  className={`grid grid-cols-12 gap-4 items-center p-6 rounded-xl text-3xl font-medium transition-all ${cardClass(idx)}`}
                >
                  <div className={`col-span-2 font-mono font-bold text-4xl ${medalClass(idx)}`}>
                    #{idx + 1}
                  </div>
                  <div className="col-span-5 truncate">{competitor.name}</div>
                  <div className="col-span-3 truncate text-white/50 text-2xl">{competitor.teamName || '-'}</div>
                  <div className={`col-span-2 text-right font-mono font-bold text-5xl ${idx < 3 ? medalClass(idx) : "text-white"}`}>
                    {competitor.total}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ── TEAMS DISPLAY ── */
            <div className="grid gap-6">
              <div className="grid grid-cols-12 gap-4 text-white/50 font-bold uppercase tracking-wider text-xl mb-4 px-6">
                <div className="col-span-2">{t.rank}</div>
                <div className="col-span-7">{t.team} / {t.competitor}</div>
                <div className="col-span-3 text-right">{t.total}</div>
              </div>

              {teamsRanking.map((group, groupIdx) => (
                <div key={group.key} className={`rounded-xl overflow-hidden border ${
                  groupIdx === 0 ? "border-yellow-500/50 shadow-[0_0_40px_rgba(234,179,8,0.15)]" :
                  groupIdx === 1 ? "border-slate-400/40" :
                  groupIdx === 2 ? "border-amber-700/40" :
                  "border-white/10"
                }`}>
                  {/* Team header */}
                  <div className={`grid grid-cols-12 gap-4 items-center px-6 py-5 ${
                    groupIdx === 0 ? "bg-gradient-to-r from-yellow-500/25 to-black/60" :
                    groupIdx === 1 ? "bg-gradient-to-r from-slate-400/20 to-black/60" :
                    groupIdx === 2 ? "bg-gradient-to-r from-amber-700/20 to-black/60" :
                    "bg-white/8"
                  }`}>
                    <div className={`col-span-2 font-mono font-bold text-4xl ${group.name ? medalClass(groupIdx) : "text-white/20"}`}>
                      {group.name ? `#${groupIdx + 1}` : "—"}
                    </div>
                    <div className="col-span-7 flex items-center gap-3 text-3xl font-bold truncate">
                      <Users className={`w-7 h-7 shrink-0 ${group.name ? medalClass(groupIdx) : "text-white/30"}`} />
                      {group.name || t.noTeam}
                      <span className="text-white/30 text-xl font-normal ml-1">({group.members.length})</span>
                    </div>
                    <div className={`col-span-3 text-right font-mono font-bold text-5xl ${groupIdx < 3 && group.name ? medalClass(groupIdx) : "text-white"}`}>
                      {group.teamTotal}
                    </div>
                  </div>

                  {/* Members */}
                  <div className="divide-y divide-white/5 bg-black/40">
                    {group.members.map((competitor, memberIdx) => (
                      <div
                        key={competitor.id}
                        className="grid grid-cols-12 gap-4 items-center px-6 py-4 text-2xl"
                      >
                        <div className="col-span-2 font-mono text-white/30 text-xl pl-6">
                          {memberIdx + 1}.
                        </div>
                        <div className="col-span-7 truncate text-white/80 pl-2">
                          {competitor.name}
                        </div>
                        <div className="col-span-3 text-right font-mono font-semibold text-white/90">
                          {competitor.total}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
