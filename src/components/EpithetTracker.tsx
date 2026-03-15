import { useMemo } from "react";
import { usePlannerStore } from "@/store/planner";
import { Target } from "lucide-react";
import { calculateEpithetProgress } from "@/utils/epithetProgress";
import { EpithetItem } from "./EpithetItem";

export function EpithetTracker() {
  const { selectedEpithetIds, toggleEpithet, getSelectedRaces } =
    usePlannerStore();
  const selectedRaces = getSelectedRaces();

  const epithetProgressList = useMemo(() => {
    const selectedWithUra = selectedRaces.map((sr) => ({
      uraId: sr.uraId,
      race: sr.race,
      year: sr.year,
    }));

    return calculateEpithetProgress(selectedWithUra);
  }, [selectedRaces]);

  const completedCount = epithetProgressList.filter((p) => p.met).length;
  const totalCount = epithetProgressList.length;
  const selectedCount = selectedEpithetIds.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-slate-400" />
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Epithets
          </h2>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            {selectedCount} selected
          </span>
          <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full font-medium text-xs">
            {completedCount}/{totalCount}
          </span>
        </div>
      </div>

      <div className="text-xs text-slate-500 dark:text-slate-400">
        Click to select target epithets. Progress updates as you select races.
      </div>

      <div className="space-y-1 max-h-96 overflow-y-auto pr-1 [&>*]:overflow-visible">
        {epithetProgressList
          .sort((a, b) => {
            const aPct = a.target > 0 ? a.progress / a.target : 0;
            const bPct = b.target > 0 ? b.progress / b.target : 0;
            if (aPct !== bPct) return bPct - aPct;
            if (a.epithet.rank !== b.epithet.rank)
              return b.epithet.rank - a.epithet.rank;
            const aName = a.epithet.name_en_gl || a.epithet.name_en;
            const bName = b.epithet.name_en_gl || b.epithet.name_en;
            return aName.localeCompare(bName);
          })
          .map(({ epithet, met, progress, target }) => {
            const isSelected = selectedEpithetIds.includes(epithet.id);
            const name = epithet.name_en_gl || epithet.name_en;

            return (
              <EpithetItem
                key={epithet.id}
                name={name}
                rank={epithet.rank}
                description={epithet.description}
                selected={isSelected}
                complete={met}
                progress={progress}
                target={target}
                onClick={() => toggleEpithet(epithet.id)}
              />
            );
          })}
      </div>
    </div>
  );
}
