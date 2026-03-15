import { usePlannerStore } from "@/store/planner";
import { cn, getMonthName, getGradeLabel, getTerrainLabel } from "@/utils";
import { Turn } from "@/types";
import { AlertTriangle, X, Ban } from "lucide-react";

function TurnRow({
  turn,
  consecutiveTurns,
}: {
  turn: Turn;
  consecutiveTurns: boolean;
}) {
  const { selectRace, clearTurn } = usePlannerStore();

  const hasRaces = turn.availableRaces.length > 0;
  const selectedRaceId = turn.selectedRaceIds[0];
  const selectedRace = selectedRaceId
    ? turn.availableRaces.find((tr) => tr.race.id === selectedRaceId)
    : null;
  const isConsecutive = consecutiveTurns;
  const isSummer =
    (turn.year === 2 || turn.year === 3) &&
    (turn.month === 7 || turn.month === 8);

  const handleRaceSelect = (raceId: number) => {
    if (selectedRaceId === raceId) {
      clearTurn(turn.turn);
    } else {
      selectRace(turn.turn, raceId);
    }
  };

  return (
    <div
      className={cn(
        "border-b border-slate-100 dark:border-slate-700 last:border-b-0 transition-colors duration-150",
        isSummer
          ? "bg-red-50 dark:bg-red-900/20"
          : isConsecutive
            ? "bg-amber-50/50 dark:bg-amber-900/20"
            : hasRaces
              ? "bg-white dark:bg-slate-800"
              : "bg-slate-50 dark:bg-slate-800/50",
      )}
    >
      <div className="flex items-center px-4 py-3">
        <div className="w-20 shrink-0">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Turn {turn.turn}
          </span>
        </div>

        <div className="w-40 shrink-0">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {getMonthName(turn.month)} ({turn.half === 1 ? "1st" : "2nd"})
          </span>
        </div>

        <div className="flex-1 min-w-0">
          {hasRaces ? (
            <div className="flex flex-wrap gap-2">
              {turn.availableRaces.map((turnRace) => (
                <button
                  key={turnRace.race.id}
                  onClick={() => handleRaceSelect(turnRace.race.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border transition-all duration-150 cursor-pointer",
                    turnRace.race.id === selectedRaceId
                      ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                      : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300",
                  )}
                >
                  <span
                    className={cn(
                      "font-semibold text-xs",
                      turnRace.race.id === selectedRaceId
                        ? "text-white/80"
                        : turnRace.race.grade === 100
                          ? "text-yellow-700 dark:text-yellow-400"
                          : turnRace.race.grade === 200
                            ? "text-slate-600 dark:text-slate-400"
                            : "text-orange-700 dark:text-orange-400",
                    )}
                  >
                    {getGradeLabel(turnRace.race.grade)}
                  </span>
                  <span
                    className={cn(
                      "font-medium",
                      turnRace.race.id === selectedRaceId
                        ? "text-white"
                        : "text-slate-800 dark:text-slate-200",
                    )}
                  >
                    {turnRace.race.name_en}
                  </span>
                  <span
                    className={cn(
                      "text-xs",
                      turnRace.race.id === selectedRaceId
                        ? "text-blue-200"
                        : "text-slate-400 dark:text-slate-500",
                    )}
                  >
                    {getTerrainLabel(turnRace.race.terrain)} ·{" "}
                    {turnRace.race.distance}m
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
              <Ban className="w-4 h-4" />
              <span className="text-sm">No races available</span>
            </div>
          )}
        </div>

        <div className="w-32 shrink-0 flex items-center justify-end gap-2">
          {isConsecutive && (
            <span className="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-2 py-1 rounded">
              <AlertTriangle className="w-3 h-3" />
              Fatigue
            </span>
          )}
          {selectedRace && (
            <button
              onClick={() => clearTurn(turn.turn)}
              className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function TurnTimeline() {
  const { turns, getConsecutiveRaceTurns, getVisibleGrades } =
    usePlannerStore();
  const consecutiveTurns = getConsecutiveRaceTurns();
  const consecutiveSet = new Set(consecutiveTurns);
  const visibleGrades = getVisibleGrades();

  const filteredTurns = turns
    .filter((t) => t.turn > 12)
    .map((turn) => ({
      ...turn,
      availableRaces: turn.availableRaces.filter((tr) =>
        visibleGrades.includes(tr.race.grade),
      ),
    }));

  const visibleTurns = filteredTurns;

  const years: Array<{ year: 1 | 2 | 3; turns: Turn[] }> = [
    { year: 1, turns: visibleTurns.filter((t) => t.year === 1) },
    { year: 2, turns: visibleTurns.filter((t) => t.year === 2) },
    { year: 3, turns: visibleTurns.filter((t) => t.year === 3) },
  ];

  return (
    <div className="space-y-4">
      {years.map(({ year, turns: yearTurns }) => (
        <div
          key={year}
          className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm"
        >
          <div className="bg-slate-100 dark:bg-slate-700 px-4 py-3 font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-600 flex items-center gap-4">
            <span className="w-20">Turn</span>
            <span className="w-40">Month</span>
            <span className="flex-1">Available Races</span>
            <span className="w-32 text-right">Status</span>
          </div>
          <div>
            {yearTurns.map((turn) => (
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
