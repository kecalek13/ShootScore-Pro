/**
 * use-competition-data.ts
 * -----------------------
 * Custom React hook that manages the entire competition state:
 * competitors, disciplines, and scores.
 *
 * All data is persisted to localStorage via the storage module.
 * The hook listens for both the native "storage" event (cross-tab changes)
 * and the custom "storage-update" event (same-tab changes), plus a 2-second
 * polling interval as a fallback for the display view which runs in a separate window.
 *
 * Usage:
 *   const { data, addCompetitor, updateScore, ... } = useCompetitionData();
 */

import { useState, useEffect } from "react";
import { AppState, Competition, Competitor } from "../types";
import { getStorageData, setStorageData } from "../lib/storage";

export function useCompetitionData() {
  /**
   * The full app state (competitions + competitors).
   * Initialised by reading from localStorage on mount.
   */
  const [data, setData] = useState<AppState>(getStorageData());

  useEffect(() => {
    /**
     * Re-reads localStorage and updates local React state.
     * Called whenever any storage event fires so all open windows stay in sync.
     */
    const handleStorageChange = () => {
      setData(getStorageData());
    };

    // "storage" fires when ANOTHER tab writes to localStorage.
    window.addEventListener("storage", handleStorageChange);

    // "storage-update" is our custom event fired by setStorageData()
    // so the CURRENT tab also reacts to its own writes.
    window.addEventListener("storage-update", handleStorageChange);

    // Poll every 2 seconds as a safety net for the display page,
    // which might be open in a separate window that misses the events.
    const interval = setInterval(handleStorageChange, 2000);

    // Cleanup: remove listeners and stop polling when this hook unmounts.
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("storage-update", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  /**
   * Writes new state to both React (immediate re-render) and localStorage
   * (persistence + cross-tab broadcast).
   *
   * Every mutating function below calls this helper instead of calling
   * setData and setStorageData separately.
   *
   * @param newData - The complete new AppState to save.
   */
  const updateData = (newData: AppState) => {
    setData(newData);
    setStorageData(newData);
  };

  /**
   * Creates a new competitor and appends them to the list.
   * A fresh UUID is generated for the id, and scores start empty.
   *
   * @param competitor - All competitor fields except id and scores.
   */
  const addCompetitor = (competitor: Omit<Competitor, "id">) => {
    const newCompetitor = { ...competitor, id: crypto.randomUUID(), scores: {} };
    updateData({ ...data, competitors: [...data.competitors, newCompetitor] });
  };

  /**
   * Applies partial updates (name, teamName, scores) to an existing competitor.
   * Unmodified fields are preserved via spread.
   *
   * @param id      - The id of the competitor to update.
   * @param updates - An object with only the fields that should change.
   */
  const updateCompetitor = (id: string, updates: Partial<Competitor>) => {
    updateData({
      ...data,
      competitors: data.competitors.map(c => c.id === id ? { ...c, ...updates } : c)
    });
  };

  /**
   * Removes a competitor from the list by their id.
   *
   * @param id - The id of the competitor to remove.
   */
  const deleteCompetitor = (id: string) => {
    updateData({
      ...data,
      competitors: data.competitors.filter(c => c.id !== id)
    });
  };

  /**
   * Sets or overwrites a competitor's score for a specific competition discipline.
   *
   * @param competitorId  - Which competitor's score to update.
   * @param competitionId - Which competition discipline (column) the score belongs to.
   * @param score         - The new numeric score value.
   */
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

  /**
   * Creates a new competition discipline (table column) with a unique id.
   *
   * @param name - The display name for the new discipline (e.g. "25m Precision").
   */
  const addCompetition = (name: string) => {
    const newCompetition = { id: crypto.randomUUID(), name };
    updateData({ ...data, competitions: [...data.competitions, newCompetition] });
  };

  /**
   * Renames an existing competition discipline.
   *
   * @param id   - The id of the competition to rename.
   * @param name - The new display name.
   */
  const updateCompetition = (id: string, name: string) => {
    updateData({
      ...data,
      competitions: data.competitions.map(c => c.id === id ? { ...c, name } : c)
    });
  };

  /**
   * Deletes a competition discipline AND removes its scores from every competitor.
   * This keeps the data consistent — no orphaned score keys remain.
   *
   * @param id - The id of the competition discipline to delete.
   */
  const deleteCompetition = (id: string) => {
    updateData({
      ...data,
      // Remove the competition from the list.
      competitions: data.competitions.filter(c => c.id !== id),
      // Remove the deleted competition's score entry from every competitor.
      competitors: data.competitors.map(c => {
        const newScores = { ...c.scores };
        delete newScores[id]; // Remove the score for this competition.
        return { ...c, scores: newScores };
      })
    });
  };

  /**
   * Replaces the entire app state with data imported from a JSON file.
   * Used by the Import button on the main page.
   *
   * @param importedData - The full AppState parsed from the uploaded JSON file.
   */
  const importData = (importedData: AppState) => {
    updateData(importedData);
  };

  // Expose the current state and all mutation functions to consuming components.
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
