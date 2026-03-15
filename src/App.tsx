import { TurnTimeline } from "./components/TurnTimeline";
import { EpithetTracker } from "./components/EpithetTracker";
import { RewardsBox } from "./components/RewardsBox";
import { SaveLoad } from "./components/SaveLoad";
import { TooltipProvider } from "./components/Tooltip";
import { usePlannerStore } from "./store/planner";
import { Trash2, CheckSquare, Square } from "lucide-react";

function App() {
  const {
    getSelectedRaces,
    getConsecutiveRaceTurns,
    clearAllRaces,
    selectAllEpithets,
    clearEpithets,
    getVisibleGrades,
    toggleGrade,
  } = usePlannerStore();

  const selectedRaces = getSelectedRaces();
  const consecutiveTurns = getConsecutiveRaceTurns();
  const visibleGrades = getVisibleGrades();

  const gradeLabels: Record<number, string> = {
    100: "G1",
    200: "G2",
    300: "G3",
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-5">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
                  Scheduleblazer
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Plan out Umamusume Trackblazer races and optimise epithets
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-2xl font-semibold text-slate-900 dark:text-white">
                    {selectedRaces.length}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    races selected
                  </div>
                </div>
                {consecutiveTurns.length > 0 && (
                  <div className="px-3 py-2 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-md text-right">
                    <div className="text-sm font-medium text-amber-700 dark:text-amber-400">
                      {consecutiveTurns.length}
                    </div>
                    <div className="text-xs text-amber-600 dark:text-amber-500">
                      consecutive races
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Show:
                </span>
                {[100, 200, 300].map((grade) => (
                  <button
                    key={grade}
                    onClick={() => toggleGrade(grade)}
                    className={`px-3 py-1 text-sm font-medium rounded-md border transition-colors duration-150 ${
                      visibleGrades.includes(grade)
                        ? grade === 100
                          ? "bg-yellow-50 dark:bg-yellow-900/40 border-yellow-300 dark:border-yellow-600 text-yellow-700 dark:text-yellow-400"
                          : grade === 200
                            ? "bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
                            : "bg-orange-50 dark:bg-orange-900/40 border-orange-300 dark:border-orange-600 text-orange-700 dark:text-orange-400"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {gradeLabels[grade]}
                  </button>
                ))}
              </div>

              <div className="flex-1" />

              <div className="flex gap-2">
                <button
                  onClick={clearAllRaces}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors duration-150"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Races
                </button>
                <button
                  onClick={selectAllEpithets}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors duration-150"
                >
                  <CheckSquare className="w-4 h-4" />
                  Select All
                </button>
                <button
                  onClick={clearEpithets}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors duration-150"
                >
                  <Square className="w-4 h-4" />
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <TurnTimeline />
            </div>

            <div className="w-full lg:w-80 shrink-0 space-y-4 lg:sticky lg:top-6 lg:self-start">
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
                <RewardsBox />
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
                <EpithetTracker />
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
                <SaveLoad />
              </div>
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}

export default App;
