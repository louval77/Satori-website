/*
 * Profile fit forecast.
 *
 * This is NOT an admission probability. No public dataset exists that would let us
 * predict admission for these universities. The score only measures how well a
 * profile matches the requirements, costs, scholarships and dates the universities
 * publish. Every point is explained to the user on the dashboard.
 *
 * Weights (total 100):
 *   Language readiness  35   compared with published test minimums
 *   Budget fit          25   published tuition vs the budget you entered
 *   Scholarship support 15   only when you said you need funding
 *   Academic record     15   your grades (the same rule for every university)
 *   Timing              10   whether an application window is open or ahead
 */
import { UNIVERSITIES, type ProgramOption, type University, type Scholarship, type Field } from '../data/universities';
import { toUsd } from '../data/rates';
import { gpaPercent, type Profile } from './profile';

export const WEIGHTS = { language: 35, budget: 25, scholarship: 15, academic: 15, timing: 10 } as const;
export type FactorKey = keyof typeof WEIGHTS;

export const FACTOR_LABEL: Record<FactorKey, string> = {
  language: 'Language readiness',
  budget: 'Budget fit',
  scholarship: 'Scholarship support',
  academic: 'Academic record',
  timing: 'Timing',
};

export interface Factor {
  key: FactorKey;
  points: number;
  max: number;
  note: string;
  /** true = listed under "why it fits", false = listed under "what to work on" */
  good: boolean;
}

type RawFactor = Omit<Factor, 'good'>;

/** Which results count as strengths. Everything else is shown as something to work on. */
function isGood(f: RawFactor): boolean {
  switch (f.key) {
    case 'language':
      return f.points >= 28;
    case 'scholarship':
      return f.points >= 10;
    case 'academic':
      return f.points >= 11;
    default:
      return f.points === f.max;
  }
}

export type WindowStatus = 'open' | 'upcoming' | 'closed' | 'unpublished';

export interface Match {
  university: University;
  option: ProgramOption;
  score: number;
  factors: Factor[];
  reasons: string[];
  gaps: string[];
  tuitionUsdYear: number | null;
  windowStatus: WindowStatus;
  windowText: string;
}

const SCALE_NAME = { ielts: 'IELTS', toefl120: 'TOEFL iBT', toefl6: 'TOEFL iBT (new scale)' } as const;
const CLOSE_GAP = { ielts: 0.5, toefl120: 10, toefl6: 0.5 } as const;

function annualTuitionUsd(option: ProgramOption): number | null {
  if (!option.tuition) return null;
  const perYear = option.tuition.amount * (option.tuition.per === 'semester' ? 2 : 1);
  return toUsd(perYear, option.tuition.currency);
}

function teachingAllowed(option: ProgramOption, profile: Profile): boolean {
  if (profile.teaching === 'open') return true;
  return option.teaching === 'English' || option.teaching === 'English + Japanese';
}

function englishMeets(option: ProgramOption, profile: Profile): boolean {
  const req = option.english;
  if (!req || profile.englishTest === 'none' || profile.englishScore === null) return false;
  const needed = req[profile.englishTest];
  return needed !== undefined && profile.englishScore >= needed;
}

