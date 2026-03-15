import { Race, Turn } from '../types';
import racesData from '../../races.89f8ddb7.json';
import uraRacesData from '../../ura-races.eb136000.json';
import nicknamesData from '../../nicknames.71b3472b.json';

const races: Race[] = racesData as Race[];
const uraRaces: any[] = uraRacesData;
const nicknames: any[] = nicknamesData;

const g123Races = races.filter(r => 
  [100, 200, 300].includes(r.grade) && 
  r.name_en &&
  r.terrain
);

const raceMap = new Map<number, Race>();
g123Races.forEach(r => raceMap.set(r.id, r));

function getYearMonthHalfFromTurn(turn: number): { year: 1 | 2 | 3; month: number; half: number } {
  const year = Math.floor((turn - 1) / 24) + 1 as 1 | 2 | 3;
  const monthTurn = ((turn - 1) % 24);
  const month = Math.floor(monthTurn / 2) + 1;
  const half = (monthTurn % 2) + 1;
  return { year, month, half };
}

const turns: Turn[] = [];

for (let turn = 1; turn <= 72; turn++) {
  const { year, month, half } = getYearMonthHalfFromTurn(turn);
  
  const availableRaceIds = uraRaces
    .filter(ur => ur.year === year && ur.month === month && ur.half === half)
    .map(ur => ur.instance)
    .filter(id => raceMap.has(id));
  
  const availableRaces = availableRaceIds
    .map(id => raceMap.get(id)!)
    .filter(Boolean);

  turns.push({
    year,
    month,
    half,
    turn,
    availableRaces,
    selectedRaceIds: [],
  });
}

const trailblazerEpithets = nicknames
  .filter(n => n.scenario === 4)
  .map(n => ({
    id: n.id,
    name_en: n.name_en,
    name_en_gl: n.name_en_gl,
    name_jp: n.name_jp,
    rank: n.rank as 1 | 2 | 3,
    scenario: n.scenario,
    desc_en: Array.isArray(n.desc_en) ? n.desc_en : [n.desc_en],
    desc_en_gl: n.desc_en_gl,
    disp_order: n.disp_order,
    char: n.char,
  }))
  .sort((a, b) => a.disp_order - b.disp_order);

export { turns, trailblazerEpithets, g123Races };
