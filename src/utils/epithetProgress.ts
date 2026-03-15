import { epithetRequirements, EpithetDefinition, EpithetRequirement } from '../data/epithetRequirements';
import { Race } from '../types';

interface SelectedRace {
  uraId: string;
  race: Race;
  year: number;
}

interface EpithetProgress {
  epithet: EpithetDefinition;
  met: boolean;
  progress: number;
  target: number;
  missing: string[];
}

function getDistanceCategory(distance: number): string {
  if (distance < 1600) return 'short';
  if (distance < 2000) return 'mile';
  if (distance < 2400) return 'medium';
  return 'long';
}

function getUraIdToRaceMap(selectedRaces: SelectedRace[]): Map<string, SelectedRace> {
  const map = new Map<string, SelectedRace>();
  selectedRaces.forEach(sr => {
    map.set(sr.uraId, sr);
  });
  return map;
}

function checkNamedRaces(req: EpithetRequirement, uraMap: Map<string, SelectedRace>): { progress: number; target: number; missing: string[] } {
  const required = req.uraIds || [];
  let progress = 0;
  const missing: string[] = [];
  
  // Each requirement is a group - you need at least one race from each group
  const hasAny = required.some(uraId => uraMap.has(uraId));
  if (hasAny) {
    progress = 1;
  } else {
    required.forEach(uraId => missing.push(uraId));
  }
  
  return { progress, target: 1, missing };
}

function checkRaceCount(req: EpithetRequirement, selectedRaces: SelectedRace[]): { progress: number; target: number } {
  const target = req.count || 1;
  let progress = 0;
  
  selectedRaces.forEach(sr => {
    const race = sr.race;
    let matches = true;
    
    if (req.terrain && race.terrain !== req.terrain) matches = false;
    if (req.grade && race.grade !== req.grade) matches = false;
    if (req.minDist && race.distance < req.minDist) matches = false;
    if (req.maxDist && race.distance > req.maxDist) matches = false;
    
    if (matches) progress++;
  });
  
  return { progress, target };
}

function checkG1Count(req: EpithetRequirement, selectedRaces: SelectedRace[]): { progress: number; target: number } {
  const target = req.count || 1;
  let progress = 0;
  
  selectedRaces.forEach(sr => {
    const race = sr.race;
    if (race.grade === 100 && (!req.terrain || race.terrain === req.terrain)) {
      progress++;
    }
  });
  
  return { progress, target };
}

function checkTerrainDistances(req: EpithetRequirement, selectedRaces: SelectedRace[]): { progress: number; target: number; missing: string[] } {
  const requirements = req.requirements || [];
  const target = requirements.length;
  let progress = 0;
  const missing: string[] = [];
  
  requirements.forEach(reqTd => {
    const has = selectedRaces.some(sr => {
      const race = sr.race;
      return race.terrain === reqTd.terrain && 
             getDistanceCategory(race.distance) === reqTd.distCategory;
    });
    if (has) {
      progress++;
    } else {
      const terrainLabel = reqTd.terrain === 1 ? 'Turf' : 'Dirt';
      missing.push(`${terrainLabel} ${reqTd.distCategory}`);
    }
  });
  
  return { progress, target, missing };
}

function checkTrack(req: EpithetRequirement, selectedRaces: SelectedRace[]): { progress: number; target: number } {
  const target = req.count || 1;
  const tracks = req.tracks || [];
  let progress = 0;
  
  selectedRaces.forEach(sr => {
    if (tracks.includes(sr.race.track)) {
      progress++;
    }
  });
  
  return { progress, target };
}

