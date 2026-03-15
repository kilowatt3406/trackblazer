import { useMemo } from "react";
import { usePlannerStore } from "@/store/planner";
import { skillNames } from "@/data/epithetRequirements";
import { calculateEpithetProgress } from "@/utils/epithetProgress";
import { Trophy, Star, BookOpen } from "lucide-react";
import { EpithetItem } from "./EpithetItem";

interface RewardSummary {
  totalStatValue: number;
  skills: { id: number; name: string; hints: number }[];
  completedEpithets: {
    name_en_gl: string;
    rank: 1 | 2 | 3;
    description?: string;
  }[];
}

export function RewardsBox() {
  const { getSelectedRaces } = usePlannerStore();
  const selectedRaces = getSelectedRaces();

  const rewardSummary = useMemo((): RewardSummary => {
    const selectedWithUra = selectedRaces.map((sr) => ({
      uraId: sr.uraId,
      race: sr.race,
      year: sr.year,
    }));

    const progressList = calculateEpithetProgress(selectedWithUra);

    const metEpithets = progressList.filter((p) => p.met);

    let totalStatValue = 0;
    const skillMap = new Map<number, number>();

    for (const { epithet } of metEpithets) {
      const rewards = epithet.rewards || [];

      for (const reward of rewards) {
        if (reward.t === "rs") {
          totalStatValue += parseInt(reward.v) * reward.d;
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

    return { totalStatValue, skills, completedEpithets };
  }, [selectedRaces]);

  const { totalStatValue, skills, completedEpithets } = rewardSummary;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-amber-500" />
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Rewards
        </h2>
      </div>

      <div className="space-y-3">
        {totalStatValue > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Total Stats
            </span>
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              +{totalStatValue}
            </span>
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

        {totalStatValue === 0 &&
          skills.length === 0 &&
          completedEpithets.length === 0 && (
            <div className="text-sm text-slate-400 dark:text-slate-500">
              No rewards yet
            </div>
          )}
      </div>
    </div>
  );
}
