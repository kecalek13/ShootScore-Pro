import { useState, useEffect } from "react";
import { AppState, Competition, Competitor } from "../types";
import { getStorageData, setStorageData } from "../lib/storage";

export function useCompetitionData() {
  const [data, setData] = useState<AppState>(getStorageData());

  useEffect(() => {
    const handleStorageChange = () => {
      setData(getStorageData());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("storage-update", handleStorageChange);
    
    // Polling as a fallback for the display view
    const interval = setInterval(handleStorageChange, 2000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("storage-update", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const updateData = (newData: AppState) => {
    setData(newData);
    setStorageData(newData);
  };

  const addCompetitor = (competitor: Omit<Competitor, "id">) => {
    const newCompetitor = { ...competitor, id: crypto.randomUUID(), scores: {} };
    updateData({ ...data, competitors: [...data.competitors, newCompetitor] });
  };

  const updateCompetitor = (id: string, updates: Partial<Competitor>) => {
    updateData({
      ...data,
      competitors: data.competitors.map(c => c.id === id ? { ...c, ...updates } : c)
    });
  };

  const deleteCompetitor = (id: string) => {
    updateData({
      ...data,
      competitors: data.competitors.filter(c => c.id !== id)
    });
  };

  const updateScore = (competitorId: string, competitionId: string, score: number) => {
    updateData({
      ...data,
      competitors: data.competitors.map(c => 
        c.id === competitorId 
          ? { ...c, scores: { ...c.scores, [competitionId]: score } }
          : c
      )
    });
  };

  const addCompetition = (name: string) => {
    const newCompetition = { id: crypto.randomUUID(), name };
    updateData({ ...data, competitions: [...data.competitions, newCompetition] });
  };

  const updateCompetition = (id: string, name: string) => {
    updateData({
      ...data,
      competitions: data.competitions.map(c => c.id === id ? { ...c, name } : c)
    });
  };

  const deleteCompetition = (id: string) => {
    updateData({
      ...data,
      competitions: data.competitions.filter(c => c.id !== id),
      competitors: data.competitors.map(c => {
        const newScores = { ...c.scores };
        delete newScores[id];
        return { ...c, scores: newScores };
      })
    });
  };

  const importData = (importedData: AppState) => {
    updateData(importedData);
  };

  return {
    data,
    addCompetitor,
    updateCompetitor,
    deleteCompetitor,
    updateScore,
    addCompetition,
    updateCompetition,
    deleteCompetition,
    importData
  };
}
