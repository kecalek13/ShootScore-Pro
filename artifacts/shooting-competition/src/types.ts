// =============================================================================
// types.ts — Shared TypeScript types used across the entire application.
//
// Every piece of data the app works with is described here. If you want to
// understand the shape of the data, this is the first file to read.
// =============================================================================

/**
 * A single shooting discipline (column in the scores table).
 * Example: { id: "abc-123", name: "25m Precision" }
 */
export interface Competition {
  id: string;   // Unique identifier (generated with crypto.randomUUID)
  name: string; // Human-readable name shown in the table header
}

/**
 * A single person who participates in the competition.
 * Scores are stored as a dictionary: { competitionId -> numeric score }
 * so adding or removing competitions never breaks existing score data.
 */
export interface Competitor {
  id: string;         // Unique identifier (generated with crypto.randomUUID)
  name: string;       // Full name of the competitor
  teamName?: string;  // Optional team the competitor belongs to
  scores: Record<string, number>; // Maps competition ID → score value
}

/**
 * The root data structure saved to (and loaded from) LocalStorage.
 * Everything the app needs lives inside this object.
 */
export interface AppState {
  competitors: Competitor[];   // All registered competitors
  competitions: Competition[]; // All registered shooting disciplines
}
