import type { DestinationId } from '../data/destinations';
import type { Field } from '../data/universities';

export type GpaScale = '5' | '4' | '100';
export type EnglishTest = 'none' | 'ielts' | 'toefl120' | 'toefl6';

export interface Profile {
  destinations: DestinationId[];
  field: Field;
  focus: string;
  gpaScale: GpaScale;
  gpa: number;
  sat: number | null;
  englishTest: EnglishTest;
  englishScore: number | null;
  hsk: number;
  topik: number;
  teaching: 'english-only' | 'open';
  budgetUsd: number;
  scholarship: 'yes' | 'maybe' | 'no';
  targetYear: 2027 | 2028;
}

export const FOCUS_OPTIONS: Record<Field, string[]> = {
  engineering: ['Robotics', 'Artificial intelligence', 'Mechanical engineering', 'Software engineering'],
  business: ['Management', 'International trade', 'Economics'],
};

export const FIELD_LABEL: Record<Field, string> = {
  engineering: 'Engineering & CS',
  business: 'Business & Finance',
};

export const GPA_LIMITS: Record<GpaScale, { min: number; max: number; step: number; label: string }> = {
  '5': { min: 1, max: 5, step: 0.01, label: '5-point scale (Kazakhstan)' },
  '4': { min: 0, max: 4, step: 0.01, label: '4.0 scale' },
  '100': { min: 0, max: 100, step: 0.1, label: 'Percent (0 to 100)' },
};

export const ENGLISH_LIMITS: Record<Exclude<EnglishTest, 'none'>, { min: number; max: number; step: number; label: string }> = {
  ielts: { min: 0, max: 9, step: 0.5, label: 'IELTS Academic (0 to 9)' },
  toefl120: { min: 0, max: 120, step: 1, label: 'TOEFL iBT, 0 to 120 scale' },
  toefl6: { min: 1, max: 6, step: 0.5, label: 'TOEFL iBT, 1 to 6 scale' },
};

export const BUDGET = { min: 0, max: 45000, step: 500 };

/** Grades as a percentage so different scales can be compared. */
export function gpaPercent(p: Pick<Profile, 'gpa' | 'gpaScale'>): number {
  const max = GPA_LIMITS[p.gpaScale].max;
  return Math.max(0, Math.min(100, (p.gpa / max) * 100));
}

export function emptyProfile(): Profile {
  return {
    destinations: [],
    field: 'engineering',
    focus: '',
    gpaScale: '5',
    gpa: Number.NaN,
    sat: null,
    englishTest: 'none',
    englishScore: null,
    hsk: 0,
    topik: 0,
    teaching: 'english-only',
    budgetUsd: 15000,
    scholarship: 'maybe',
    targetYear: 2027,
  };
}

/** Checks a stored profile still has the expected shape (for example after an update). */
export function isProfile(value: unknown): value is Profile {
  if (!value || typeof value !== 'object') return false;
  const p = value as Partial<Profile>;
  return (
    Array.isArray(p.destinations) &&
    p.destinations.length > 0 &&
    (p.field === 'engineering' || p.field === 'business') &&
    typeof p.gpa === 'number' &&
    Number.isFinite(p.gpa) &&
    typeof p.budgetUsd === 'number' &&
    (p.targetYear === 2027 || p.targetYear === 2028)
  );
}
