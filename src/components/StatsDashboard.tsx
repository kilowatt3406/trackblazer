import { usePlannerStore } from "@/store/planner";
import { StatType } from "@/types";
import { cn } from "@/utils";
import {
  Zap,
  Heart,
  Swords,
  Shield,
  Lightbulb,
  TrendingUp,
} from "lucide-react";

const statConfig: Record<
  StatType,
  {
    label: string;
    icon: typeof Zap;
    color: string;
    bgColor: string;
    bgColorDark: string;
  }
> = {
  speed: {
    label: "Speed",
    icon: Zap,
    color: "text-red-600",
    bgColor: "bg-red-50",
    bgColorDark: "dark:bg-red-900/30",
  },
  stamina: {
    label: "Stamina",
    icon: Heart,
    color: "text-green-600",
    bgColor: "bg-green-50",
    bgColorDark: "dark:bg-green-900/30",
  },
  power: {
    label: "Power",
    icon: Swords,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    bgColorDark: "dark:bg-orange-900/30",
  },
  guts: {
    label: "Guts",
    icon: Shield,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    bgColorDark: "dark:bg-blue-900/30",
  },
  wisdom: {
    label: "Wisdom",
    icon: Lightbulb,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    bgColorDark: "dark:bg-yellow-900/30",
  },
};

export function StatsDashboard() {
  const { getStats, getSelectedRaces } = usePlannerStore();
  const stats = getStats();
  const selectedRaces = getSelectedRaces();

  const totalRaces = selectedRaces.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Stats
        </h2>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {totalRaces} races
        </span>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {(Object.keys(statConfig) as StatType[]).map((stat) => {
          const config = statConfig[stat];
          const Icon = config.icon;
          const value = stats[stat];

          return (
            <div
              key={stat}
              className={cn(
                "flex flex-col items-center p-3 rounded-lg border border-slate-200 dark:border-slate-600",
                config.bgColor,
                config.bgColorDark,
              )}
            >
              <Icon className={cn("w-5 h-5", config.color)} />
              <span className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 font-medium">
                {config.label}
              </span>
              <span className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {value}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 py-2 rounded">
        <TrendingUp className="w-3 h-3" />
        Each race provides +10 to a random stat
      </div>
    </div>
  );
}
