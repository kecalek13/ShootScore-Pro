// =============================================================================
// storage.ts — All LocalStorage read/write logic lives here.
//
// The app uses the browser's built-in LocalStorage to persist data without
// needing a server or database. Everything is stored as a single JSON string
// under the key "shooting-competition-data".
//
// Two helper functions are exported:
//   - getStorageData() → reads and returns the current app state
//   - setStorageData() → saves new state and notifies other open tabs
// =============================================================================

import { AppState } from "../types";

// The key used to store data in LocalStorage.
// Changing this would make the app forget all existing data, so don't rename it.
const STORAGE_KEY = "shooting-competition-data";

// ---------------------------------------------------------------------------
// Sample data — pre-loaded on first launch so the app isn't empty.
// Users can delete or overwrite this data at any time.
// ---------------------------------------------------------------------------

const SAMPLE_COMPETITIONS = [
  { id: "comp-1", name: "25m Precision" },
  { id: "comp-2", name: "50m Rapid Fire" },
  { id: "comp-3", name: "10m Air Rifle" },
];

const SAMPLE_COMPETITORS = [
  { id: "1", name: "Sarah Connor",  teamName: "Alpha Squad",  scores: { "comp-1": 95,  "comp-2": 88,  "comp-3": 92 } },
  { id: "2", name: "John Wick",     teamName: "Resistance",   scores: { "comp-1": 85,  "comp-2": 98,  "comp-3": 90 } },
  { id: "3", name: "James Bond",    teamName: "Continental",  scores: { "comp-1": 100, "comp-2": 100, "comp-3": 95 } },
  { id: "4", name: "Ethan Hunt",    teamName: "MI6",          scores: { "comp-1": 92,  "comp-2": 85,  "comp-3": 88 } },
  { id: "5", name: "Jason Bourne",  teamName: "IMF",          scores: { "comp-1": 90,  "comp-2": 91,  "comp-3": 94 } },
  { id: "6", name: "Lara Croft",    teamName: "Tomb Raiders", scores: { "comp-1": 88,  "comp-2": 89,  "comp-3": 97 } },
  { id: "7", name: "Ellen Ripley",  teamName: "Tomb Raiders", scores: { "comp-1": 91,  "comp-2": 93,  "comp-3": 89 } },
  { id: "8", name: "Leon Montana",  teamName: "Alpha Squad",  scores: { "comp-1": 89,  "comp-2": 90,  "comp-3": 91 } },
];

// ---------------------------------------------------------------------------
// getStorageData
//
// Reads the saved app state from LocalStorage.
// - If nothing is saved yet (first launch), seeds the app with sample data.
// - If the stored JSON is corrupt, returns an empty state so the app still works.
// ---------------------------------------------------------------------------
export function getStorageData(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    // First launch — no data yet. Save and return the sample data.
    if (!raw) {
      const defaultState: AppState = {
        competitions: SAMPLE_COMPETITIONS,
        competitors:  SAMPLE_COMPETITORS,
      };
      setStorageData(defaultState);
      return defaultState;
    }

    // Parse and return the saved JSON.
    return JSON.parse(raw) as AppState;
  } catch (err) {
    // If JSON.parse fails (e.g. corrupted data), log the error and return
    // a safe empty state so the app doesn't crash.
    console.error("Failed to parse storage data:", err);
    return { competitions: [], competitors: [] };
  }
}

// ---------------------------------------------------------------------------
// setStorageData
//
// Saves the given app state to LocalStorage as a JSON string.
// Also fires a custom "storage-update" event so that the Display page
// (which may be open in another tab) picks up changes in real time.
// ---------------------------------------------------------------------------
export function setStorageData(data: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  // The browser's built-in "storage" event only fires in *other* tabs,
  // not the same tab that made the change. We fire our own event so the
  // display page on the same tab also refreshes immediately.
  window.dispatchEvent(new Event("storage-update"));
}
