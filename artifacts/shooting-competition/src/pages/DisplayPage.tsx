import React, { useEffect, useState, useRef } from "react";
import { useCompetitionData } from "../hooks/use-competition-data";
import { useLanguage } from "../context/language-context";
import { Maximize, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

export default function DisplayPage() {
  const { data } = useCompetitionData();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [autoScroll, setAutoScroll] = useState(true);
  const [scrollSpeed, setScrollSpeed] = useState(2);
  const containerRef = useRef<HTMLDivElement>(null);

  const competitorsWithTotal = React.useMemo(() => {
    return data.competitors.map(c => {
      const total = Object.values(c.scores || {}).reduce((acc, score) => acc + (score || 0), 0);
      return { ...c, total };
    }).sort((a, b) => b.total - a.total);
  }, [data.competitors, data.competitions]);

  useEffect(() => {
    if (!autoScroll) return;

    let animationId: number;
    let scrollPos = 0;

    const scroll = () => {
      if (containerRef.current) {
        scrollPos += (scrollSpeed * 0.5);
        if (scrollPos >= containerRef.current.scrollHeight - containerRef.current.clientHeight) {
          scrollPos = 0;
        }
        containerRef.current.scrollTop = scrollPos;
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
    toast({
      title: t.linkCopied,
      description: t.linkCopiedDesc,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col overflow-hidden font-sans">
      <div className="absolute top-0 w-full p-4 flex justify-between opacity-20 hover:opacity-100 transition-opacity z-50 bg-gradient-to-b from-black/80 to-transparent">
        <h1 className="text-2xl font-bold tracking-tight text-white/90">{t.liveRanking}</h1>
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

      <div className="flex-1 overflow-hidden relative pt-20" ref={containerRef}>
        <div className="container mx-auto px-8 pb-32">
          <div className="grid gap-4">
            <div className="grid grid-cols-12 gap-4 text-white/50 font-bold uppercase tracking-wider text-xl mb-4 px-6">
              <div className="col-span-2">{t.rank}</div>
              <div className="col-span-5">{t.competitor}</div>
              <div className="col-span-3">{t.team}</div>
              <div className="col-span-2 text-right">{t.total}</div>
            </div>

            {competitorsWithTotal.map((competitor, idx) => {
              const isGold = idx === 0;
              const isSilver = idx === 1;
              const isBronze = idx === 2;

              return (
                <div
                  key={competitor.id}
                  className={`grid grid-cols-12 gap-4 items-center p-6 rounded-xl text-3xl font-medium transition-all ${
                    isGold ? 'bg-gradient-to-r from-yellow-500/20 to-black border border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.2)]' :
                    isSilver ? 'bg-gradient-to-r from-slate-400/20 to-black border border-slate-400/50' :
                    isBronze ? 'bg-gradient-to-r from-amber-700/20 to-black border border-amber-700/50' :
                    'bg-white/5 border border-white/10'
                  }`}
                >
                  <div className={`col-span-2 font-mono font-bold text-4xl ${
                    isGold ? 'text-yellow-400' :
                    isSilver ? 'text-slate-300' :
                    isBronze ? 'text-amber-600' :
                    'text-white/40'
                  }`}>
                    #{idx + 1}
                  </div>
                  <div className="col-span-5 truncate">{competitor.name}</div>
                  <div className="col-span-3 truncate text-white/50 text-2xl">{competitor.teamName || '-'}</div>
                  <div className={`col-span-2 text-right font-mono font-bold text-5xl ${
                    isGold ? 'text-yellow-400' :
                    isSilver ? 'text-slate-300' :
                    isBronze ? 'text-amber-600' :
                    'text-white'
                  }`}>
                    {competitor.total}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
