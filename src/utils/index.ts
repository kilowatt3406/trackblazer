import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getYearName(year: 1 | 2 | 3): string {
  const names: Record<1 | 2 | 3, string> = {
    1: 'Junior',
    2: 'Classic',
    3: 'Senior',
  };
  return names[year];
}

export function getMonthName(month: number): string {
  const names = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return names[month - 1];
}

export function getGradeLabel(grade: number): string {
  const labels: Record<number, string> = {
    100: 'G1',
    200: 'G2',
    300: 'G3',
    400: 'OP',
    700: 'URA',
  };
  return labels[grade] || 'Unknown';
}

export function getTerrainLabel(terrain: number): string {
  const labels: Record<number, string> = {
    1: 'Turf',
    2: 'Dirt',
  };
  return labels[terrain] || 'Unknown';
}

export function getDistanceClass(distance: number): string {
  if (distance < 1600) return 'short';
  if (distance < 2000) return 'mile';
  if (distance < 2400) return 'medium';
  return 'long';
}

export function getRankColor(rank: 1 | 2 | 3): string {
  const colors: Record<1 | 2 | 3, string> = {
    1: 'text-amber-600 bg-amber-100 border-amber-300',
    2: 'text-gray-600 bg-gray-100 border-gray-300',
    3: 'text-yellow-600 bg-yellow-100 border-yellow-300',
  };
  return colors[rank];
}

export function getRankLabel(rank: 1 | 2 | 3): string {
  const labels: Record<1 | 2 | 3, string> = {
    1: 'Bronze',
    2: 'Silver',
    3: 'Gold',
  };
  return labels[rank];
}
