import type { Race } from "@/types";

export interface SelectedRace {
  uraId: string;
  race: Race;
  year: number;
}

export interface EpithetProgress {
  epithet: EpithetDefinition;
  met: boolean;
  progress: number;
  target: number;
  missing: string[];
}

export interface Reward {
  t: "rs" | "sk";
  d: number;
  v: string;
}

export interface EpithetDefinition {
  id: number;
  name_en: string;
  name_en_gl: string;
  rank: 1 | 2 | 3;
  description?: string;
  rewards?: Reward[];
  check: EpithetMatcher;
}

// Skill name lookup
// Skill IDs: 200512 (Legendary), 201032 (Mile a Minute), 201672 (Dirt G1 Dominator)
export const skillNames: Record<number, string> = {
  200512: "Homestretch Haste",
  201032: "Mile Straightaways ○",
  201672: "Top Pick",
};

export function getDistanceCategory(distance: number): string {
  if (distance < 1600) return "short";
  if (distance < 2000) return "mile";
  if (distance < 2400) return "medium";
  return "long";
}

type EpithetMatcher = (races: SelectedRace[]) => Partial<EpithetProgress>;

export function isMet(result: Partial<EpithetProgress>): boolean {
  return (result.progress || 0) >= (result.target || 1);
}

function count(target: number, matchers: EpithetMatcher[]): EpithetMatcher {
  return (races) => {
    const init: Partial<EpithetProgress> = {
      progress: 0,
      target: target,
      missing: [],
    };
    const reduced = matchers.reduce((acc, m) => {
      const result = m(races);
      return {
        progress: acc.progress! + (isMet(result) ? 1 : 0),
        target: acc.target,
        missing: [...acc.missing!, ...result.missing!],
      };
    }, init);
    return reduced;
  };
}

function all(...matchers: EpithetMatcher[]): EpithetMatcher {
  return count(matchers.length, matchers);
  // return (races) => {
  //   const init: Partial<EpithetProgress> = {
  //     progress: 0,
  //     target: 0,
  //     missing: [],
  //   };
  //   return matchers.reduce((acc, m) => {
  //     const result = m(races);
  //     return {
  //       progress: acc.progress + result.progress,
  //       target: acc.target + result.target,
  //       missing: [...acc.missing, ...result.missing],
  //     };
  //   }, init);
  // };
}

function raceCount(target: number, ids: string[]): EpithetMatcher {
  return (races) => {
    const set = new Set(races.map((sr) => sr.uraId));
    const progress = ids.filter((id) => set.has(id)).length;
    const missing = ids.filter((id) => !set.has(id));
    return { progress, target, missing };
  };
}

const anyRace = (...ids: string[]) => raceCount(1, ids);
const allRaces = (...ids: string[]) => raceCount(ids.length, ids);

function epithetCount(
  target: number,
  epithets: EpithetDefinition[],
): EpithetMatcher {
  return (races) => {
    const met = new Map(
      epithets.map((e) => {
        const result = e.check(races);
        return [e, isMet(result)];
      }),
    );
    const progress = [...met.values()].filter(Boolean).length;
    const missing = [...met.entries()]
      .filter(([, v]) => v)
      .map(([e]) => e.name_en_gl);
    return { progress, target, missing };
  };
}

const anyEpithet = (...names: string[]) =>
  epithetCount(
    1,
    names.map((n) => epithetNameMap[n]),
  );

function trackCount(target: number, tracks: number[]): EpithetMatcher {
  return (races) => {
    const unique = new Map(
      races.map((sr) => [sr.race.banner_id, sr.race.track]),
    );
    const progress = [...unique.entries()].filter(([, track]) =>
      tracks.includes(track),
    ).length;
    return {
      target,
      progress,
      missing: [],
    };
  };
}

function matchCount(
  target: number,
  match: Partial<Race & { distanceCategory: string }>,
): EpithetMatcher {
  return (races) => {
    const init: Partial<EpithetProgress> = {
      progress: 0,
      target: target,
      missing: [],
    };
    return races.reduce((acc, sr) => {
      const race = {
        distanceCategory: getDistanceCategory(sr.race.distance),
        ...sr.race,
      };
      const isMatch = Object.keys(match).every(
        (k) => race[k as keyof Race] === match[k as keyof Race],
      );
      return {
        progress: acc.progress! + (isMatch ? 1 : 0),
        target: acc.target,
        missing: acc.missing,
      };
    }, init);
  };
}

