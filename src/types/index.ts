export interface Race {
  id: number;
  banner_id: number;
  race_id: number;
  name_en: string;
  name_jp: string;
  name_ko: string;
  name_tw: string;
  grade: 100 | 200 | 300 | 400 | 700;
  terrain: 1 | 2;
  direction: 1 | 2 | 4;
  distance: number;
  entries: number;
  group: number;
  season: number;
  time: number;
  track: number;
  course: number;
  course_id: number;
  factor: {
    effect_1: string;
    effect_2: StatType;
  };
  list_ura: string[];
  url_name: string;
}

export type StatType = 'speed' | 'stamina' | 'power' | 'guts' | 'wisdom';

export interface TurnRace {
  race: Race;
  uraId: string;
  year: number;
}

export interface Turn {
  year: 1 | 2 | 3;
  month: number;
  half: number;
  turn: number;
  availableRaces: TurnRace[];
  selectedRaceIds: number[];
}

export interface Epithet {
  id: number;
  name_en: string;
  name_en_gl: string;
  name_jp: string;
  rank: 1 | 2 | 3;
  scenario: number;
  desc_en: string[];
  desc_en_gl: string;
  disp_order: number;
  char?: number;
}

export interface EpithetProgress {
  epithetId: number;
  progress: number;
  target: number;
  description: string;
}

export interface Plan {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  selectedRaces: Record<number, number[]>;
  targetEpithetIds: number[];
}
