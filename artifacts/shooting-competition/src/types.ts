/**
 * types.ts
 * --------
 * Central TypeScript type definitions for the entire app.
 * All data shapes used across components, hooks, and storage are defined here.
 */

/**
 * Represents a single shooting discipline / event category.
 * Examples: "25m Precision", "50m Rapid Fire", "10m Air Rifle".
 */
export interface Competition {
  /** Unique identifier for this competition (UUID string). */
  id: string;
  /** Human-readable name shown in table headers and dialogs. */
  name: string;
}

/**
 * Represents a single participant in the shooting competition.
 * Each competitor has a name, an optional team, and a score for each competition.
 */
export interface Competitor {
  /** Unique identifier for this competitor (UUID string). */
  id: string;
  /** Full display name of the competitor. */
  name: string;
  /** Optional team name — competitors without a team are grouped under "No Team". */
  teamName?: string;
  /**
   * Score map: keys are competition IDs, values are numeric scores.
   * Example: { "comp-1": 95, "comp-2": 88 }
   * A missing key means the competitor hasn't been scored in that competition yet.
   */
  scores: Record<string, number>;
}

/**
 * Top-level state shape of the entire application.
 * This is what gets persisted to and loaded from localStorage.
 */
export interface AppState {
  /** List of all registered competitors. */
  competitors: Competitor[];
  /** List of all registered competition disciplines. */
  competitions: Competition[];
}
