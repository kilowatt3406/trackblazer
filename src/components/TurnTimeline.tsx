import { useState } from 'react';
import { usePlannerStore } from '../store/planner';
import { cn, getYearName, getMonthName, getGradeLabel, getTerrainLabel, getDistanceClass } from '../utils';
import { Race, Turn } from '../types';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

function TurnRow({ turn, consecutiveTurns }: { turn: Turn; consecutiveTurns: boolean }) {
  const { toggleRace, clearTurn } = usePlannerStore();
  const [expanded, setExpanded] = useState(turn.selectedRaceIds.length > 0);
  
  const hasRaces = turn.availableRaces.length > 0;
  const hasSelected = turn.selectedRaceIds.length > 0;
  const isConsecutive = consecutiveTurns;

  return (
    <div className={cn(
      "border rounded-md overflow-hidden",
      isConsecutive ? "border-amber-400 bg-amber-50" : "border-gray-200",
      hasSelected && !isConsecutive && "bg-blue-50 border-blue-300"
    )}>
      <div 
        className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600 w-16">
            Turn {turn.turn}
          </span>
          <span className="text-xs text-gray-500">
            {getYearName(turn.year)} {getMonthName(turn.month)} ({turn.half === 1 ? '1st' : '2nd'} half)
          </span>
          {isConsecutive && (
            <span className="flex items-center gap-1 text-xs text-amber-600">
              <AlertTriangle className="w-3 h-3" />
              3+ consecutive
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasSelected && (
            <button
              onClick={(e) => { e.stopPropagation(); clearTurn(turn.turn); }}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Clear
            </button>
          )}
          {hasRaces ? (
            <span className="text-xs text-gray-500">
              {turn.availableRaces.length} race{turn.availableRaces.length !== 1 ? 's' : ''}
              {hasSelected && ` (${turn.selectedRaceIds.length} selected)`}
            </span>
          ) : (
            <span className="text-xs text-gray-400">No races</span>
          )}
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>
      
      {expanded && hasRaces && (
        <div className="border-t border-gray-200 p-2 bg-white">
          <div className="grid gap-1">
            {turn.availableRaces.map(race => (
              <RaceOption 
                key={race.id} 
                race={race} 
                selected={turn.selectedRaceIds.includes(race.id)}
                onToggle={() => toggleRace(turn.turn, race.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RaceOption({ race, selected, onToggle }: { race: Race; selected: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "flex items-center justify-between w-full px-3 py-2 text-left rounded border text-sm",
        selected 
          ? "bg-blue-100 border-blue-400 text-blue-900" 
          : "border-gray-200 hover:bg-gray-50"
      )}
    >
      <div className="flex items-center gap-2">
        <span className={cn(
          "font-medium px-1.5 py-0.5 rounded text-xs",
          race.grade === 100 ? "bg-yellow-100 text-yellow-800" :
          race.grade === 200 ? "bg-gray-100 text-gray-800" :
          "bg-orange-100 text-orange-800"
        )}>
          {getGradeLabel(race.grade)}
        </span>
        <span className="font-medium">{race.name_en}</span>
      </div>
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span>{getTerrainLabel(race.terrain)}</span>
        <span>{race.distance}m</span>
        <span className="capitalize">{getDistanceClass(race.distance)}</span>
      </div>
    </button>
  );
}

export function TurnTimeline() {
  const { turns, getConsecutiveRaceTurns } = usePlannerStore();
  const consecutiveTurns = getConsecutiveRaceTurns();
  const consecutiveSet = new Set(consecutiveTurns);
  
  const visibleTurns = turns.filter(t => t.turn > 12);
  
  const years: Array<{ year: 1 | 2 | 3; turns: Turn[] }> = [
    { year: 1, turns: visibleTurns.filter(t => t.year === 1) },
    { year: 2, turns: visibleTurns.filter(t => t.year === 2) },
    { year: 3, turns: visibleTurns.filter(t => t.year === 3) },
  ];

  return (
    <div className="space-y-4">
      {years.map(({ year, turns: yearTurns }) => (
        <div key={year} className="border rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 font-semibold text-gray-700">
            {getYearName(year)} Year
          </div>
          <div className="divide-y">
            {yearTurns.map(turn => (
              <TurnRow 
                key={turn.turn} 
                turn={turn} 
                consecutiveTurns={consecutiveSet.has(turn.turn)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
