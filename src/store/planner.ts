import { create } from 'zustand';
import { Turn, Plan, StatType, Race } from '../types';
import { turns as initialTurns, trailblazerEpithets } from '../data/turns';

interface PlannerState {
  turns: Turn[];
  selectedEpithetIds: number[];
  currentPlan: Plan | null;
  
  toggleRace: (turn: number, raceId: number) => void;
  selectRace: (turn: number, raceId: number) => void;
  clearTurn: (turn: number) => void;
  clearAllRaces: () => void;
  
  toggleEpithet: (epithetId: number) => void;
  selectAllEpithets: () => void;
  clearEpithets: () => void;
  
  getSelectedRaces: () => { turn: number; race: Race; uraId: string; year: number }[];
  getConsecutiveRaceTurns: () => number[];
  getStats: () => Record<StatType, number>;
  
  savePlan: (name: string) => Plan;
  loadPlan: (plan: Plan) => void;
  exportPlan: () => string;
  importPlan: (json: string) => boolean;
}

export const usePlannerStore = create<PlannerState>((set, get) => ({
  turns: JSON.parse(JSON.stringify(initialTurns)),
  selectedEpithetIds: [],
  currentPlan: null,

  toggleRace: (turn: number, raceId: number) => {
    set(state => {
      const newTurns = [...state.turns];
      const turnIndex = newTurns.findIndex(t => t.turn === turn);
      if (turnIndex === -1) return state;
      
      const turnData = { ...newTurns[turnIndex] };
      const raceIndex = turnData.selectedRaceIds.indexOf(raceId);
      
      if (raceIndex >= 0) {
        turnData.selectedRaceIds = turnData.selectedRaceIds.filter(id => id !== raceId);
      } else {
        turnData.selectedRaceIds = [...turnData.selectedRaceIds, raceId];
      }
      
      newTurns[turnIndex] = turnData;
      return { turns: newTurns };
    });
  },

  selectRace: (turn: number, raceId: number) => {
    set(state => {
      const newTurns = [...state.turns];
      const turnIndex = newTurns.findIndex(t => t.turn === turn);
      if (turnIndex === -1) return state;
      
      newTurns[turnIndex] = { ...newTurns[turnIndex], selectedRaceIds: [raceId] };
      return { turns: newTurns };
    });
  },

  clearTurn: (turn: number) => {
    set(state => {
      const newTurns = [...state.turns];
      const turnIndex = newTurns.findIndex(t => t.turn === turn);
      if (turnIndex === -1) return state;
      
      newTurns[turnIndex] = { ...newTurns[turnIndex], selectedRaceIds: [] };
      return { turns: newTurns };
    });
  },

  clearAllRaces: () => {
    set(state => ({
      turns: state.turns.map(t => ({ ...t, selectedRaceIds: [] }))
    }));
  },

  toggleEpithet: (epithetId: number) => {
    set(state => {
      const ids = state.selectedEpithetIds.includes(epithetId)
        ? state.selectedEpithetIds.filter(id => id !== epithetId)
        : [...state.selectedEpithetIds, epithetId];
      return { selectedEpithetIds: ids };
    });
  },

  selectAllEpithets: () => {
    set({ selectedEpithetIds: trailblazerEpithets.map(e => e.id) });
  },

  clearEpithets: () => {
    set({ selectedEpithetIds: [] });
  },

  getSelectedRaces: () => {
    const state = get();
    const result: { turn: number; race: Race; uraId: string; year: number }[] = [];
    
    for (const turn of state.turns) {
      for (const raceId of turn.selectedRaceIds) {
        const turnRace = turn.availableRaces.find(tr => tr.race.id === raceId);
        if (turnRace) {
          result.push({ turn: turn.turn, race: turnRace.race, uraId: turnRace.uraId, year: turnRace.year });
        }
      }
    }
    
    return result;
  },

  getConsecutiveRaceTurns: () => {
    const state = get();
    const consecutiveTurns: number[] = [];
    
    let consecutiveCount = 0;
    let consecutiveStart: number | null = null;
    
    for (let turn = 1; turn <= 72; turn++) {
      const turnData = state.turns.find(t => t.turn === turn);
      const hasRace = turnData && turnData.selectedRaceIds.length > 0;
      
      if (hasRace) {
        if (consecutiveCount === 0) {
          consecutiveStart = turn;
        }
        consecutiveCount++;
      } else {
        if (consecutiveCount >= 3 && consecutiveStart) {
          for (let i = consecutiveStart; i < turn; i++) {
            consecutiveTurns.push(i);
          }
        }
        consecutiveCount = 0;
        consecutiveStart = null;
      }
    }
    
    if (consecutiveCount >= 3 && consecutiveStart) {
      for (let i = consecutiveStart; i <= 72; i++) {
        consecutiveTurns.push(i);
      }
    }
    
    return consecutiveTurns;
  },

  getStats: () => {
    const stats: Record<StatType, number> = {
      speed: 0,
      stamina: 0,
      power: 0,
      guts: 0,
      wisdom: 0,
    };
    
    return stats;
  },

  savePlan: (name: string) => {
    const state = get();
    const plan: Plan = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      selectedRaces: state.turns.reduce((acc, t) => {
        if (t.selectedRaceIds.length > 0) {
          acc[t.turn] = t.selectedRaceIds;
        }
        return acc;
      }, {} as Record<number, number[]>),
      targetEpithetIds: state.selectedEpithetIds,
    };
    
    set({ currentPlan: plan });
    return plan;
  },

  loadPlan: (plan: Plan) => {
    set(state => ({
      turns: state.turns.map(t => ({
        ...t,
        selectedRaceIds: plan.selectedRaces[t.turn] || [],
      })),
      selectedEpithetIds: plan.targetEpithetIds,
      currentPlan: plan,
    }));
  },

  exportPlan: () => {
    const state = get();
    const plan: Plan = {
      id: crypto.randomUUID(),
      name: state.currentPlan?.name || 'Unnamed Plan',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      selectedRaces: state.turns.reduce((acc, t) => {
        if (t.selectedRaceIds.length > 0) {
          acc[t.turn] = t.selectedRaceIds;
        }
        return acc;
      }, {} as Record<number, number[]>),
      targetEpithetIds: state.selectedEpithetIds,
    };
    
    return JSON.stringify(plan, null, 2);
  },

  importPlan: (json: string) => {
    try {
      const plan: Plan = JSON.parse(json);
      if (!plan.selectedRaces || !Array.isArray(plan.targetEpithetIds)) {
        return false;
      }
      get().loadPlan(plan);
      return true;
    } catch {
      return false;
    }
  },
}));

export { trailblazerEpithets };
