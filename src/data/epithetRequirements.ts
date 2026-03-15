export type RequirementType = 
  | 'named_races'
  | 'race_count'
  | 'g1_count'
  | 'terrain_distances'
  | 'track'
  | 'consecutive'
  | 'epithet_dep'
  | 'year_race';

export interface Reward {
  t: 'rs' | 'sk';
  d: number;
  v: string;
}

export interface EpithetRequirement {
  type: RequirementType;
  uraIds?: string[];
  count?: number;
  terrain?: 1 | 2;
  grade?: 100 | 200 | 300 | 400;
  minDist?: number;
  maxDist?: number;
  tracks?: number[];
  consecutiveUraIds?: string[];
  consecutiveCount?: number;
  requiredEpithetIds?: number[];
  requiredYear?: 1 | 2 | 3;
  requirements?: { terrain: 1 | 2; distCategory: string }[];
}

export interface EpithetDefinition {
  id: number;
  name_en: string;
  name_en_gl: string;
  rank: 1 | 2 | 3;
  requirements: EpithetRequirement[];
  rewards?: Reward[];
}

// Skill name lookup
// Skill IDs: 200512 (Legendary), 201032 (Mile a Minute), 201672 (Dirt G1 Dominator)
export const skillNames: Record<number, string> = {
  200512: 'Homestretch Haste',
  201032: 'Mile Straightaways ○',
  201672: 'Top Pick',
};

export function getRewardsForEpithet(name_en_gl: string): Reward[] {
  const epithet = epithetRequirements.find(e => e.name_en_gl === name_en_gl);
  return epithet?.rewards || [];
}

