import {
  epithetRequirements,
  isMet,
  type EpithetProgress,
  type SelectedRace,
} from "../data/epithetRequirements";
export { getDistanceCategory } from "../data/epithetRequirements";
export type {
  SelectedRace,
  EpithetProgress,
} from "../data/epithetRequirements";

export function calculateEpithetProgress(
  selectedRaces: SelectedRace[],
): EpithetProgress[] {
  const epithetResults = new Map<number, EpithetProgress>();

  for (const epithet of epithetRequirements) {
    let totalProgress = 0;
    let totalTarget = 0;
    const allMissing: string[] = [];
    let met = true;

    const result = epithet.check(selectedRaces);

    totalProgress += result.progress || 0;
    totalTarget += result.target || 0;
    allMissing.push(...(result.missing || []));

    if (!isMet(result)) {
      met = false;
    }

    const progress: EpithetProgress = {
      epithet,
      met,
      progress: totalProgress,
      target: totalTarget,
      missing: allMissing,
    };

    epithetResults.set(epithet.id, progress);
  }

  return Array.from(epithetResults.values());
}

export { epithetRequirements };
