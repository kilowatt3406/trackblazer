import { describe, it, expect } from "vitest";
import { getEpithet, type SelectedRace } from "../data/epithetRequirements";
import { Race } from "../types";

const createRace = (overrides: Partial<Race> = {}): Race => ({
  id: 100001,
  banner_id: 1001,
  race_id: 1001,
  name_en: "Test Race",
  name_jp: "テストレース",
  name_ko: "테스트레이스",
  name_tw: "測試賽馬",
  grade: 100,
  terrain: 1,
  direction: 1,
  distance: 1600,
  entries: 16,
  group: 1,
  season: 1,
  time: 1,
  track: 101,
  course: 1,
  course_id: 10101,
  factor: { effect_1: "test", effect_2: "speed" },
  list_ura: [],
  url_name: "test-race",
  ...overrides,
});

const createSelectedRace = (uraId: string, race: Race, year: number = 2) => ({
  uraId,
  race,
  year,
});

const checkEpithet = (name: string, races: SelectedRace[]) => {
  const epithet = getEpithet(name);
  if (!epithet) return undefined;

  expect(epithet.check).toBeTypeOf("function");
  const result = epithet.check(races);
  expect(result).toBeTypeOf("object");

  const met = (result.progress || 0) >= (result.target || 1);
  return { ...result, epithet, met };
};