function hasStandardCount(races: SelectedRace[], count: number) {
  let progress = 0;

  races.forEach((sr) => {
    const dist = sr.race.distance;
    if (dist % 400 === 0) {
      progress += 1;
    }
  });

  return { progress, target: count, missing: [] };
}

function hasNonStandardCount(races: SelectedRace[], count: number) {
  let progress = 0;

  races.forEach((sr) => {
    const dist = sr.race.distance;
    if (dist % 400 !== 0) {
      progress += 1;
    }
  });

  return { progress, target: count, missing: [] };
}

export const epithetRequirements: EpithetDefinition[] = [
  {
    id: 187,
    name_en: "Legendary Horsegirl",
    name_en_gl: "Legendary",
    rank: 3,
    description:
      "Obtain the Spring Champion and Fall Champion epithets, and either the Stunning or Lady epithet.",
    check: (races) =>
      all(
        anyEpithet("Spring Champion"),
        anyEpithet("Fall Champion"),
        anyEpithet("Stunning", "Lady"),
      )(races),
    rewards: [{ t: "sk", d: 200512, v: "+1" }],
  },
  {
    id: 188,
    name_en: "Divine Speed Miler",
    name_en_gl: "Mile a Minute",
    rank: 3,
    description:
      "Win the NHK Mile Cup, Oka Sho, Yasuda Kinen, Victoria Mile, and Mile Ch., and either Hanshin J.F. or Asahi Hai F.S.",
    check: all(
      anyRace("164"), // NHK Mile Cup
      anyRace("162"), // Oka Sho
      anyRace("73", "73_2"), // Yasuda Kinen
      anyRace("5"), // Victoria Mile
      anyRace("78", "78_2"), // Mile Championship
      anyRace("623", "624"), // Hanshin J.F. / Asahi Hai F.S.
    ),
    rewards: [{ t: "sk", d: 201032, v: "+1" }],
  },
  {
    id: 189,
    name_en: "Highspeed Miler",
    name_en_gl: "Breakneck Miler",
    rank: 3,
    description: "Win the NHK Mile Cup, Yasuda Kinen, and Mile Ch.",
    check: all(
      anyRace("164"), // NHK Mile Cup
      anyRace("73", "73_2"), // Yasuda Kinen
      anyRace("78", "78_2"), // Mile Championship
    ),
    rewards: [{ t: "rs", d: 2, v: "+15" }],
  },
  {
    id: 190,
    name_en: "Best Horsegirl",
    name_en_gl: "Phenomenal",
    rank: 3,
    description:
      "Get Stunning epithet & win 2: Tenno Sho (Spring/Autumn), Takarazuka Kinen, Japan Cup, Osaka Hai, Arima Kinen",
    check: (races) =>
      all(
        anyEpithet("Stunning"),
        count(2, [
          anyRace("4"), // Tenno Sho (Spring),
          anyRace("74", "74_2"), // Takarazuka Kinen
          anyRace("81", "81_2"), // Japan Cup
          anyRace("76", "76_2"), // Tenno Sho (Autumn)
          anyRace("3"), // Osaka Hai
          anyRace("81", "81_2"), // Arima Kinen
        ]),
      )(races),
    rewards: [{ t: "rs", d: 2, v: "+15" }],
  },
  {
    id: 191,
    name_en: "Wonderful Horsegirl",
    name_en_gl: "Incredible",
    rank: 3,
    description:
      "Obtain the Stunning epithet and win the Japan Cup (Classic Year) or Arima Kinen (Classic Year)",
    check: (races) =>
      all(
        anyEpithet("Stunning"),
        anyRace("79", "81"), // Japan Cup (Classic) / Arima Kinen (Classic)
      )(races),
    rewards: [{ t: "rs", d: 2, v: "+15" }],
  },
  {
    id: 192,
    name_en: "Charismatic Horsegirl",
    name_en_gl: "Stunning",
    rank: 2,
    description: "Win the Satsuki Sho, Japanese Derby, and Kikuka Sho",
    check: allRaces(
      "163", // Satsuki Sho
      "166", // Japanese Derby
      "168", // Kikuka Sho
    ),
    rewards: [{ t: "rs", d: 2, v: "+10" }],
  },
  {
    id: 193,
    name_en: "Virtuoso Sprinter",
    name_en_gl: "Sprint Go-Getter",
    rank: 2,
    description: "Win the Takamatsunomiya Kinen and Sprinters Stakes",
    check: all(
      anyRace("2"), // Takamatsunomiya Kinen
      anyRace("75", "75_2"), // Sprinters Stakes
    ),
    rewards: [{ t: "rs", d: 2, v: "+10" }],
  },
  {
    id: 194,
    name_en: "Dirt G1 Champion",
    name_en_gl: "Dirt G1 Dominator",
    rank: 3,
    description: "Win 9 G1 dirt races",
    check: matchCount(9, { grade: 100, terrain: 2 }),
    rewards: [{ t: "sk", d: 201672, v: "+1" }],
  },
  {
    id: 195,
    name_en: "Dirt G1 Sovereign",
    name_en_gl: "Dirt G1 Powerhouse",
    rank: 2,
    description: "Win 5 G1 dirt races",
    check: matchCount(5, { grade: 100, terrain: 2 }),
    rewards: [{ t: "rs", d: 2, v: "+15" }],
  },
  {
    id: 196,
    name_en: "Dirt G1 Monster",
    name_en_gl: "Dirt G1 Star",
    rank: 2,
    description: "Win 4 G1 dirt races",
    check: matchCount(4, { grade: 100, terrain: 2 }),
    rewards: [{ t: "rs", d: 2, v: "+10" }],
  },
  {
    id: 197,
    name_en: "Dirt G1 Braver",
    name_en_gl: "Dirt G1 Achiever",
    rank: 2,
    description: "Win 3 G1 dirt races",
    check: matchCount(3, { grade: 100, terrain: 2 }),
    rewards: [{ t: "rs", d: 2, v: "+10" }],
  },
  {
    id: 198,
    name_en: "Queen Horsegirl",
    name_en_gl: "Goddess",
    rank: 3,
    description:
      "Obtain the Lady epithet, win the Victoria Mile and Hanshin J.F., and win the Queen Elizabeth II Cup 2 times in a row",
    check: (races) =>
      all(
        anyEpithet("Lady"),
        anyRace("5"), // Victoria Mile
        anyRace("623"), // Hanshin J.F.
        allRaces("77", "77_2"), // QEII Cup
      )(races),
    rewards: [{ t: "rs", d: 2, v: "+15" }],
  },
  {
    id: 199,
    name_en: "Princess Horsegirl",
    name_en_gl: "Heroine",
    rank: 3,
    description:
      "Obtain the Lady epithet and win the Queen Elizabeth II Cup (Classic Year)",
    check: (races) =>
      all(
        anyEpithet("Lady"),
        anyRace("77"), // QEII Cup (Classic)
      )(races),
    rewards: [{ t: "rs", d: 2, v: "+10" }],
  },
  {
    id: 200,
    name_en: "Heroine",
    name_en_gl: "Lady",
    rank: 2,
    description: "Win the Oka Sho, Japanese Oaks, and Shuka Sho",
    check: allRaces("162", "165", "167"), // Triple Tiara
    rewards: [{ t: "rs", d: 2, v: "+10" }],
  },
  {
    id: 201,
    name_en: "Lightspeed Sprinter",
    name_en_gl: "Sprint Speedster",
    rank: 2,
    description:
      "Win the Takamatsunomiya Kinen, Sprinters Stakes, Yasuda Kinen, and Mile Ch.",
    check: all(
      anyRace("2"), // Takamatsunomiya Kinen
      anyRace("75", "75_2"), // Sprinters Stakes
      anyRace("73", "73_2"), // Yasuda Kinen
      anyRace("78", "78_2"), // Mile Championship
    ),
    rewards: [{ t: "rs", d: 2, v: "+15" }],
  },
  {
    id: 202,
    name_en: "Shield Champion",
    name_en_gl: "Shield Bearer",
    rank: 2,
    description: "Win the Tenno Sho (Spring) and Tenno Sho (Autumn)",
    check: all(
      anyRace("4"), // Tenno Sho (Spring)
      anyRace("76", "76_2"), // Tenno Sho (Autumn)
    ),
    rewards: [{ t: "rs", d: 2, v: "+10" }],
  },
  {
    id: 203,
    name_en: "Spring Champion",
    name_en_gl: "Spring Champion",
    rank: 2,
    description: "Win the Osaka Hai, Tenno Sho (Spring), and Takarazuka Kinen",
    check: allRaces(
      "3", // Osaka Hai
      "4", // Tenno Sho (Spring)
      "74_2", // Takarazuka Kinen (Senior)
    ),
    rewards: [{ t: "rs", d: 2, v: "+10" }],
  },
  {
    id: 204,
    name_en: "Autumn Champion",
    name_en_gl: "Fall Champion",
    rank: 2,
    description: "Win the Tenno Sho (Autumn), Japan Cup, and Arima Kinen",
    check: allRaces(
      "76_2", // Tenno Sho (Autumn) (Senior)
      "79_2", // Japan Cup (Senior)
      "81_2", // Arima Kinen (Senior)
    ),
    rewards: [{ t: "rs", d: 2, v: "+10" }],
  },
  {
    id: 205,
    name_en: "Dirt Master",
    name_en_gl: "Eat My Dust",
    rank: 3,
    description: "Win 15 dirt races",
    check: matchCount(15, { terrain: 2 }),
    rewards: [{ t: "rs", d: 2, v: "+10" }],
  },
  {
    id: 206,
    name_en: "Dirt Connoisseur",
    name_en_gl: "Playing Dirty",
    rank: 2,
    description: "Win 10 dirt races",
    check: matchCount(10, { terrain: 2 }),
    rewards: [{ t: "rs", d: 2, v: "+10" }],
  },
  {
    id: 207,
    name_en: "Dirt Adept",
    name_en_gl: "Dirty Work",
    rank: 2,
    description: "Win 5 dirt races",
    check: matchCount(5, { terrain: 2 }),
    rewards: [{ t: "rs", d: 2, v: "+5" }],
  },
  {
    id: 208,
    name_en: "Core Distance Champion",
    name_en_gl: "Standard Distance Leader",
    rank: 2,
    description: "Win 10 standard distance races",
    check: (races) => hasStandardCount(races, 10),
    rewards: [{ t: "rs", d: 2, v: "+10" }],
  },
  {
    id: 209,
    name_en: "Non-Core Distance Champion",
    name_en_gl: "Non-Standard Distance Leader",
    rank: 2,
    description: "Win 10 non-standard distance races",
    check: (races) => hasNonStandardCount(races, 10),
    rewards: [{ t: "rs", d: 2, v: "+10" }],
  },
  {
    id: 210,
    name_en: "Dirt Sprinter",
    name_en_gl: "Dirt Sprinter",
    rank: 2,
    description: "Win the JBC Sprint 2 times in a row",
    check: allRaces("1025", "1025_2"), // JBC Sprint
    rewards: [{ t: "rs", d: 2, v: "+10" }],
  },
  {
    id: 211,
    name_en: "Delicate Horsegirl",
    name_en_gl: "Umatastic",
    rank: 2,
    description: "Win 3 races that have Umamusume Stakes in the name",
    check(races) {
      const target = 3;
      const progress = races.filter((sr) =>
        sr.race.name_en.includes("Umamusume"),
      ).length;
      return {
        target,
        progress,
        missing: [],
      };
    },
    rewards: [{ t: "rs", d: 2, v: "+5" }],
  },
  {
    id: 212,
    name_en: "Dirt Rising Star",
    name_en_gl: "Kicking Up Dust",
    rank: 2,
    description: "Win the Unicorn Stakes, Leopard Stakes, and Japan Dirt Derby",
    check: allRaces(
      "189", // Unicorn Stakes
      "191", // Leopard Stakes
      "1023", // Japan Dirt Derby
    ),
    rewards: [{ t: "rs", d: 2, v: "+5" }],
  },
  {
    id: 213,
    name_en: "Ms. Worldwide",
    name_en_gl: "Globe-Trotter",
    rank: 2,
    description: "Win 3 races that have a country in the name",
    check: count(3, [
      anyRace("8"), // American JCC
      anyRace("79", "79_2"), // Japan Cup
      anyRace("90", "90_2"), // Copa Republica Argentina
      anyRace("165"), // Japanese Oaks
      anyRace("166"), // Japanese Derby
      anyRace("172"), // New Zealand Trophy
      anyRace("632"), // Saudi Arabia Royal Cup
      anyRace("1023"), // Japan Dirt Derby
    ]),
    rewards: [{ t: "rs", d: 2, v: "+5" }],
  },
  {
    id: 214,
    name_en: "Junior Horsegirl",
    name_en_gl: "Junior Jewel",
    rank: 2,
    description: "Win 3 races that have Junior Stakes in the name",
    check(races) {
      const target = 3;
      const progress = races.filter((sr) =>
        sr.race.name_en.includes("Junior Stakes"),
      ).length;
      return {
        target,
        progress,
        missing: [],
      };
    },
    rewards: [{ t: "rs", d: 2, v: "+5" }],
  },
  {
    id: 215,
    name_en: "Famous Horsegirl",
    name_en_gl: "Turf Tussler",
    rank: 2,
    description: "Win a turf sprint, mile, medium, and long race",
    check: all(
      matchCount(1, { terrain: 1, distanceCategory: "short" }),
      matchCount(1, { terrain: 1, distanceCategory: "mile" }),
      matchCount(1, { terrain: 1, distanceCategory: "medium" }),
      matchCount(1, { terrain: 1, distanceCategory: "long" }),
    ),
    rewards: [{ t: "rs", d: 2, v: "+5" }],
  },
  {
    id: 216,
    name_en: "Expert Horsegirl",
    name_en_gl: "Dirt Dancer",
    rank: 2,
    description: "Win a dirt sprint, mile, and medium race",
    check: all(
      matchCount(1, { terrain: 2, distanceCategory: "short" }),
      matchCount(1, { terrain: 2, distanceCategory: "mile" }),
      matchCount(1, { terrain: 2, distanceCategory: "medium" }),
    ),
    rewards: [{ t: "rs", d: 2, v: "+5" }],
  },
  {
    id: 217,
    name_en: "Veteran Horsegirl",
    name_en_gl: "Pro Racer",
    rank: 1,
    description: "Win 10 OP level or higher races",
    check(races) {
      const target = 10;
      const progress = races.filter((sr) => sr.race.grade < 400).length;
      return {
        target,
        progress,
        missing: [],
      };
    },
    rewards: [{ t: "rs", d: 2, v: "+5" }],
  },
  {
    id: 218,
    name_en: "Hokkaido Master",
    name_en_gl: "Hokkaido Hotshot",
    rank: 1,
    description: "Win 3 graded races held at Sapporo or Hakodate",
    check: trackCount(3, [
      10001, // Sapporo
      10002, // Hakodate
    ]),
    rewards: [{ t: "rs", d: 2, v: "+5" }],
  },
  {
    id: 219,
    name_en: "Tohoku Master",
    name_en_gl: "Tohoku Top Dog",
    rank: 1,
    description: "Win 3 graded races held at Fukushima or Niigata",
    check: trackCount(3, [
      10003, // Niigata
      10004, // Fukushima
    ]),
    rewards: [{ t: "rs", d: 2, v: "+5" }],
  },
  {
    id: 220,
    name_en: "Kanto Master",
    name_en_gl: "Kanto Conqueror",
    rank: 1,
    description: "Win 3 graded races held at Tokyo, Nakayama, or Oi",
    check: trackCount(3, [
      10005, // Nakayama
      10006, // Tokyo
      10101, // Oi
    ]),
    rewards: [{ t: "rs", d: 2, v: "+5" }],
  },
  {
    id: 221,
    name_en: "West Japan Master",
    name_en_gl: "West Japan Whiz",
    rank: 1,
    description: "Win 3 graded races held at Chukyo, Hanshin, or Kyoto",
    check: trackCount(3, [
      10007, // Chukyo
      10009, // Hanshin
      10008, // Kyoto
    ]),
    rewards: [{ t: "rs", d: 2, v: "+5" }],
  },
  {
    id: 222,
    name_en: "Kokura Master",
    name_en_gl: "Kokura Constable",
    rank: 1,
    description: "Win 2 graded races held at Kokura",
    check: trackCount(2, [
      10010, // Kokura
    ]),
    rewards: [{ t: "rs", d: 2, v: "+5" }],
  },
];

const epithetIdMap: Record<number, EpithetDefinition> = {};
const epithetNameMap: Record<string, EpithetDefinition> = {};
epithetRequirements.forEach((e) => {
  epithetIdMap[e.id] = e;
  epithetNameMap[e.name_en_gl] = e;
});

export function getEpithet(
  ident: string | number,
): EpithetDefinition | undefined {
  if (typeof ident === "string") return epithetNameMap[ident];
  if (typeof ident === "number") return epithetIdMap[ident];
  return undefined;
}