function languageFactor(u: University, option: ProgramOption, profile: Profile): RawFactor {
  const max = WEIGHTS.language;

  // Programmes taught in Chinese or Korean.
  if (option.local) {
    const req = option.local;
    const have = req.test === 'HSK' ? profile.hsk : profile.topik;
    if (have >= req.level) {
      return { key: 'language', max, points: max, note: `Your ${req.test} ${have} meets the ${req.test} ${req.level} requirement.` };
    }
    if (option.eitherLanguage && englishMeets(option, profile)) {
      return {
        key: 'language',
        max,
        points: 28,
        note: `${u.shortName} accepts your English score instead of ${req.test}, but most classes are taught in ${option.teaching}.`,
      };
    }
    if (have === req.level - 1) {
      return { key: 'language', max, points: 18, note: `You need ${req.test} ${req.level}; you are one level away (${req.test} ${have}).` };
    }
    return {
      key: 'language',
      max,
      points: 6,
      note: have > 0 ? `You need ${req.test} ${req.level}; you have ${req.test} ${have}.` : `You need ${req.test} ${req.level} for this programme.`,
    };
  }

  // Programmes taught in English (or English then Japanese).
  const req = option.english;
  if (profile.englishTest === 'none' || profile.englishScore === null) {
    const target = req?.ielts ? ` (IELTS ${req.ielts} ${req.kind === 'typical' ? 'is typical' : 'minimum'})` : '';
    return { key: 'language', max, points: 14, note: `No English test yet. Book IELTS or TOEFL${target}.` };
  }
  const test = profile.englishTest;
  const score = profile.englishScore;
  if (!req) {
    return {
      key: 'language',
      max,
      points: 24,
      note: `We could not find a published minimum on ${u.shortName}'s pages; check the application guide.`,
    };
  }
  const needed = req[test];
  if (needed === undefined) {
    if (req.kind === 'unspecified') {
      return { key: 'language', max, points: 28, note: `${u.shortName} asks for an English test but publishes no minimum score.` };
    }
    const alt = req.ielts !== undefined ? `IELTS ${req.ielts}` : req.toefl120 !== undefined ? `TOEFL ${req.toefl120}` : 'its published score';
    return { key: 'language', max, points: 22, note: `${u.shortName} publishes ${alt}, not a ${SCALE_NAME[test]} minimum. Compare carefully.` };
  }
  const label = req.kind === 'typical' ? 'typical admitted score' : 'minimum';
  if (score >= needed) {
    return {
      key: 'language',
      max,
      points: req.kind === 'typical' ? 33 : max,
      note: `Your ${SCALE_NAME[test]} ${score} meets the ${label} of ${needed}.`,
    };
  }
  if (needed - score <= CLOSE_GAP[test]) {
    return { key: 'language', max, points: 20, note: `Your ${SCALE_NAME[test]} ${score} is just under the ${label} of ${needed}. A retake could close it.` };
  }
  return { key: 'language', max, points: 8, note: `Your ${SCALE_NAME[test]} ${score} is below the ${label} of ${needed}.` };
}

function budgetFactor(u: University, option: ProgramOption, profile: Profile, tuitionUsd: number | null): RawFactor {
  const max = WEIGHTS.budget;
  if (option.coveredForAll && tuitionUsd === null) {
    return { key: 'budget', max, points: max, note: 'Tuition is waived for every admitted international student.' };
  }
  if (tuitionUsd === null) {
    return { key: 'budget', max, points: 12, note: `${u.shortName} fee not published on the pages we checked, so this factor is neutral.` };
  }
  const effective = option.coveredForAll ? 0 : tuitionUsd;
  if (option.coveredForAll) {
    return { key: 'budget', max, points: max, note: 'Tuition is covered for every admitted international student.' };
  }
  const budget = profile.budgetUsd;
  const ratio = budget > 0 ? effective / budget : Infinity;
  if (ratio <= 1) return { key: 'budget', max, points: max, note: 'Tuition fits inside your yearly budget.' };
  if (ratio <= 1.25) return { key: 'budget', max, points: 15, note: 'Tuition is up to 25% above your budget.' };
  if (ratio <= 1.6) return { key: 'budget', max, points: 7, note: 'Tuition is 25% to 60% above your budget.' };
  return { key: 'budget', max, points: 0, note: 'Tuition is far above your budget without a scholarship.' };
}

const SCHOLARSHIP_POINTS: Record<Scholarship['kind'], number> = {
  'automatic-all': 15,
  'merit-auto': 11,
  government: 10,
  merit: 8,
};

function scholarshipFactor(u: University, profile: Profile): RawFactor {
  const max = WEIGHTS.scholarship;
  if (profile.scholarship === 'no') {
    return { key: 'scholarship', max, points: max, note: 'You said you do not need a scholarship.' };
  }
  const best = [...u.scholarships].sort((a, b) => SCHOLARSHIP_POINTS[b.kind] - SCHOLARSHIP_POINTS[a.kind])[0];
  if (!best) return { key: 'scholarship', max, points: 3, note: 'No scholarship listed on the pages we checked.' };
  const text: Record<Scholarship['kind'], string> = {
    'automatic-all': `${best.name} goes to every admitted international student.`,
    'merit-auto': `${best.name}: you are considered automatically.`,
    government: `${best.name} is available.`,
    merit: `${best.name} is merit-based and competitive.`,
  };
  return { key: 'scholarship', max, points: SCHOLARSHIP_POINTS[best.kind], note: text[best.kind] };
}