describe("Epithet Progress Calculation", () => {
  describe("Heroine", () => {
    it("should not trigger on QEII senior", () => {
      const selectedRaces = [
        createSelectedRace("162", createRace({})),
        createSelectedRace("165", createRace({})),
        createSelectedRace("167", createRace({})),
        createSelectedRace("77_2", createRace({})),
      ];

      const epithet = checkEpithet("Heroine", selectedRaces);

      expect(epithet).toBeDefined();
      expect(epithet!.met).toBe(false);
    });

    it("should not trigger on missing lady", () => {
      const selectedRaces = [
        createSelectedRace("162", createRace({})),
        createSelectedRace("165", createRace({})),
        createSelectedRace("77", createRace({})),
      ];

      const epithet = checkEpithet("Heroine", selectedRaces);

      expect(epithet).toBeDefined();
      expect(epithet!.met).toBe(false);
    });

    it("should trigger when complete", () => {
      const selectedRaces = [
        createSelectedRace("162", createRace({})),
        createSelectedRace("165", createRace({})),
        createSelectedRace("167", createRace({})),
        createSelectedRace("77", createRace({})),
      ];

      const epithet = checkEpithet("Heroine", selectedRaces);

      expect(epithet).toBeDefined();
      expect(epithet!.met).toBe(true);
    });
  });

  describe("Goddess", () => {
    it("should not trigger on missing one QEII", () => {
      const selectedRaces = [
        createSelectedRace("162", createRace({})),
        createSelectedRace("165", createRace({})),
        createSelectedRace("167", createRace({})),
        createSelectedRace("5", createRace({})),
        createSelectedRace("623", createRace({})),
        createSelectedRace("77_2", createRace({})),
      ];

      const epithet = checkEpithet("Goddess", selectedRaces);

      expect(epithet).toBeDefined();
      expect(epithet!.met).toBe(false);
    });

    it("should not trigger on missing lady", () => {
      const selectedRaces = [
        createSelectedRace("162", createRace({})),
        createSelectedRace("165", createRace({})),
        createSelectedRace("5", createRace({})),
        createSelectedRace("623", createRace({})),
        createSelectedRace("77", createRace({})),
        createSelectedRace("77_2", createRace({})),
      ];

      const epithet = checkEpithet("Goddess", selectedRaces);

      expect(epithet).toBeDefined();
      expect(epithet!.met).toBe(false);
    });

    it("should trigger when complete", () => {
      const selectedRaces = [
        createSelectedRace("162", createRace({})),
        createSelectedRace("165", createRace({})),
        createSelectedRace("167", createRace({})),
        createSelectedRace("5", createRace({})),
        createSelectedRace("623", createRace({})),
        createSelectedRace("77", createRace({})),
        createSelectedRace("77_2", createRace({})),
      ];

      const epithet = checkEpithet("Goddess", selectedRaces);

      expect(epithet).toBeDefined();
      expect(epithet!.met).toBe(true);
    });
  });

  describe("Mile a Minute", () => {
    it("should not trigger when incomplete", () => {
      const selectedRaces = [
        createSelectedRace("164", createRace({})),
        createSelectedRace("162", createRace({})),
        createSelectedRace("5", createRace({})),
      ];

      const epithet = checkEpithet("Mile a Minute", selectedRaces);

      expect(epithet).toBeDefined();
      expect(epithet!.met).toBe(false);
    });

    it("should trigger on hanshin jf", () => {
      const selectedRaces = [
        createSelectedRace("164", createRace({})),
        createSelectedRace("162", createRace({})),
        createSelectedRace("73_2", createRace({})),
        createSelectedRace("5", createRace({})),
        createSelectedRace("78", createRace({})),
        createSelectedRace("623", createRace({})),
      ];

      const epithet = checkEpithet("Mile a Minute", selectedRaces);

      expect(epithet).toBeDefined();
      expect(epithet!.met).toBe(true);
    });

    it("should trigger on asahi hai", () => {
      const selectedRaces = [
        createSelectedRace("164", createRace({})),
        createSelectedRace("162", createRace({})),
        createSelectedRace("73", createRace({})),
        createSelectedRace("5", createRace({})),
        createSelectedRace("78_2", createRace({})),
        createSelectedRace("624", createRace({})),
      ];

      const epithet = checkEpithet("Mile a Minute", selectedRaces);

      expect(epithet).toBeDefined();
      expect(epithet!.met).toBe(true);
    });
  });

  describe("Dirt G1 Star", () => {
    it("should not trigger on turf races", () => {
      const selectedRaces = [
        createSelectedRace("1", createRace({ grade: 100, terrain: 1 })),
        createSelectedRace("2", createRace({ grade: 100, terrain: 2 })),
        createSelectedRace("3", createRace({ grade: 100, terrain: 2 })),
        createSelectedRace("4", createRace({ grade: 100, terrain: 2 })),
      ];

      const epithet = checkEpithet("Dirt G1 Star", selectedRaces);

      expect(epithet).toBeDefined();
      expect(epithet!.met).toBe(false);
    });

    it("should not trigger on too few races", () => {
      const selectedRaces = [
        createSelectedRace("1", createRace({ grade: 100, terrain: 2 })),
        createSelectedRace("2", createRace({ grade: 100, terrain: 2 })),
        createSelectedRace("3", createRace({ grade: 100, terrain: 2 })),
      ];

      const epithet = checkEpithet("Dirt G1 Star", selectedRaces);

      expect(epithet).toBeDefined();
      expect(epithet!.met).toBe(false);
    });

    it("should not trigger on too low grade", () => {
      const selectedRaces = [
        createSelectedRace("1", createRace({ grade: 200, terrain: 2 })),
        createSelectedRace("2", createRace({ grade: 100, terrain: 2 })),
        createSelectedRace("3", createRace({ grade: 100, terrain: 2 })),
        createSelectedRace("4", createRace({ grade: 100, terrain: 2 })),
      ];

      const epithet = checkEpithet("Dirt G1 Star", selectedRaces);

      expect(epithet).toBeDefined();
      expect(epithet!.met).toBe(false);
    });

    it("should trigger when complete", () => {
      const selectedRaces = [
        createSelectedRace("1", createRace({ grade: 100, terrain: 2 })),
        createSelectedRace("2", createRace({ grade: 100, terrain: 2 })),
        createSelectedRace("3", createRace({ grade: 100, terrain: 2 })),
        createSelectedRace("4", createRace({ grade: 100, terrain: 2 })),
      ];

      const epithet = checkEpithet("Dirt G1 Star", selectedRaces);

      expect(epithet).toBeDefined();
      expect(epithet!.met).toBe(true);
    });
  });

  describe("Standard Distance Leader", () => {
    it("should not trigger on invalid race", () => {
      const selectedRaces = [
        createSelectedRace("1", createRace({ distance: 2200 })),
        createSelectedRace("2", createRace({ distance: 1200 })),
        createSelectedRace("3", createRace({ distance: 2400 })),
        createSelectedRace("4", createRace({ distance: 3200 })),
        createSelectedRace("5", createRace({ distance: 2000 })),
        createSelectedRace("6", createRace({ distance: 1600 })),
        createSelectedRace("7", createRace({ distance: 2000 })),
        createSelectedRace("8", createRace({ distance: 2000 })),
        createSelectedRace("9", createRace({ distance: 2000 })),
        createSelectedRace("10", createRace({ distance: 2000 })),
      ];

      const epithet = checkEpithet("Standard Distance Leader", selectedRaces);

      expect(epithet).toBeDefined();
      expect(epithet!.met).toBe(false);
    });

    it("should trigger when complete", () => {
      const selectedRaces = [
        createSelectedRace("1", createRace({ distance: 2000 })),
        createSelectedRace("2", createRace({ distance: 1200 })),
        createSelectedRace("3", createRace({ distance: 2400 })),
        createSelectedRace("4", createRace({ distance: 3200 })),
        createSelectedRace("5", createRace({ distance: 2000 })),
        createSelectedRace("6", createRace({ distance: 1600 })),
        createSelectedRace("7", createRace({ distance: 2000 })),
        createSelectedRace("8", createRace({ distance: 2000 })),
        createSelectedRace("9", createRace({ distance: 2000 })),
        createSelectedRace("10", createRace({ distance: 2000 })),
      ];

      const epithet = checkEpithet("Standard Distance Leader", selectedRaces);

      expect(epithet).toBeDefined();
      expect(epithet!.met).toBe(true);
    });
  });

  describe("Turf Tussler", () => {
    it("should not trigger when missing a race", () => {
      const selectedRaces = [
        createSelectedRace("1", createRace({ distance: 1200 })),
        createSelectedRace("2", createRace({ distance: 1800 })),
        createSelectedRace("3", createRace({ distance: 3000 })),
      ];

      const epithet = checkEpithet("Turf Tussler", selectedRaces);

      expect(epithet).toBeDefined();
      expect(epithet!.met).toBe(false);
    });

    it("should trigger when complete", () => {
      const selectedRaces = [
        createSelectedRace("1", createRace({ distance: 1200 })),
        createSelectedRace("2", createRace({ distance: 1800 })),
        createSelectedRace("3", createRace({ distance: 2200 })),
        createSelectedRace("4", createRace({ distance: 3000 })),
      ];

      const epithet = checkEpithet("Turf Tussler", selectedRaces);

      expect(epithet).toBeDefined();
      expect(epithet!.met).toBe(true);
    });
  });

  describe("Phenomenal", () => {
    it("should not trigger on duplicate race", () => {
      const selectedRaces = [
        createSelectedRace("163", createRace({})),
        createSelectedRace("166", createRace({})),
        createSelectedRace("168", createRace({})),
        createSelectedRace("74", createRace({})),
        createSelectedRace("74_2", createRace({})),
      ];

      const epithet = checkEpithet("Phenomenal", selectedRaces);

      expect(epithet).toBeDefined();
      expect(epithet!.met).toBe(false);
    });

    it("should trigger when complete", () => {
      const selectedRaces = [
        createSelectedRace("163", createRace({})),
        createSelectedRace("166", createRace({})),
        createSelectedRace("168", createRace({})),
        createSelectedRace("74", createRace({})),
        createSelectedRace("3", createRace({})),
      ];

      const epithet = checkEpithet("Phenomenal", selectedRaces);

      expect(epithet).toBeDefined();
      expect(epithet!.met).toBe(true);
    });
  });

  describe("Kanto Conqueror", () => {
    it("should not trigger on non-kanto races", () => {
      const selectedRaces = [
        createSelectedRace("1", createRace({ banner_id: 1, track: 10005 })),
        createSelectedRace("2", createRace({ banner_id: 2, track: 10006 })),
        createSelectedRace("3", createRace({ banner_id: 3, track: 10000 })),
      ];

      const epithet = checkEpithet("Kanto Conqueror", selectedRaces);

      expect(epithet).toBeDefined();
      expect(epithet!.met).toBe(false);
    });

    it("should not trigger on duplicate races", () => {
      const selectedRaces = [
        createSelectedRace("1", createRace({ banner_id: 1, track: 10005 })),
        createSelectedRace("2", createRace({ banner_id: 2, track: 10006 })),
        createSelectedRace("3", createRace({ banner_id: 1, track: 10005 })),
      ];

      const epithet = checkEpithet("Kanto Conqueror", selectedRaces);

      expect(epithet).toBeDefined();
      expect(epithet!.met).toBe(false);
    });

    it("should trigger when complete", () => {
      const selectedRaces = [
        createSelectedRace("1", createRace({ banner_id: 1, track: 10005 })),
        createSelectedRace("2", createRace({ banner_id: 2, track: 10006 })),
        createSelectedRace("3", createRace({ banner_id: 3, track: 10101 })),
      ];

      const epithet = checkEpithet("Kanto Conqueror", selectedRaces);

      expect(epithet).toBeDefined();
      expect(epithet!.met).toBe(true);
    });
  });
});
