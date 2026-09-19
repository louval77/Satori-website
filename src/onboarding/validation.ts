import type { DestinationId } from '../data/destinations';
import type { Field } from '../data/universities';
import { ENGLISH_LIMITS, GPA_LIMITS, type EnglishTest, type GpaScale, type HousingPreference, type Profile } from '../lib/profile';

/** Everything the form holds while the user is typing (numbers stay strings until validated). */
export interface Draft {
  destinations: DestinationId[];
  teaching: 'english-only' | 'open';
  field: Field | '';
  focus: string;
  gpaScale: GpaScale;
  gpa: string;
  sat: string;
  englishTest: EnglishTest;
  englishScore: string;
  hsk: string;
  topik: string;
  budgetUsd: number;
  scholarship: 'yes' | 'maybe' | 'no' | '';
  housing: HousingPreference | '';
  targetYear: '2027' | '2028' | '';
}

export type Errors = Partial<Record<keyof Draft, string>>;

export const STEPS = ['Destinations', 'Field', 'Grades and tests', 'Budget and housing', 'Start date'] as const;

export function draftFromProfile(p: Profile | null): Draft {
  if (!p) {
    return {
      destinations: [],
      teaching: 'english-only',
      field: '',
      focus: '',
      gpaScale: '5',
      gpa: '',
      sat: '',
      englishTest: 'none',
      englishScore: '',
      hsk: '0',
      topik: '0',
      budgetUsd: 15000,
      scholarship: '',
      housing: '',
      targetYear: '',
    };
  }
  return {
    destinations: p.destinations,
    teaching: p.teaching,
    field: p.field,
    focus: p.focus,
    gpaScale: p.gpaScale,
    gpa: String(p.gpa),
    sat: p.sat === null ? '' : String(p.sat),
    englishTest: p.englishTest,
    englishScore: p.englishScore === null ? '' : String(p.englishScore),
    hsk: String(p.hsk),
    topik: String(p.topik),
    budgetUsd: p.budgetUsd,
    scholarship: p.scholarship,
    housing: p.housing ?? '',
    targetYear: String(p.targetYear) as '2027' | '2028',
  };
}

/** Accepts "4,5" as well as "4.5". Returns NaN for anything that is not a plain number. */
export function parseNumber(raw: string): number {
  const s = raw.trim().replace(',', '.');
  if (!/^\d+(\.\d+)?$/.test(s)) return Number.NaN;
  return Number(s);
}

function onStep(value: number, step: number): boolean {
  const n = value / step;
  return Math.abs(n - Math.round(n)) < 1e-6;
}

export function validateStep(step: number, d: Draft): Errors {
  const e: Errors = {};
  if (step === 0) {
    if (d.destinations.length === 0) e.destinations = 'Choose at least one destination.';
  }
  if (step === 1) {
    if (!d.field) e.field = 'Choose Engineering & CS or Business & Finance.';
    if (!d.focus) e.focus = 'Choose the area you are most interested in.';
  }
  if (step === 2) {
    const lim = GPA_LIMITS[d.gpaScale];
    const gpa = parseNumber(d.gpa);
    if (!d.gpa.trim()) e.gpa = 'Enter your average grade.';
    else if (Number.isNaN(gpa)) e.gpa = 'Use numbers only, for example 4.6.';
    else if (gpa < lim.min || gpa > lim.max) e.gpa = `On the ${lim.label} the grade must be between ${lim.min} and ${lim.max}.`;

    if (d.sat.trim()) {
      const sat = parseNumber(d.sat);
      if (Number.isNaN(sat) || sat < 400 || sat > 1600 || !onStep(sat, 10)) e.sat = 'SAT totals run from 400 to 1600 in steps of 10. Leave empty if you have none.';
    }

    if (d.englishTest !== 'none') {
      const lim2 = ENGLISH_LIMITS[d.englishTest];
      const score = parseNumber(d.englishScore);
      if (!d.englishScore.trim()) e.englishScore = 'Enter your score, or choose "No test yet".';
      else if (Number.isNaN(score) || score < lim2.min || score > lim2.max || !onStep(score, lim2.step))
        e.englishScore = `${lim2.label}: enter a value from ${lim2.min} to ${lim2.max}${lim2.step < 1 ? ` in steps of ${lim2.step}` : ''}.`;
    }
  }
  if (step === 3) {
    if (!d.scholarship) e.scholarship = 'Tell us whether you need a scholarship.';
    if (!d.housing) e.housing = 'Tell us where you would like to live.';
  }
  if (step === 4) {
    if (!d.targetYear) e.targetYear = 'Choose when you want to start.';
  }
  return e;
}

export function toProfile(d: Draft): Profile {
  const showHsk = d.teaching === 'open' && d.destinations.includes('CN');
  const showTopik = d.teaching === 'open' && d.destinations.includes('KR');
  return {
    destinations: d.destinations,
    teaching: d.teaching,
    field: d.field as Field,
    focus: d.focus,
    gpaScale: d.gpaScale,
    gpa: parseNumber(d.gpa),
    sat: d.sat.trim() ? parseNumber(d.sat) : null,
    englishTest: d.englishTest,
    englishScore: d.englishTest === 'none' ? null : parseNumber(d.englishScore),
    hsk: showHsk ? Number(d.hsk) : 0,
    topik: showTopik ? Number(d.topik) : 0,
    budgetUsd: d.budgetUsd,
    scholarship: (d.scholarship || 'maybe') as Profile['scholarship'],
    housing: d.housing || 'unsure',
    targetYear: d.targetYear === '2028' ? 2028 : 2027,
  };
}