function checkConsecutive(req: EpithetRequirement, selectedRaces: SelectedRace[]): { progress: number; target: number } {
  const consecutiveUraIds = req.consecutiveUraIds || [];
  const target = req.consecutiveCount || 2;
  
  const selectedUraIds = new Set(selectedRaces.map(sr => sr.uraId));
  
  let consecutiveWins = 0;
  let maxConsecutive = 0;
  
  for (const uraId of consecutiveUraIds) {
    if (selectedUraIds.has(uraId)) {
      consecutiveWins++;
      maxConsecutive = Math.max(maxConsecutive, consecutiveWins);
    } else {
      consecutiveWins = 0;
    }
  }
  
  const progress = Math.min(maxConsecutive, target);
  return { progress, target };
}

function checkEpithetDep(req: EpithetRequirement, epithetResults: Map<number, EpithetProgress>): { progress: number; target: number; missing: string[] } {
  const required = req.requiredEpithetIds || [];
  const target = req.count || required.length;
  let progress = 0;
  const missing: string[] = [];
  
  required.forEach(epithetId => {
    const result = epithetResults.get(epithetId);
    if (result && result.met) {
      progress++;
    } else {
      const epithet = epithetRequirements.find(e => e.id === epithetId);
      missing.push(epithet?.name_en_gl || `epithet ${epithetId}`);
    }
  });
  
  return { progress, target, missing };
}

function checkYearRace(req: EpithetRequirement, selectedRaces: SelectedRace[]): { progress: number; target: number; missing: string[] } {
  const requiredUraIds = req.uraIds || [];
  const requiredYear = req.requiredYear;
  let progress = 0;
  const missing: string[] = [];
  
  requiredUraIds.forEach(uraId => {
    const race = selectedRaces.find(sr => sr.uraId === uraId);
    if (race && race.year === requiredYear) {
      progress++;
    } else if (race) {
      missing.push(`${uraId} (wrong year)`);
    } else {
      missing.push(uraId);
    }
  });
  
  return { progress, target: requiredUraIds.length, missing };
}

export function calculateEpithetProgress(
  selectedRaces: SelectedRace[]
): EpithetProgress[] {
  const uraMap = getUraIdToRaceMap(selectedRaces);
  const epithetResults = new Map<number, EpithetProgress>();
  
  // First pass: calculate all non-epithet_dep requirements
  for (const epithet of epithetRequirements) {
    let totalProgress = 0;
    let totalTarget = 0;
    const allMissing: string[] = [];
    let met = true;
    
    // Only handle non-dependency requirements in first pass
    for (const req of epithet.requirements) {
      if (req.type === 'epithet_dep') continue;
      
      let result: { progress: number; target: number; missing: string[] };
      
      switch (req.type) {
        case 'named_races':
          result = checkNamedRaces(req, uraMap);
          break;
        case 'race_count':
          result = { ...checkRaceCount(req, selectedRaces), missing: [] };
          break;
        case 'g1_count':
          result = { ...checkG1Count(req, selectedRaces), missing: [] };
          break;
        case 'terrain_distances':
          result = checkTerrainDistances(req, selectedRaces);
          break;
        case 'track':
          result = { ...checkTrack(req, selectedRaces), missing: [] };
          break;
        case 'consecutive':
          result = { ...checkConsecutive(req, selectedRaces), missing: [] };
          break;
        case 'year_race':
          result = checkYearRace(req, selectedRaces);
          break;
        default:
          result = { progress: 0, target: 0, missing: [] };
      }
      
      totalProgress += result.progress;
      totalTarget += result.target;
      allMissing.push(...result.missing);
      
      if (result.progress < result.target) {
        met = false;
      }
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
  
  // Second pass: calculate epithet_dep requirements using results from first pass
  for (const epithet of epithetRequirements) {
    const current = epithetResults.get(epithet.id)!;
    
    for (const req of epithet.requirements) {
      if (req.type !== 'epithet_dep') continue;
      
      const result = checkEpithetDep(req, epithetResults);
      
      current.progress += result.progress;
      current.target += result.target;
      current.missing.push(...result.missing);
      
      if (result.progress < result.target) {
        current.met = false;
      }
    }
  }
  
  return Array.from(epithetResults.values());
}

export { epithetRequirements };
