import {
  epithetRequirements,
  isMet,
  type EpithetProgress,
  type SelectedRace,
} from "@/data/epithetRequirements";
export { getDistanceCategory } from "@/data/epithetRequirements";
export type { SelectedRace, EpithetProgress } from "@/data/epithetRequirements";

export function calculateEpithetProgress(
  selectedRaces: SelectedRace[],
): EpithetProgress[] {
  return epithetRequirements.map((epithet): EpithetProgress => {
    const result = epithet.check(selectedRaces);
    return {
      epithet,
      met: isMet(result),
      progress: result.progress || 0,
      target: result.target || 0,
      missing: result.missing || [],
    };
  });
}

export { epithetRequirements };
