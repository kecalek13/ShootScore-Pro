import { AppState } from "../types";

const STORAGE_KEY = "shooting-competition-data";

const SAMPLE_COMPETITIONS = [
  { id: "comp-1", name: "25m Precision" },
  { id: "comp-2", name: "50m Rapid Fire" },
  { id: "comp-3", name: "10m Air Rifle" },
];

const SAMPLE_COMPETITORS = [
  { id: "1", name: "Sarah Connor", teamName: "Alpha Squad", scores: { "comp-1": 95, "comp-2": 88, "comp-3": 92 } },
  { id: "2", name: "John Wick", teamName: "Resistance", scores: { "comp-1": 85, "comp-2": 98, "comp-3": 90 } },
  { id: "3", name: "James Bond", teamName: "Continental", scores: { "comp-1": 100, "comp-2": 100, "comp-3": 95 } },
  { id: "4", name: "Ethan Hunt", teamName: "MI6", scores: { "comp-1": 92, "comp-2": 85, "comp-3": 88 } },
  { id: "5", name: "Jason Bourne", teamName: "IMF", scores: { "comp-1": 90, "comp-2": 91, "comp-3": 94 } },
  { id: "6", name: "Lara Croft", teamName: "Tomb Raiders", scores: { "comp-1": 88, "comp-2": 89, "comp-3": 97 } },
  { id: "7", name: "Ellen Ripley", teamName: "Tomb Raiders", scores: { "comp-1": 91, "comp-2": 93, "comp-3": 89 } },
  { id: "8", name: "Leon Montana", teamName: "Alpha Squad", scores: { "comp-1": 89, "comp-2": 90, "comp-3": 91 } },
];

export function getStorageData(): AppState {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      const defaultState = {
        competitions: SAMPLE_COMPETITIONS,
        competitors: SAMPLE_COMPETITORS,
      };
      setStorageData(defaultState);
      return defaultState;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse storage data", e);
    return { competitions: [], competitors: [] };
  }
}

export function setStorageData(data: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  // Dispatch a custom event for other tabs/windows
  window.dispatchEvent(new Event('storage-update'));
}
