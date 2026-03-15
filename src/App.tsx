import { TurnTimeline } from "./components/TurnTimeline";
import { EpithetTracker } from "./components/EpithetTracker";
import { RewardsBox } from "./components/RewardsBox";
import { Optimizer } from "./components/Optimizer";
import { SaveLoad } from "./components/SaveLoad";
import { usePlannerStore } from "./store/planner";
import {
  LayoutGrid,
  List,
  Calendar,
  Trash2,
  CheckSquare,
  Square,
} from "lucide-react";
import { useState } from "react";
import { cn } from "./utils";

type ViewMode = "full" | "timeline" | "epithets";

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>("full");
  const {
    getSelectedRaces,
    getConsecutiveRaceTurns,
    clearAllRaces,
    selectAllEpithets,
    clearEpithets,
  } = usePlannerStore();

  const selectedRaces = getSelectedRaces();
  const consecutiveTurns = getConsecutiveRaceTurns();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                Uma Musume Planner
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Schedule races to maximize epithets across 60 turns
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
                <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded-md">
                  <div className="text-sm font-medium text-amber-700">
                    {consecutiveTurns.length}
                  </div>
                  <div className="text-xs text-amber-600">3+ consecutive</div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <div className="flex rounded-md shadow-sm" role="group">
              <button
                onClick={() => setViewMode("full")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-l-md border transition-colors duration-150",
                  viewMode === "full"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50",
                )}
              >
                <LayoutGrid className="w-4 h-4" />
                Full
              </button>
              <button
                onClick={() => setViewMode("timeline")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium border-t border-b transition-colors duration-150",
                  viewMode === "timeline"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50",
                )}
              >
                <Calendar className="w-4 h-4" />
                Timeline
              </button>
              <button
                onClick={() => setViewMode("epithets")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-r-md border transition-colors duration-150",
                  viewMode === "epithets"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50",
                )}
              >
                <List className="w-4 h-4" />
                Epithets
              </button>
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
          {(viewMode === "full" || viewMode === "timeline") && (
            <div className={viewMode === "full" ? "flex-1" : "w-full"}>
              <TurnTimeline />
            </div>
          )}

          {viewMode === "full" && (
            <div className="w-full lg:w-80 shrink-0 space-y-4">
              <div className="bg-white rounded-lg border border-slate-200 p-5">
                <RewardsBox />
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-5">
                <EpithetTracker />
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-5">
                <Optimizer />
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-5">
                <SaveLoad />
              </div>
            </div>
          )}

          {viewMode === "epithets" && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg border border-slate-200 p-5">
                <EpithetTracker />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