export const epithetRequirements: EpithetDefinition[] = [
  {
    id: 188,
    name_en: 'Divine Speed Miler',
    name_en_gl: 'Mile a Minute',
    rank: 3,
    requirements: [
      { type: 'named_races', uraIds: ['164'] },
      { type: 'named_races', uraIds: ['162'] },
      { type: 'named_races', uraIds: ['73', '73_2'] },
      { type: 'named_races', uraIds: ['5'] },
      { type: 'named_races', uraIds: ['78', '78_2'] },
      { type: 'named_races', uraIds: ['102001'] },
    ],
    rewards: [{ t: 'sk', d: 201032, v: '+1' }],
  },
  {
    id: 189,
    name_en: 'Highspeed Miler',
    name_en_gl: 'Breakneck Miler',
    rank: 3,
    requirements: [
      { type: 'named_races', uraIds: ['164'] },
      { type: 'named_races', uraIds: ['73', '73_2'] },
      { type: 'named_races', uraIds: ['78', '78_2'] },
    ],
    rewards: [{ t: 'rs', d: 2, v: '+15' }],
  },
  {
    id: 192,
    name_en: 'Charismatic Horsegirl',
    name_en_gl: 'Stunning',
    rank: 2,
    requirements: [
      { type: 'named_races', uraIds: ['163'] },
      { type: 'named_races', uraIds: ['166'] },
      { type: 'named_races', uraIds: ['168'] },
    ],
    rewards: [{ t: 'rs', d: 2, v: '+10' }],
  },
  {
    id: 193,
    name_en: 'Virtuoso Sprinter',
    name_en_gl: 'Sprint Go-Getter',
    rank: 2,
    requirements: [
      { type: 'named_races', uraIds: ['2'] },
      { type: 'named_races', uraIds: ['75', '75_2'] },
    ],
    rewards: [{ t: 'rs', d: 2, v: '+10' }],
  },
  {
    id: 194,
    name_en: 'Dirt G1 Champion',
    name_en_gl: 'Dirt G1 Dominator',
    rank: 3,
    requirements: [
      { type: 'g1_count', terrain: 2, count: 9 }
    ],
    rewards: [{ t: 'sk', d: 201672, v: '+1' }],
  },
  {
    id: 195,
    name_en: 'Dirt G1 Sovereign',
    name_en_gl: 'Dirt G1 Powerhouse',
    rank: 2,
    requirements: [
      { type: 'g1_count', terrain: 2, count: 5 }
    ],
    rewards: [{ t: 'rs', d: 2, v: '+15' }],
  },
  {
    id: 196,
    name_en: 'Dirt G1 Monster',
    name_en_gl: 'Dirt G1 Star',
    rank: 2,
    requirements: [
      { type: 'g1_count', terrain: 2, count: 4 }
    ],
    rewards: [{ t: 'rs', d: 2, v: '+10' }],
  },
  {
    id: 197,
    name_en: 'Dirt G1 Braver',
    name_en_gl: 'Dirt G1 Achiever',
    rank: 2,
    requirements: [
      { type: 'g1_count', terrain: 2, count: 3 }
    ],
    rewards: [{ t: 'rs', d: 2, v: '+10' }],
  },
  {
    id: 198,
    name_en: 'Queen Horsegirl',
    name_en_gl: 'Goddess',
    rank: 3,
    requirements: [
      { type: 'epithet_dep', requiredEpithetIds: [200], count: 1 },
      { type: 'named_races', uraIds: ['5'] },
      { type: 'named_races', uraIds: ['102001'] },
      { type: 'consecutive', consecutiveUraIds: ['77', '77_2'], consecutiveCount: 2 },
    ],
    rewards: [{ t: 'rs', d: 2, v: '+15' }],
  },
  {
    id: 199,
    name_en: 'Princess Horsegirl',
    name_en_gl: 'Heroine',
    rank: 3,
    requirements: [
      { type: 'epithet_dep', requiredEpithetIds: [200], count: 1 },
      { type: 'year_race', uraIds: ['77'], requiredYear: 2 },
    ],
    rewards: [{ t: 'rs', d: 2, v: '+10' }],
  },
  {
    id: 200,
    name_en: 'Heroine',
    name_en_gl: 'Lady',
    rank: 2,
    requirements: [
      { type: 'named_races', uraIds: ['162'] },
      { type: 'named_races', uraIds: ['165'] },
      { type: 'named_races', uraIds: ['167'] },
    ],
    rewards: [{ t: 'rs', d: 2, v: '+10' }],
  },
  {
    id: 201,
    name_en: 'Lightspeed Sprinter',
    name_en_gl: 'Sprint Speedster',
    rank: 2,
    requirements: [
      { type: 'named_races', uraIds: ['2'] },
      { type: 'named_races', uraIds: ['75', '75_2'] },
      { type: 'named_races', uraIds: ['73', '73_2'] },
      { type: 'named_races', uraIds: ['78', '78_2'] },
    ],
    rewards: [{ t: 'rs', d: 2, v: '+15' }],
  },
  {
    id: 202,
    name_en: 'Shield Champion',
    name_en_gl: 'Shield Bearer',
    rank: 2,
    requirements: [
      { type: 'named_races', uraIds: ['4'] },
      { type: 'named_races', uraIds: ['76', '76_2'] },
    ],
    rewards: [{ t: 'rs', d: 2, v: '+10' }],
  },
  {
    id: 203,
    name_en: 'Spring Champion',
    name_en_gl: 'Spring Champion',
    rank: 2,
    requirements: [
      { type: 'named_races', uraIds: ['3'] },
      { type: 'named_races', uraIds: ['4'] },
      { type: 'named_races', uraIds: ['74', '74_2'] },
    ],
    rewards: [{ t: 'rs', d: 2, v: '+10' }],
  },
  {
    id: 204,
    name_en: 'Autumn Champion',
    name_en_gl: 'Fall Champion',
    rank: 2,
    requirements: [
      { type: 'named_races', uraIds: ['76', '76_2'] },
      { type: 'named_races', uraIds: ['79', '79_2'] },
      { type: 'named_races', uraIds: ['81', '81_2'] },
    ],
    rewards: [{ t: 'rs', d: 2, v: '+10' }],
  },
  {
    id: 205,
    name_en: 'Dirt Master',
    name_en_gl: 'Eat My Dust',
    rank: 3,
    requirements: [
      { type: 'race_count', terrain: 2, count: 15 }
    ],
    rewards: [{ t: 'rs', d: 2, v: '+10' }],
  },
  {
    id: 206,
    name_en: 'Dirt Connoisseur',
    name_en_gl: 'Playing Dirty',
    rank: 2,
    requirements: [
      { type: 'race_count', terrain: 2, count: 10 }
    ],
    rewards: [{ t: 'rs', d: 2, v: '+10' }],
  },
  {
    id: 207,
    name_en: 'Dirt Adept',
    name_en_gl: 'Dirty Work',
    rank: 2,
    requirements: [
      { type: 'race_count', terrain: 2, count: 5 }
    ],
    rewards: [{ t: 'rs', d: 2, v: '+5' }],
  },
  {
    id: 208,
    name_en: 'Core Distance Champion',
    name_en_gl: 'Standard Distance Leader',
    rank: 2,
    requirements: [
      { type: 'race_count', minDist: 2000, maxDist: 2400, count: 10 }
    ],
    rewards: [{ t: 'rs', d: 2, v: '+10' }],
  },
  {
    id: 209,
    name_en: 'Non-Core Distance Champion',
    name_en_gl: 'Non-Standard Distance Leader',
    rank: 2,
    requirements: [
      { type: 'race_count', maxDist: 1999, count: 10 },
      { type: 'race_count', minDist: 2401, count: 10 }
    ],
    rewards: [{ t: 'rs', d: 2, v: '+10' }],
  },
  {
    id: 210,
    name_en: 'Dirt Sprinter',
    name_en_gl: 'Dirt Sprinter',
    rank: 2,
    requirements: [
      { type: 'consecutive', consecutiveUraIds: ['1025', '1025_2'], consecutiveCount: 2 }
    ],
    rewards: [{ t: 'rs', d: 2, v: '+10' }],
  },
  {
    id: 211,
    name_en: 'Delicate Horsegirl',
    name_en_gl: 'Umatastic',
    rank: 2,
    requirements: [
      { type: 'race_count', count: 3 }
    ],
    rewards: [{ t: 'rs', d: 2, v: '+5' }],
  },
  {
    id: 212,
    name_en: 'Dirt Rising Star',
    name_en_gl: 'Kicking Up Dust',
    rank: 2,
    requirements: [
      { type: 'named_races', uraIds: ['189'] },
      { type: 'named_races', uraIds: ['191'] },
      { type: 'named_races', uraIds: ['1023'] },
    ],
    rewards: [{ t: 'rs', d: 2, v: '+5' }],
  },
  {
    id: 213,
    name_en: 'Ms. Worldwide',
    name_en_gl: 'Globe-Trotter',
    rank: 2,
    requirements: [
      { type: 'race_count', count: 3 }
    ],
    rewards: [{ t: 'rs', d: 2, v: '+5' }],
  },
  {
    id: 214,
    name_en: 'Junior Horsegirl',
    name_en_gl: 'Junior Jewel',
    rank: 2,
    requirements: [
      { type: 'race_count', count: 3 }
    ],
    rewards: [{ t: 'rs', d: 2, v: '+5' }],
  },
  {
    id: 215,
    name_en: 'Famous Horsegirl',
    name_en_gl: 'Turf Tussler',
    rank: 2,
    requirements: [
      { type: 'terrain_distances', requirements: [
        { terrain: 1, distCategory: 'short' },
        { terrain: 1, distCategory: 'mile' },
        { terrain: 1, distCategory: 'medium' },
        { terrain: 1, distCategory: 'long' },
      ]}
    ],
    rewards: [{ t: 'rs', d: 2, v: '+5' }],
  },
  {
    id: 216,
    name_en: 'Expert Horsegirl',
    name_en_gl: 'Dirt Dancer',
    rank: 2,
    requirements: [
      { type: 'terrain_distances', requirements: [
        { terrain: 2, distCategory: 'short' },
        { terrain: 2, distCategory: 'mile' },
        { terrain: 2, distCategory: 'medium' },
      ]}
    ],
    rewards: [{ t: 'rs', d: 2, v: '+5' }],
  },
  {
    id: 217,
    name_en: 'Veteran Horsegirl',
    name_en_gl: 'Pro Racer',
    rank: 1,
    requirements: [
      { type: 'race_count', grade: 400, count: 10 }
    ],
    rewards: [{ t: 'rs', d: 2, v: '+5' }],
  },
  {
    id: 218,
    name_en: 'Hokkaido Master',
    name_en_gl: 'Hokkaido Hotshot',
    rank: 1,
    requirements: [
      { type: 'track', tracks: [102, 103], count: 3 }
    ],
    rewards: [{ t: 'rs', d: 2, v: '+5' }],
  },
  {
    id: 219,
    name_en: 'Tohoku Master',
    name_en_gl: 'Tohoku Top Dog',
    rank: 1,
    requirements: [
      { type: 'track', tracks: [104, 105], count: 3 }
    ],
    rewards: [{ t: 'rs', d: 2, v: '+5' }],
  },
  {
    id: 220,
    name_en: 'Kanto Master',
    name_en_gl: 'Kanto Conqueror',
    rank: 1,
    requirements: [
      { type: 'track', tracks: [101, 103, 106], count: 3 }
    ],
    rewards: [{ t: 'rs', d: 2, v: '+5' }],
  },
  {
    id: 221,
    name_en: 'West Japan Master',
    name_en_gl: 'West Japan Whiz',
    rank: 1,
    requirements: [
      { type: 'track', tracks: [107, 108, 109], count: 3 }
    ],
    rewards: [{ t: 'rs', d: 2, v: '+5' }],
  },
  {
    id: 222,
    name_en: 'Kokura Master',
    name_en_gl: 'Kokura Constable',
    rank: 1,
    requirements: [
      { type: 'track', tracks: [110], count: 2 }
    ],
    rewards: [{ t: 'rs', d: 2, v: '+5' }],
  },
  {
    id: 187,
    name_en: 'Legendary Horsegirl',
    name_en_gl: 'Legendary',
    rank: 3,
    requirements: [
      { type: 'epithet_dep', requiredEpithetIds: [203], count: 1 },
      { type: 'epithet_dep', requiredEpithetIds: [204], count: 1 },
      { type: 'epithet_dep', requiredEpithetIds: [192, 200], count: 1 },
    ],
    rewards: [{ t: 'sk', d: 200512, v: '+1' }],
  },
  {
    id: 190,
    name_en: 'Best Horsegirl',
    name_en_gl: 'Leading the Charge',
    rank: 3,
    requirements: [
      { type: 'epithet_dep', requiredEpithetIds: [192], count: 1 },
      { type: 'named_races', uraIds: ['76', '76_2', '74', '74_2', '79', '79_2', '3', '81', '81_2'] },
    ],
    rewards: [{ t: 'rs', d: 2, v: '+15' }],
  },
  {
    id: 191,
    name_en: 'Wonderful Horsegirl',
    name_en_gl: 'Product Power',
    rank: 3,
    requirements: [
      { type: 'epithet_dep', requiredEpithetIds: [192], count: 1 },
      { type: 'year_race', uraIds: ['79', '81'], requiredYear: 2 },
    ],
    rewards: [{ t: 'rs', d: 2, v: '+15' }],
  },
];

export const epithetIdMap: Record<number, EpithetDefinition> = {};
epithetRequirements.forEach(e => {
  epithetIdMap[e.id] = e;
});
