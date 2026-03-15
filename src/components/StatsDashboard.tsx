import { usePlannerStore } from '../store/planner';
import { StatType } from '../types';
import { cn } from '../utils';
import { Zap, Heart, Swords, Shield, Lightbulb } from 'lucide-react';

const statConfig: Record<StatType, { label: string; icon: typeof Zap; color: string }> = {
  speed: { label: 'Speed', icon: Zap, color: 'text-red-500 bg-red-100' },
  stamina: { label: 'Stamina', icon: Heart, color: 'text-green-500 bg-green-100' },
  power: { label: 'Power', icon: Swords, color: 'text-orange-500 bg-orange-100' },
  guts: { label: 'Guts', icon: Shield, color: 'text-blue-500 bg-blue-100' },
  wisdom: { label: 'Wisdom', icon: Lightbulb, color: 'text-yellow-500 bg-yellow-100' },
};

export function StatsDashboard() {
  const { getStats, getSelectedRaces } = usePlannerStore();
  const stats = getStats();
  const selectedRaces = getSelectedRaces();
  
  const totalRaces = selectedRaces.length;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Stats</h2>
        <span className="text-sm text-gray-600">
          {totalRaces} races selected
        </span>
      </div>
      
      <div className="grid grid-cols-5 gap-2">
        {(Object.keys(statConfig) as StatType[]).map(stat => {
          const config = statConfig[stat];
          const Icon = config.icon;
          const value = stats[stat];
          
          return (
            <div 
              key={stat}
              className="flex flex-col items-center p-3 rounded-lg border border-gray-200"
            >
              <div className={cn("p-2 rounded-full", config.color)}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs text-gray-500 mt-1">{config.label}</span>
              <span className="text-lg font-bold">{value}</span>
            </div>
          );
        })}
      </div>
      
      <div className="text-xs text-gray-500 text-center">
        Each race provides +10 to a random stat
      </div>
    </div>
  );
}
