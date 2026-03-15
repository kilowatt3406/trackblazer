import { useState, useMemo } from 'react';
import { usePlannerStore, trailblazerEpithets } from '../store/planner';
import { cn } from '../utils';
import { Wand2, Loader2, Sparkles } from 'lucide-react';

interface OptimizationResult {
  turn: number;
  raceIds: number[];
}

export function Optimizer() {
  const { selectedEpithetIds, turns, clearAllRaces, toggleRace } = usePlannerStore();
  const [optimizing, setOptimizing] = useState(false);
  const [result, setResult] = useState<OptimizationResult[] | null>(null);
  
  const targetEpithets = useMemo(() => {
    return trailblazerEpithets.filter(e => selectedEpithetIds.includes(e.id));
  }, [selectedEpithetIds]);
  
  const runOptimization = async () => {
    if (targetEpithets.length === 0) return;
    
    setOptimizing(true);
    setResult(null);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newSelections: OptimizationResult[] = [];
    
    for (const epithet of targetEpithets) {
      const desc = epithet.desc_en.join(' ').toLowerCase();
      
      let bestTurn: number | null = null;
      let bestRaceId: number | null = null;
      
      if (desc.includes('g1')) {
        for (const turn of turns) {
          const g1Races = turn.availableRaces.filter(tr => tr.race.grade === 100);
          if (g1Races.length > 0) {
            const alreadySelected = newSelections.some(s => s.turn === turn.turn);
            if (!alreadySelected) {
              bestTurn = turn.turn;
              bestRaceId = g1Races[0].race.id;
              break;
            }
          }
        }
      }
      else if (desc.includes('g2')) {
        for (const turn of turns) {
          const g2Races = turn.availableRaces.filter(tr => tr.race.grade === 200);
          if (g2Races.length > 0) {
            const alreadySelected = newSelections.some(s => s.turn === turn.turn);
            if (!alreadySelected) {
              bestTurn = turn.turn;
              bestRaceId = g2Races[0].race.id;
              break;
            }
          }
        }
      }
      else if (desc.includes('g3')) {
        for (const turn of turns) {
          const g3Races = turn.availableRaces.filter(tr => tr.race.grade === 300);
          if (g3Races.length > 0) {
            const alreadySelected = newSelections.some(s => s.turn === turn.turn);
            if (!alreadySelected) {
              bestTurn = turn.turn;
              bestRaceId = g3Races[0].race.id;
              break;
            }
          }
        }
      }
      else if (desc.includes('dirt')) {
        for (const turn of turns) {
          const dirtRaces = turn.availableRaces.filter(tr => tr.race.terrain === 2);
          if (dirtRaces.length > 0) {
            const alreadySelected = newSelections.some(s => s.turn === turn.turn);
            if (!alreadySelected) {
              bestTurn = turn.turn;
              bestRaceId = dirtRaces[0].race.id;
              break;
            }
          }
        }
      }
      else {
        for (const turn of turns) {
          if (turn.availableRaces.length > 0) {
            const alreadySelected = newSelections.some(s => s.turn === turn.turn);
            if (!alreadySelected) {
              bestTurn = turn.turn;
              bestRaceId = turn.availableRaces[0].race.id;
              break;
            }
          }
        }
      }
      
      if (bestTurn && bestRaceId) {
        newSelections.push({ turn: bestTurn, raceIds: [bestRaceId] });
      }
    }
    
    clearAllRaces();
    
    for (const selection of newSelections) {
      for (const raceId of selection.raceIds) {
        toggleRace(selection.turn, raceId);
      }
    }
    
    setResult(newSelections);
    setOptimizing(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-purple-500" />
        <h2 className="text-base font-semibold text-slate-900">Auto-Optimizer</h2>
      </div>
      
      <p className="text-xs text-slate-500">
        Generate an optimized race schedule based on your selected target epithets.
      </p>
      
      <button
        onClick={runOptimization}
        disabled={optimizing || selectedEpithetIds.length === 0}
        className={cn(
          "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-150",
          selectedEpithetIds.length === 0
            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
            : "bg-purple-600 text-white hover:bg-purple-700 shadow-sm hover:shadow"
        )}
      >
        {optimizing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Wand2 className="w-4 h-4" />
        )}
        {optimizing ? 'Optimizing...' : 'Generate Schedule'}
      </button>
      
      {selectedEpithetIds.length === 0 && (
        <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded">
          Select epithets from the Epithet Tracker first
        </p>
      )}
      
      {result && (
        <div className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded flex items-center gap-2">
          <CheckIcon className="w-4 h-4" />
          Added {result.length} races to your schedule
        </div>
      )}
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
