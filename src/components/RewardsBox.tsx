import { useMemo, useState } from "react";
import { usePlannerStore } from "@/store/planner";
import { skillNames } from "@/data/epithetRequirements";
import { calculateEpithetProgress } from "@/utils/epithetProgress";
import { Trophy, Star, BookOpen, Zap, Info } from "lucide-react";
import { EpithetItem } from "./EpithetItem";

const GRADE_STATS: Record<number, number> = {
  100: 10,
  200: 8,
  300: 5,
};

const RACE_BONUS = 1.5;

interface RewardSummary {
  skills: { id: number; name: string; hints: number }[];
  completedEpithets: {
    name_en_gl: string;
    rank: 1 | 2 | 3;
    description?: string;
  }[];
  raceStats: {
    g1Count: number;
    g2Count: number;
    g3Count: number;
    g1Total: number;
    g2Total: number;
    g3Total: number;
    epithetBonus: number;
    total: number;
  };
}

export function RewardsBox() {
  const { getSelectedRaces } = usePlannerStore();
  const selectedRaces = getSelectedRaces();
  const [showRaceTooltip, setShowRaceTooltip] = useState(false);

  const rewardSummary = useMemo((): RewardSummary => {
    const selectedWithUra = selectedRaces.map((sr) => ({
      uraId: sr.uraId,
      race: sr.race,
      year: sr.year,
    }));

    const progressList = calculateEpithetProgress(selectedWithUra);

    const metEpithets = progressList.filter((p) => p.met);

    let epithetStatValue = 0;
    const skillMap = new Map<number, number>();

    for (const { epithet } of metEpithets) {
      const rewards = epithet.rewards || [];

      for (const reward of rewards) {
        if (reward.t === "rs") {
          epithetStatValue += parseInt(reward.v) * reward.d;
        } else if (reward.t === "sk") {
          const current = skillMap.get(reward.d) || 0;
          skillMap.set(reward.d, current + parseInt(reward.v));
        }
      }
    }

    const skills = Array.from(skillMap.entries()).map(([id, hints]) => ({
      id,
      name: skillNames[id] || `Skill ${id}`,
      hints,
    }));

    const completedEpithets = metEpithets.map((p) => ({
      name_en_gl: p.epithet.name_en_gl,
      rank: p.epithet.rank,
      description: p.epithet.description,
    }));

    const g1Count = selectedRaces.filter((r) => r.race.grade === 100).length;
    const g2Count = selectedRaces.filter((r) => r.race.grade === 200).length;
    const g3Count = selectedRaces.filter((r) => r.race.grade === 300).length;
    const g1Total = Math.round(GRADE_STATS[100] * RACE_BONUS) * g1Count;
    const g2Total = Math.round(GRADE_STATS[200] * RACE_BONUS) * g2Count;
    const g3Total = Math.round(GRADE_STATS[300] * RACE_BONUS) * g3Count;
    const raceBonusTotal = g1Total + g2Total + g3Total;
    const raceStats = {
      g1Count,
      g2Count,
      g3Count,
      g1Total,
      g2Total,
      g3Total,
      epithetBonus: epithetStatValue,
      total: raceBonusTotal + epithetStatValue,
    };

    return { skills, completedEpithets, raceStats };
  }, [selectedRaces]);

  const { skills, completedEpithets, raceStats } = rewardSummary;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-amber-500" />
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Rewards
        </h2>
      </div>

      <div className="space-y-3">
        {raceStats.total > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Random Stats
              </span>
              <div className="relative">
                <Info
                  className="w-3.5 h-3.5 text-slate-400 cursor-help"
                  onMouseEnter={() => setShowRaceTooltip(true)}
                  onMouseLeave={() => setShowRaceTooltip(false)}
                />
                {showRaceTooltip && (
                  <div className="absolute z-50 left-0 top-full mt-2 w-64 p-2 bg-slate-800 text-white text-xs rounded shadow-lg">
                    Reward values assume a 50% race bonus from support cards.
                    Does not include bonuses from cleat hammers.
                  </div>
                )}
              </div>
            </div>
            <div className="text-sm space-y-1">
              {raceStats.g1Count > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    G1 ×{raceStats.g1Count}
                  </span>
                  <span className="text-slate-500">+{raceStats.g1Total}</span>
                </div>
              )}
              {raceStats.g2Count > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    G2 ×{raceStats.g2Count}
                  </span>
                  <span className="text-slate-500">+{raceStats.g2Total}</span>
                </div>
              )}
              {raceStats.g3Count > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    G3 ×{raceStats.g3Count}
                  </span>
                  <span className="text-slate-500">+{raceStats.g3Total}</span>
                </div>
              )}
              {raceStats.epithetBonus > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Epithets
                  </span>
                  <span className="text-slate-500">
                    +{raceStats.epithetBonus}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-medium text-slate-800 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-600">
                <span>Total</span>
                <span>+{raceStats.total}</span>
              </div>
            </div>
          </div>
        )}

        {skills.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Skills
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {skills.map((skill) => (
                <div key={skill.id} className="flex justify-between text-sm">
                  <span className="text-slate-700 dark:text-slate-300">
                    {skill.name}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    +{skill.hints}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {completedEpithets.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-green-500" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Completed Epithets ({completedEpithets.length})
              </span>
            </div>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {completedEpithets
                .sort((a, b) => b.rank - a.rank)
                .map((epithet) => (
                  <EpithetItem
                    key={epithet.name_en_gl}
                    name={epithet.name_en_gl}
                    rank={epithet.rank}
                    description={epithet.description}
                    complete
                  />
                ))}
            </div>
          </div>
        )}

        {skills.length === 0 &&
          completedEpithets.length === 0 &&
          raceStats.total === 0 && (
            <div className="text-sm text-slate-400 dark:text-slate-500">
              No rewards yet
            </div>
          )}
      </div>
    </div>
  );
}
