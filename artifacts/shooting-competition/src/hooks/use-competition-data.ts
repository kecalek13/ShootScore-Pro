// =============================================================================
// use-competition-data.ts — The central data hook for the application.
//
// This hook owns all state (competitors + competitions) and exposes every
// operation that modifies that state: add, update, delete, import, and score
// changes. Any component that needs to read or change data should use this hook.
//
// Data flow:
//   1. On mount, state is loaded from LocalStorage via getStorageData().
//   2. Every mutation saves back to LocalStorage via setStorageData().
//   3. The hook listens for "storage" (other tabs) and "storage-update"
//      (same tab, fired by setStorageData) events so the Display page
//      stays live without the user having to refresh.
//   4. A 2-second polling interval acts as a safety net for cases where
//      events are missed (e.g. the display page opened in a different window).
// =============================================================================

import { useState, useEffect } from "react";
import { AppState, Competition, Competitor } from "../types";
import { getStorageData, setStorageData } from "../lib/storage";

export function useCompetitionData() {
  // Load the initial state from LocalStorage when the hook first runs.
  const [data, setData] = useState<AppState>(getStorageData);

  // ── Live sync ────────────────────────────────────────────────────────────
  // Keep the Display page in sync with the Management page even when they
  // are open in separate tabs or browser windows.
  useEffect(() => {
    const refresh = () => setData(getStorageData());

    // "storage" fires in other browser tabs when LocalStorage changes.
    window.addEventListener("storage", refresh);

    // "storage-update" is our own custom event fired in the same tab
    // (the native "storage" event does NOT fire in the tab that made the change).
    window.addEventListener("storage-update", refresh);

    // Poll every 2 seconds as a reliable fallback (e.g. separate windows).
    const interval = setInterval(refresh, 2000);

    // Clean up listeners and timer when the component unmounts.
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("storage-update", refresh);
      clearInterval(interval);
    };
  }, []);

  // ── Internal helper ───────────────────────────────────────────────────────
  // All mutations go through this single function so they always update both
  // the React state (causes a re-render) and LocalStorage (persists data).
  const updateData = (newData: AppState) => {
    setData(newData);
    setStorageData(newData);
  };

  // ── Competitor operations ─────────────────────────────────────────────────

  /** Add a new competitor with no scores yet. */
  const addCompetitor = (competitor: Omit<Competitor, "id" | "scores">) => {
    const newCompetitor: Competitor = {
      ...competitor,
      id: crypto.randomUUID(), // Guaranteed unique ID
      scores: {},              // Empty — scores are entered separately
    };
    updateData({ ...data, competitors: [...data.competitors, newCompetitor] });
  };

  /** Update an existing competitor's name or team. */
  const updateCompetitor = (id: string, updates: Partial<Competitor>) => {
    updateData({
      ...data,
      competitors: data.competitors.map(c =>
        c.id === id ? { ...c, ...updates } : c
      ),
    });
  };

  /** Permanently remove a competitor and all their scores. */
  const deleteCompetitor = (id: string) => {
    updateData({
      ...data,
      competitors: data.competitors.filter(c => c.id !== id),
    });
  };

  /**
   * Update a single score for one competitor in one competition.
   * Uses a nested spread to keep the rest of the scores untouched.
   */
  const updateScore = (competitorId: string, competitionId: string, score: number) => {
    updateData({
      ...data,
      competitors: data.competitors.map(c =>
        c.id === competitorId
          ? { ...c, scores: { ...c.scores, [competitionId]: score } }
          : c
      ),
    });
  };

  // ── Competition (discipline) operations ──────────────────────────────────

  /** Add a new shooting discipline (adds a new column to the scores table). */
  const addCompetition = (name: string) => {
    const newCompetition: Competition = { id: crypto.randomUUID(), name };
    updateData({ ...data, competitions: [...data.competitions, newCompetition] });
  };

  /** Rename an existing competition. */
  const updateCompetition = (id: string, name: string) => {
    updateData({
      ...data,
      competitions: data.competitions.map(c =>
        c.id === id ? { ...c, name } : c
      ),
    });
  };

  /**
   * Delete a competition and remove all scores for that competition
   * from every competitor, keeping the score dictionaries consistent.
   */
  const deleteCompetition = (id: string) => {
    updateData({
      ...data,
      competitions: data.competitions.filter(c => c.id !== id),
      competitors: data.competitors.map(c => {
        const newScores = { ...c.scores };
        delete newScores[id]; // Remove the score entry for the deleted discipline
        return { ...c, scores: newScores };
      }),
    });
  };

  /** Replace all data with an imported JSON structure. */
  const importData = (importedData: AppState) => {
    updateData(importedData);
  };

  // Return all data and every available operation.
  return {
    data,
    addCompetitor,
    updateCompetitor,
    deleteCompetitor,
    updateScore,
    addCompetition,
    updateCompetition,
    deleteCompetition,
    importData,
  };
}
