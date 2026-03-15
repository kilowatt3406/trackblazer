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
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 px-6 py-5">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                  Scheduleblazer
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Plan out Umamusume Trackblazer races and optimise epithets
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-2xl font-semibold text-slate-900">
                    {selectedRaces.length}
                  </div>
                  <div className="text-xs text-slate-500">races selected</div>
                </div>
                {consecutiveTurns.length > 0 && (
                  <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded-md text-right">
                    <div className="text-sm font-medium text-amber-700">
                      {consecutiveTurns.length}
                    </div>
                    <div className="text-xs text-amber-600">
                      consecutive races
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Show:</span>
                {[100, 200, 300].map((grade) => (
                  <button
                    key={grade}
                    onClick={() => toggleGrade(grade)}
                    className={`px-3 py-1 text-sm font-medium rounded-md border transition-colors duration-150 ${
                      visibleGrades.includes(grade)
                        ? grade === 100
                          ? "bg-yellow-50 border-yellow-300 text-yellow-700"
                          : grade === 200
                            ? "bg-slate-100 border-slate-300 text-slate-700"
                            : "bg-orange-50 border-orange-300 text-orange-700"
                        : "bg-slate-50 border-slate-200 text-slate-400"
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
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors duration-150"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Races
                </button>
                <button
                  onClick={selectAllEpithets}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors duration-150"
                >
                  <CheckSquare className="w-4 h-4" />
                  Select All
                </button>
                <button
                  onClick={clearEpithets}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors duration-150"
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
              <div className="bg-white rounded-lg border border-slate-200 p-5">
                <RewardsBox />
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-5">
                <EpithetTracker />
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-5">
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
