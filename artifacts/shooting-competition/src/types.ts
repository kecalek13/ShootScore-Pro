export interface Competition {
  id: string;
  name: string;
}

export interface Competitor {
  id: string;
  name: string;
  teamName?: string;
  scores: Record<string, number>; // competitionId -> score
}

export interface AppState {
  competitors: Competitor[];
  competitions: Competition[];
}