function academicFactor(u: University, profile: Profile): RawFactor {
  const max = WEIGHTS.academic;
  const pct = gpaPercent(profile);
  let points = pct >= 90 ? 15 : pct >= 80 ? 11 : pct >= 70 ? 7 : 3;
  let note =
    pct >= 90
      ? 'Your grades are in the top band of our scale.'
      : pct >= 80
        ? 'Your grades are strong; these universities are very selective.'
        : 'These universities are very selective; stronger grades would help.';
  if (u.sat && profile.sat !== null) {
    if (profile.sat < u.sat.value) {
      points = Math.max(0, points - 4);
      note = `Your SAT ${profile.sat} is below ${u.shortName}'s ${u.sat.kind === 'minimum' ? 'minimum' : 'typical range starting at'} ${u.sat.value}.`;
    } else {
      note += ` Your SAT meets ${u.shortName}'s ${u.sat.kind === 'minimum' ? 'minimum' : 'typical range'}.`;
    }
  }
  return { key: 'academic', max, points, note };
}

export function windowStatusFor(u: University, targetYear: number, today: Date): { status: WindowStatus; text: string } {
  const windows = u.windows.filter((w) => w.entryYear === targetYear);
  if (windows.length === 0) {
    return { status: 'unpublished', text: u.lastCycle ?? `${targetYear} dates are not published yet.` };
  }
  const day = today.toISOString().slice(0, 10);
  const statuses = windows.map((w) => {
    if (w.to && w.to < day) return { w, s: 'closed' as const };
    if (w.from && w.from > day) return { w, s: 'upcoming' as const };
    if (!w.from && !w.to) return { w, s: 'unpublished' as const };
    // Only a deadline is published: the window is ahead, but we cannot say it has opened.
    if (!w.from) return { w, s: 'upcoming' as const };
    return { w, s: 'open' as const };
  });
  const pick =
    statuses.find((x) => x.s === 'open') ??
    statuses.find((x) => x.s === 'upcoming') ??
    statuses.find((x) => x.s === 'unpublished') ??
    statuses[0]!;
  return { status: pick.s, text: `${pick.w.intake}. ${pick.w.text}` };
}

function timingFactor(status: WindowStatus, targetYear: number): RawFactor {
  const max = WEIGHTS.timing;
  switch (status) {
    case 'open':
      return { key: 'timing', max, points: max, note: 'Applications are open now.' };
    case 'upcoming':
      return { key: 'timing', max, points: max, note: 'The next application window is still ahead of you.' };
    case 'unpublished':
      return { key: 'timing', max, points: 6, note: `${targetYear} dates are not published yet.` };
    case 'closed':
      return { key: 'timing', max, points: 2, note: `The ${targetYear} window has closed. Consider the next intake.` };
  }
}

function scoreOption(u: University, option: ProgramOption, profile: Profile, today: Date): Match {
  const tuitionUsdYear = annualTuitionUsd(option);
  const { status, text } = windowStatusFor(u, profile.targetYear, today);
  const factors: Factor[] = [
    languageFactor(u, option, profile),
    budgetFactor(u, option, profile, tuitionUsdYear),
    scholarshipFactor(u, profile),
    academicFactor(u, profile),
    timingFactor(status, profile.targetYear),
  ].map((f) => ({ ...f, good: isGood(f) }));
  const score = Math.round(Math.max(0, Math.min(100, factors.reduce((s, f) => s + f.points, 0))));
  const reasons = factors.filter((f) => f.good).map((f) => f.note);
  const gaps = factors.filter((f) => !f.good).map((f) => f.note);
  return { university: u, option, score, factors, reasons, gaps, tuitionUsdYear, windowStatus: status, windowText: text };
}

/** Ranks every eligible university for a profile, best first. */
export function rankUniversities(profile: Profile, today: Date = new Date()): Match[] {
  const field: Field = profile.field;
  const matches: Match[] = [];
  for (const u of UNIVERSITIES) {
    if (!profile.destinations.includes(u.destination)) continue;
    const options = (u.programs[field] ?? []).filter((o) => teachingAllowed(o, profile));
    if (options.length === 0) continue;
    const best = options
      .map((o) => scoreOption(u, o, profile, today))
      .sort((a, b) => b.score - a.score || (a.tuitionUsdYear ?? Infinity) - (b.tuitionUsdYear ?? Infinity))[0];
    if (best) matches.push(best);
  }
  return matches.sort((a, b) => b.score - a.score || (a.tuitionUsdYear ?? Infinity) - (b.tuitionUsdYear ?? Infinity));
}

/** Universities that exist for the chosen field and places but were filtered out by teaching language. */
export function hiddenByLanguage(profile: Profile): University[] {
  if (profile.teaching === 'open') return [];
  return UNIVERSITIES.filter(
    (u) =>
      profile.destinations.includes(u.destination) &&
      (u.programs[profile.field] ?? []).length > 0 &&
      !(u.programs[profile.field] ?? []).some((o) => teachingAllowed(o, profile)),
  );
}
