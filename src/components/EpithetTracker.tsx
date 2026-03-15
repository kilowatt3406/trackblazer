import { useMemo } from 'react';
import { usePlannerStore, trailblazerEpithets } from '../store/planner';
import { cn, getRankLabel } from '../utils';
import { Check, X, Target } from 'lucide-react';

const rankColors: Record<1 | 2 | 3, { bg: string; text: string; border: string }> = {
  1: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  2: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' },
  3: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
};

export function EpithetTracker() {
  const { selectedEpithetIds, toggleEpithet, getSelectedRaces } = usePlannerStore();
  const selectedRaces = getSelectedRaces();
  
  const epithetProgress = useMemo(() => {
    const raceGrades = selectedRaces.map(r => r.race.grade);
    const raceTerrains = selectedRaces.map(r => r.race.terrain);
    const raceDistances = selectedRaces.map(r => r.race.distance);
    const raceTracks = selectedRaces.map(r => r.race.track);
    
    const results: Record<number, { progress: number; target: number; met: boolean }> = {};
    
    for (const epithet of trailblazerEpithets) {
      let progress = 0;
      let target = 1;
      let met = false;
      
      const desc = epithet.desc_en.join(' ').toLowerCase();
      
      if (desc.includes('g1') || epithet.name_en.includes('G1')) {
        const g1Count = raceGrades.filter(g => g === 100).length;
        const match = desc.match(/(\d+)/);
        target = match ? parseInt(match[1]) : 3;
        progress = Math.min(g1Count, target);
        met = progress >= target;
      }
      else if (desc.includes('g2') || epithet.name_en.includes('G2')) {
        const g2Count = raceGrades.filter(g => g === 200).length;
        const match = desc.match(/(\d+)/);
        target = match ? parseInt(match[1]) : 3;
        progress = Math.min(g2Count, target);
        met = progress >= target;
      }
      else if (desc.includes('g3') || epithet.name_en.includes('G3')) {
        const g3Count = raceGrades.filter(g => g === 300).length;
        const match = desc.match(/(\d+)/);
        target = match ? parseInt(match[1]) : 3;
        progress = Math.min(g3Count, target);
        met = progress >= target;
      }
      else if (desc.includes('dirt') && !desc.includes('non-dirt')) {
        const dirtCount = raceTerrains.filter(t => t === 1).length;
        const match = desc.match(/(\d+)/);
        target = match ? parseInt(match[1]) : 3;
        progress = Math.min(dirtCount, target);
        met = progress >= target;
      }
      else if (desc.includes('turf')) {
        const turfCount = raceTerrains.filter(t => t === 2).length;
        const match = desc.match(/(\d+)/);
        target = match ? parseInt(match[1]) : 3;
        progress = Math.min(turfCount, target);
        met = progress >= target;
      }
      else if (desc.includes('distance')) {
        if (desc.includes('short') || epithet.name_en.includes('Miler')) {
          const shortCount = raceDistances.filter(d => d <= 1400).length;
          const match = desc.match(/(\d+)/);
          target = match ? parseInt(match[1]) : 3;
          progress = Math.min(shortCount, target);
          met = progress >= target;
        }
        else if (desc.includes('long')) {
          const longCount = raceDistances.filter(d => d >= 2000).length;
          const match = desc.match(/(\d+)/);
          target = match ? parseInt(match[1]) : 3;
          progress = Math.min(longCount, target);
          met = progress >= target;
        }
        else if (desc.includes('mile')) {
          const mileCount = raceDistances.filter(d => d >= 1400 && d <= 1800).length;
          const match = desc.match(/(\d+)/);
          target = match ? parseInt(match[1]) : 3;
          progress = Math.min(mileCount, target);
          met = progress >= target;
        }
        else {
          const totalCount = raceDistances.length;
          target = desc.includes('at least') ? (desc.match(/(\d+)/)?.[1] || 10) : 20;
          progress = Math.min(totalCount, target);
          met = progress >= target;
        }
      }
      else if (desc.includes('track') || desc.includes('course')) {
        const trackCount = raceTracks.length;
        const match = desc.match(/(\d+)/);
        target = match ? parseInt(match[1]) : 10;
        progress = Math.min(trackCount, target);
        met = progress >= target;
      }
      else if (desc.includes('fan')) {
        target = desc.includes('100000') ? 100000 : desc.includes('300000') ? 300000 : 550000;
        const fansPerRace = 12000;
        progress = selectedRaces.length * fansPerRace;
        met = progress >= target;
      }
      else if (desc.includes('grade') || desc.includes('point')) {
        target = desc.includes('1000') ? 1000 : desc.includes('2000') ? 2000 : 2500;
        const gpPerRace = 150;
        progress = selectedRaces.length * gpPerRace;
        met = progress >= target;
      }
      else if (desc.includes('win')) {
        const winCount = Math.floor(selectedRaces.length * 0.7);
        const match = desc.match(/(\d+)/);
        target = match ? parseInt(match[1]) : 3;
        progress = Math.min(winCount, target);
        met = progress >= target;
      }
      else if (desc.includes('race')) {
        const match = desc.match(/(\d+)/);
        target = match ? parseInt(match[1]) : 10;
        progress = Math.min(selectedRaces.length, target);
        met = progress >= target;
      }
      else {
        met = selectedRaces.length > 0;
        progress = selectedRaces.length;
        target = 1;
      }
      
      results[epithet.id] = { progress, target, met };
    }
    
    return results;
  }, [selectedRaces]);

  const completedCount = Object.values(epithetProgress).filter(p => p.met).length;
  const totalCount = trailblazerEpithets.length;
  const selectedCount = selectedEpithetIds.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-slate-400" />
          <h2 className="text-base font-semibold text-slate-900">Epithets</h2>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-500">{selectedCount} selected</span>
          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium text-xs">
            {completedCount}/{totalCount}
          </span>
        </div>
      </div>
      
      <div className="text-xs text-slate-500">
        Click to select target epithets. Progress updates as you select races.
      </div>
      
      <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
        {trailblazerEpithets.map(epithet => {
          const isSelected = selectedEpithetIds.includes(epithet.id);
          const progress = epithetProgress[epithet.id];
          const colors = rankColors[epithet.rank];
          
          return (
            <button
              key={epithet.id}
              onClick={() => toggleEpithet(epithet.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 text-left rounded-lg border text-sm transition-all duration-150 cursor-pointer",
                isSelected 
                  ? "bg-blue-50 border-blue-300 shadow-sm" 
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              <div className="flex items-center gap-2.5">
                <span className={cn(
                  "px-2 py-0.5 rounded text-xs font-semibold",
                  colors.bg, colors.text
                )}>
                  {getRankLabel(epithet.rank)}
                </span>
                <span className="font-medium text-slate-800">{epithet.name_en}</span>
              </div>
              <div className="flex items-center gap-2">
                {progress && isSelected && (
                  <span className="text-xs text-slate-500 font-medium">
                    {progress.progress}/{progress.target}
                  </span>
                )}
                {progress?.met ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : isSelected ? (
                  <div className="w-4 h-4 rounded-full border-2 border-blue-300" />
                ) : (
                  <X className="w-4 h-4 text-slate-300" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
