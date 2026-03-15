import { describe, it, expect } from 'vitest';
import { calculateEpithetProgress } from '../utils/epithetProgress';
import { Race } from '../types';

const createRace = (overrides: Partial<Race> = {}): Race => ({
  id: 100001,
  banner_id: 1001,
  race_id: 1001,
  name_en: 'Test Race',
  name_jp: 'テストレース',
  name_ko: '테스트레이스',
  name_tw: '測試賽馬',
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
  factor: { effect_1: 'test', effect_2: 'speed' },
  list_ura: [],
  url_name: 'test-race',
  ...overrides,
});

const createSelectedRace = (uraId: string, race: Race, year: number = 2) => ({
  uraId,
  race,
  year,
});

describe('Epithet Progress Calculation', () => {
  describe('named_races', () => {
    it('should count progress when required race is selected', () => {
      const selectedRaces = [
        createSelectedRace('163', createRace({ id: 100501, name_en: 'Satsuki Sho' }), 2),
      ];
      
      const progress = calculateEpithetProgress(selectedRaces);
      const epithet = progress.find(p => p.epithet.name_en_gl === 'Stunning');
      
      expect(epithet).toBeDefined();
      expect(epithet!.progress).toBe(1);
      expect(epithet!.target).toBe(3);
      expect(epithet!.met).toBe(false);
    });

    it('should mark as met when all required races are selected', () => {
      const selectedRaces = [
        createSelectedRace('163', createRace({ id: 100501, name_en: 'Satsuki Sho' }), 2),
        createSelectedRace('166', createRace({ id: 101001, name_en: 'Tokyo Yushun' }), 2),
        createSelectedRace('168', createRace({ id: 101501, name_en: 'Kikuka Sho' }), 2),
      ];
      
      const progress = calculateEpithetProgress(selectedRaces);
      const epithet = progress.find(p => p.epithet.name_en_gl === 'Stunning');
      
      expect(epithet).toBeDefined();
      expect(epithet!.progress).toBe(3);
      expect(epithet!.target).toBe(3);
      expect(epithet!.met).toBe(true);
    });

    it('should handle multiple URA IDs for same race', () => {
      const selectedRaces = [
        createSelectedRace('76', createRace({ id: 101601, name_en: 'Tenno Sho (Autumn)' }), 2),
      ];
      
      const progress = calculateEpithetProgress(selectedRaces);
      const epithet = progress.find(p => p.epithet.name_en_gl === 'Shield Bearer');
      
      expect(epithet).toBeDefined();
      expect(epithet!.progress).toBe(1);
      // Each named_races requirement contributes 1 if met
      expect(epithet!.target).toBe(2);
    });
  });

  describe('race_count', () => {
    it('should count races by terrain', () => {
      const selectedRaces = [
        createSelectedRace('1', createRace({ id: 100001, terrain: 2, grade: 100 }), 2),
        createSelectedRace('2', createRace({ id: 100002, terrain: 2, grade: 100 }), 2),
        createSelectedRace('3', createRace({ id: 100003, terrain: 2, grade: 100 }), 2),
      ];
      
      const progress = calculateEpithetProgress(selectedRaces);
      const epithet = progress.find(p => p.epithet.name_en_gl === 'Dirty Work');
      
      expect(epithet).toBeDefined();
      expect(epithet!.progress).toBe(3);
      expect(epithet!.target).toBe(5);
      expect(epithet!.met).toBe(false);
    });

    it('should count races by grade', () => {
      const selectedRaces = [
        createSelectedRace('1', createRace({ id: 100001, grade: 400 }), 2),
        createSelectedRace('2', createRace({ id: 100002, grade: 400 }), 2),
      ];
      
      const progress = calculateEpithetProgress(selectedRaces);
      const epithet = progress.find(p => p.epithet.name_en_gl === 'Pro Racer');
      
      expect(epithet).toBeDefined();
      expect(epithet!.progress).toBe(2);
      expect(epithet!.target).toBe(10);
    });

    it('should count races by distance range', () => {
      const selectedRaces = [
        createSelectedRace('1', createRace({ distance: 2100 }), 2),
        createSelectedRace('2', createRace({ distance: 2200 }), 2),
      ];
      
      const progress = calculateEpithetProgress(selectedRaces);
      const epithet = progress.find(p => p.epithet.name_en_gl === 'Standard Distance Leader');
      
      expect(epithet).toBeDefined();
      expect(epithet!.progress).toBe(2);
      expect(epithet!.target).toBe(10);
    });
  });

  describe('g1_count', () => {
    it('should count G1 dirt races', () => {
      const selectedRaces = [
        createSelectedRace('1', createRace({ grade: 100, terrain: 2 }), 2),
        createSelectedRace('2', createRace({ grade: 100, terrain: 2 }), 2),
        createSelectedRace('3', createRace({ grade: 100, terrain: 2 }), 2),
      ];
      
      const progress = calculateEpithetProgress(selectedRaces);
      const epithet = progress.find(p => p.epithet.name_en_gl === 'Dirt G1 Achiever');
      
      expect(epithet).toBeDefined();
      expect(epithet!.progress).toBe(3);
      expect(epithet!.target).toBe(3);
      expect(epithet!.met).toBe(true);
    });

    it('should not count turf G1 races for dirt epithet', () => {
      const selectedRaces = [
        createSelectedRace('1', createRace({ grade: 100, terrain: 1 }), 2),
      ];
      
      const progress = calculateEpithetProgress(selectedRaces);
      const epithet = progress.find(p => p.epithet.name_en_gl === 'Dirt G1 Achiever');
      
      expect(epithet).toBeDefined();
      expect(epithet!.progress).toBe(0);
    });
  });

  describe('terrain_distances', () => {
    it('should track terrain and distance combinations', () => {
      const selectedRaces = [
        createSelectedRace('1', createRace({ terrain: 1, distance: 1200 }), 2), // turf short
        createSelectedRace('2', createRace({ terrain: 1, distance: 1600 }), 2), // turf mile
        createSelectedRace('3', createRace({ terrain: 1, distance: 2200 }), 2), // turf medium
      ];
      
      const progress = calculateEpithetProgress(selectedRaces);
      const epithet = progress.find(p => p.epithet.name_en_gl === 'Turf Tussler');
      
      expect(epithet).toBeDefined();
      expect(epithet!.progress).toBe(3);
      expect(epithet!.target).toBe(4);
      expect(epithet!.met).toBe(false);
    });

    it('should require all terrain/distance categories', () => {
      const selectedRaces = [
        createSelectedRace('1', createRace({ terrain: 2, distance: 1200 }), 2), // dirt short
        createSelectedRace('2', createRace({ terrain: 2, distance: 1600 }), 2), // dirt mile
        createSelectedRace('3', createRace({ terrain: 2, distance: 2000 }), 2), // dirt medium
      ];
      
      const progress = calculateEpithetProgress(selectedRaces);
      const epithet = progress.find(p => p.epithet.name_en_gl === 'Dirt Dancer');
      
      expect(epithet).toBeDefined();
      expect(epithet!.progress).toBe(3);
      expect(epithet!.target).toBe(3);
      expect(epithet!.met).toBe(true);
    });
  });

  describe('track', () => {
    it('should count races at specific tracks', () => {
      const selectedRaces = [
        createSelectedRace('1', createRace({ track: 102 }), 2), // Sapporo
        createSelectedRace('2', createRace({ track: 103 }), 2), // Hakodate
      ];
      
      const progress = calculateEpithetProgress(selectedRaces);
      const epithet = progress.find(p => p.epithet.name_en_gl === 'Hokkaido Hotshot');
      
      expect(epithet).toBeDefined();
      expect(epithet!.progress).toBe(2);
      expect(epithet!.target).toBe(3);
    });
  });

  describe('consecutive', () => {
    it('should detect consecutive wins', () => {
      const selectedRaces = [
        createSelectedRace('1025', createRace({ id: 110401, name_en: 'JBC Sprint' }), 2),
        createSelectedRace('1025_2', createRace({ id: 110401, name_en: 'JBC Sprint' }), 3),
      ];
      
      const progress = calculateEpithetProgress(selectedRaces);
      const epithet = progress.find(p => p.epithet.name_en_gl === 'Dirt Sprinter');
      
      expect(epithet).toBeDefined();
      expect(epithet!.progress).toBe(2);
      expect(epithet!.target).toBe(2);
      expect(epithet!.met).toBe(true);
    });

    it('should not count non-consecutive wins', () => {
      const selectedRaces = [
        createSelectedRace('1025_2', createRace({ id: 110401, name_en: 'JBC Sprint' }), 3),
      ];
      
      const progress = calculateEpithetProgress(selectedRaces);
      const epithet = progress.find(p => p.epithet.name_en_gl === 'Dirt Sprinter');
      
      expect(epithet).toBeDefined();
      expect(epithet!.progress).toBe(1);
    });
  });

  describe('epithet_dep', () => {
    it('should depend on other epithets being met', () => {
      const selectedRaces = [
        createSelectedRace('163', createRace({ id: 100501 }), 2),
        createSelectedRace('166', createRace({ id: 101001 }), 2),
        createSelectedRace('168', createRace({ id: 101501 }), 2),
      ];
      
      const progress = calculateEpithetProgress(selectedRaces);
      const stunning = progress.find(p => p.epithet.name_en_gl === 'Stunning');
      const legendary = progress.find(p => p.epithet.name_en_gl === 'Legendary');
      
      expect(stunning!.met).toBe(true);
      expect(legendary!.met).toBe(false);
    });

    it('should infer epithets from progress', () => {
      const selectedRaces = [
        createSelectedRace('3', createRace({ id: 100301 }), 3),
        createSelectedRace('4', createRace({ id: 100601 }), 3),
        createSelectedRace('74_2', createRace({ id: 101201 }), 3),
      ];
      
      const progress = calculateEpithetProgress(selectedRaces);
      const springChampion = progress.find(p => p.epithet.name_en_gl === 'Spring Champion');
      
      expect(springChampion!.met).toBe(true);
    });
  });

  describe('year_race', () => {
    it('should require race in specific year', () => {
      // Lady epithet (id 200): Oka Sho + Japanese Oaks + Shuka Sho
      // Heroine: Lady epithet + QEII Cup in Year 2
      const selectedRaces = [
        createSelectedRace('162', createRace({ id: 100401 }), 2),
        createSelectedRace('165', createRace({ id: 100901 }), 2),
        createSelectedRace('167', createRace({ id: 101401 }), 2),
        createSelectedRace('77', createRace({ id: 101701 }), 2),
      ];
      
      const progress = calculateEpithetProgress(selectedRaces);
      const epithet = progress.find(p => p.epithet.name_en_gl === 'Heroine');
      
      expect(epithet).toBeDefined();
      expect(epithet!.met).toBe(true);
    });

    it('should not count race in wrong year', () => {
      const selectedRaces = [
        createSelectedRace('77_2', createRace({ id: 101701 }), 3),
      ];
      
      const progress = calculateEpithetProgress(selectedRaces);
      const epithet = progress.find(p => p.epithet.name_en_gl === 'Heroine');
      
      expect(epithet).toBeDefined();
      expect(epithet!.met).toBe(false);
    });
  });

  describe('integration', () => {
    it('should calculate multiple epithets correctly', () => {
      const selectedRaces = [
        createSelectedRace('162', createRace({ id: 100401, grade: 100, terrain: 1, distance: 1600 }), 2),
        createSelectedRace('163', createRace({ id: 100501, grade: 100, terrain: 1, distance: 2000 }), 2),
        createSelectedRace('165', createRace({ id: 100901, grade: 100, terrain: 1, distance: 2400 }), 2),
        createSelectedRace('167', createRace({ id: 101401, grade: 100, terrain: 1, distance: 2000 }), 2),
      ];
      
      const progress = calculateEpithetProgress(selectedRaces);
      
      const heroine = progress.find(p => p.epithet.name_en_gl === 'Lady');
      expect(heroine!.met).toBe(true);
      
      const dirtAdept = progress.find(p => p.epithet.name_en_gl === 'Dirty Work');
      expect(dirtAdept!.progress).toBe(0);
    });
  });
});
