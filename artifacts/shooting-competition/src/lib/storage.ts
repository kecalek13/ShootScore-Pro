/**
 * storage.ts
 * ----------
 * Handles reading and writing the entire app state to the browser's localStorage.
 * Also fires a custom "storage-update" event so other open tabs/windows
 * (like the display screen) can react to changes in real time.
 */

import { AppState } from "../types";

/** The localStorage key under which all competition data is stored. */
const STORAGE_KEY = "shooting-competition-data";

/**
 * Sample competition disciplines pre-loaded on first launch.
 * These give new users something to work with right away.
 */
const SAMPLE_COMPETITIONS = [
  { id: "comp-1", name: "25m Precision" },
  { id: "comp-2", name: "50m Rapid Fire" },
  { id: "comp-3", name: "10m Air Rifle" },
];

/**
 * Sample competitors pre-loaded on first launch.
 * Each competitor has a name, an optional team, and pre-filled scores
 * for every sample competition above.
 */
const SAMPLE_COMPETITORS = [
  { id: "1", name: "Sarah Connor",  teamName: "Alpha Squad",   scores: { "comp-1": 95,  "comp-2": 88,  "comp-3": 92 } },
  { id: "2", name: "John Wick",     teamName: "Resistance",    scores: { "comp-1": 85,  "comp-2": 98,  "comp-3": 90 } },
  { id: "3", name: "James Bond",    teamName: "Continental",   scores: { "comp-1": 100, "comp-2": 100, "comp-3": 95 } },
  { id: "4", name: "Ethan Hunt",    teamName: "MI6",           scores: { "comp-1": 92,  "comp-2": 85,  "comp-3": 88 } },
  { id: "5", name: "Jason Bourne",  teamName: "IMF",           scores: { "comp-1": 90,  "comp-2": 91,  "comp-3": 94 } },
  { id: "6", name: "Lara Croft",    teamName: "Tomb Raiders",  scores: { "comp-1": 88,  "comp-2": 89,  "comp-3": 97 } },
  { id: "7", name: "Ellen Ripley",  teamName: "Tomb Raiders",  scores: { "comp-1": 91,  "comp-2": 93,  "comp-3": 89 } },
  { id: "8", name: "Leon Montana",  teamName: "Alpha Squad",   scores: { "comp-1": 89,  "comp-2": 90,  "comp-3": 91 } },
];

/**
 * Reads the current app state from localStorage.
 *
 * - If no data exists yet (first visit), seeds localStorage with the sample
 *   data and returns it so the UI is never empty on first load.
 * - If the stored JSON is corrupted or unparseable, logs an error and returns
 *   an empty state (no competitors, no competitions) to avoid crashing the app.
 *
 * @returns The current AppState (competitors + competitions).
 */
export function getStorageData(): AppState {
  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      // First-time visit: seed with demo data and save it immediately.
      const defaultState = {
        competitions: SAMPLE_COMPETITIONS,
        competitors: SAMPLE_COMPETITORS,
      };
      setStorageData(defaultState);
      return defaultState;
    }

    // Parse and return the stored JSON.
    return JSON.parse(data);
  } catch (e) {
    // Parsing failed — log the error and return a safe empty state.
    console.error("Failed to parse storage data", e);
    return { competitions: [], competitors: [] };
  }
}

/**
 * Persists the given app state to localStorage and notifies other
 * tabs/windows by dispatching a custom "storage-update" event.
 *
 * The built-in "storage" event only fires in OTHER tabs, not the current one.
 * The custom "storage-update" event covers the current tab so the display
 * page (opened via "Display Mode") also receives live updates.
 *
 * @param data - The full AppState object to save.
 */
export function setStorageData(data: AppState) {
  // Serialize and write the entire app state to localStorage.
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  // Dispatch a custom event so the same tab (e.g. the display window)
  // can listen and re-render with the latest data.
  window.dispatchEvent(new Event('storage-update'));
}
